'use strict'

const fs = require('fs')

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

let assembleStreamsToCourseStrings = function (plan) {
  for (let group in plan) {
    let output = []
    let buffer = { course: [], equals: [] }
    let linked = { course: false, equals: false }
    let flush = function () {
      if (buffer.course.length && buffer.equals.length) {
        output.push({
          course: buffer.course.join(' ').replace(/\r/g, ''),
          equals: buffer.equals.join(' ').replace(/\r/g, '')
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
      if (string.course.match(/(OR)|(AND)|(\s&\s\s)/)) linked.course = true
      if (string.equals.match(/(OR)|(AND)|(\s&\s\s)/)) linked.equals = true
      if (string.course.match(/\([0-9]\)/)) linked.course = false
      if (string.equals.match(/\([0-9]\)/)) linked.equals = false
      buffer.course.push(string.course)
      buffer.equals.push(string.equals)
    }
    flush()
    logObject(output)
    plan[group] = output
  }
}

module.exports = function () {
  let agreement = fs.readFileSync('./server/agreement.txt', 'UTF8')
  let plan = { required: [], or: [], recommended: [] }
  splitAgreementToGroupStreams(agreement, plan)
  assembleStreamsToCourseStrings(plan)
  // logObject(plan)
}
