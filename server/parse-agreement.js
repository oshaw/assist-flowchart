'use strict'

const fs = require('fs')
const S = require('string')

let logObject = function (object) {
  console.log(JSON.stringify(object, null, 4))
}
let isLineOrHeader = function (line) {
  line = line.toLowerCase()
  let tests = [
    function (line) { return line.match(/(from).*(list)/) }
  ]
  for (let test of tests) { if (test(line)) return true }
}
let isLineRecommendedHeader = function (line) {
  line = line.toLowerCase()
  let tests = [
    function (line) { return line.match(/strongly recommended/) }
  ]
  for (let test of tests) { if (test(line)) return true }
}

let splitAgreementToGroupStreams = function (agreement, plan) {
  let lines = agreement.substring(agreement.indexOf('|') - 41).split('\n')
  let output = plan.required
  for (let line of lines) {
    if (!line.match(/\|/)) {
      if (isLineOrHeader(line)) output = plan.or
      if (isLineRecommendedHeader(line)) output = plan.recommended
      continue
    }
    output.push(line)
  }
}
let sortStreamsByBlock = function (plan) {
  for (let group in plan) {
    let output = []
    let buffer = { course: [], equals: [] }
    let linked = { course: false, equals: false }
    let flush = function () {
      if (buffer.course.length && buffer.equals.length) {
        output.push({
          course: { raw: buffer.course },
          equals: { raw: buffer.equals }
        })
        buffer = { course: [], equals: [] }
        linked = { course: false, equals: false }
      }
    }
    for (let line of plan[group]) {
      let string = {
        course: line.match(/[^|]*$/)[0],
        equals: line.match(/^(.*)(?=\|)/)[0]
      }
      if (string.course.match(/\([0-9]\)/) ||
          string.equals.match(/\([0-9]\)/)) {
        if (!linked.course &&
            !linked.equals) flush()
      }
      if (string.course.match(/\([0-9]\)/)) linked.course = false
      if (string.equals.match(/\([0-9]\)/)) linked.equals = false
      if (string.course.match(/(\s\sOR)|(\s\sAND)|(\s&\s\s)/)) {
        linked.course = true
      }
      if (string.equals.match(/(\s\sOR)|(\s\sAND)|(\s&\s\s)/)) {
        linked.equals = true
      }
      buffer.course.push(string.course.replace(/\r/g, ''))
      buffer.equals.push(string.equals.replace(/\r/g, ''))
    }
    flush()
    plan[group] = output
  }
}
let parseOr = function (group) {
  for (let block of group) {
    if (block.course.raw.join('').match(/\s\sOR/)) {
      let isParallel = block.equals.raw.join('').match(/\s\sOR/)
      let output = (isParallel)
        ? { relation: 'parallel or', options: [] }
        : { course: { relation: 'or', options: [] }, equals: block.equals }
      let buffer = (isParallel) ? { course: [], equals: [] } : []
      let flush = function () {
        if (isParallel) {
          output.options.push({ course: {
            raw: buffer.course,
            equals: buffer.equals
          } })
          buffer = { course: [], equals: [] }
        } else {
          output.course.options.push({ raw: buffer })
          buffer = []
        }
      }
      for (let i = 0; i < block.course.raw.length; i++) {
        if (block.course.raw[i].match(/\s\sOR/)) {
          flush()
          continue
        }
        if (isParallel) {
          buffer.course.push(block.course.raw[i])
          buffer.equals.push(block.equals.raw[i])
        } else buffer.push(block.course.raw[i])
      }
      flush()
      block = output
      logObject(block)
    }
  }
}

module.exports = function () {
  let agreement = fs.readFileSync('./server/agreement.txt', 'UTF8')
  let plan = { required: [], or: [], recommended: [] }
  splitAgreementToGroupStreams(agreement, plan)
  sortStreamsByBlock(plan)
  parseOr(plan.required)
  // logObject(plan)
}
