'use strict'

let isLineOrHeader = function (line) {
  line = line.toLowerCase()
  let tests = [
    function (line) { return line.match(/(from).*(list)/) },
    function (line) { return line.match(/(following).*(groups)/) }
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
let collapseWhitespace = function (string) {
  return string.replace(/\s+/g, ' ')
}

let splitAgreementToGroupStreams = function (agreement) {
  let lines = agreement.substring(agreement.indexOf('|') - 41).split('\n')
  let plan = { required: [] }
  let output = plan.required
  for (let line of lines) {
    if (!line.match(/\|/)) {
      if (isLineOrHeader(line)) {
        plan.or = []
        output = plan.or
      }
      if (isLineRecommendedHeader(line)) {
        plan.recommended = []
        output = plan.recommended
      }
      continue
    }
    output.push(line)
  }
  return plan
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
      if (string.course.match(/\([0-9]\)/)) {
        linked = { course: false, equals: false }
      }
      if (string.equals.match(/\([0-9]\)/)) {
        linked = { course: false, equals: false }
      }
      if (string.course.match(/(\s\sOR)|(\s\sAND)|([0-Z]\s*&\s*[0-Z])/)) {
        linked.course = true
      }
      if (string.equals.match(/(\s\sOR)|(\s\sAND)|([0-Z]\s*&\s*[0-Z])/)) {
        linked.equals = true
      }
      buffer.course.push(string.course.replace(/\r/g, ''))
      buffer.equals.push(string.equals.replace(/\r/g, ''))
    }
    flush()
    plan[group] = output
  }
}
let parseAnd = function (plan) {
  for (let group in plan) {
    for (let i = 0; i < plan[group].length; i++) {
      let block = plan[group][i]
      if (block.course.raw.join('').match(/\s\sAND/)) {
        let output = { relation: 'parallel and', parts: [] }
        let buffer = { course: [], equals: [] }
        let flush = function () {
          output.parts.push({
            course: { raw: buffer.course },
            equals: { raw: buffer.equals }
          })
          buffer = { course: [], equals: [] }
        }
        for (let i = 0; i < block.course.raw.length; i++) {
          if (block.course.raw[i].match(/\s\sAND/)) {
            flush()
            continue
          }
          buffer.course.push(block.course.raw[i])
          buffer.equals.push(block.equals.raw[i])
        }
        flush()
        plan[group][i] = output
      }
    }
  }
}
let parseOr = function (group) {
  for (let key in group) {
    if (typeof group[key] === 'object') {
      if (group[key].hasOwnProperty('course')) {
        let block = group[key]
        if (block.course.raw.join('').match(/\s\sOR/)) {
          let isParallel = block.equals.raw.join('').match(/\s\sOR/)
          let output = (isParallel)
            ? { relation: 'parallel or', parts: [] }
            : { course: { relation: 'or', parts: [] }, equals: block.equals }
          let buffer = (isParallel) ? { course: [], equals: [] } : []
          let flush = function () {
            if (isParallel) {
              output.parts.push({
                course: { raw: buffer.course },
                equals: { raw: buffer.equals }
                // course: { course: { raw: buffer.course } },
                // equals: { equals: { raw: buffer.equals } }
              })
              buffer = { course: [], equals: [] }
            } else {
              output.course.parts.push({ course: { raw: buffer } })
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
          group[key] = output
        }
      } else parseOr(group[key])
    }
  }
}
let parseAmpersand = function (plan) {
  for (let key in plan) {
    if (typeof plan[key] === 'object') {
      if (plan[key].hasOwnProperty('raw')) {
        if (plan[key].raw.join('').match(/[0-Z]\s*&\s*[0-Z]/)) {
          let side = plan[key].raw
          let output = { relation: 'ampersand', parts: [] }
          let buffer = []
          let flush = function () {
            if (buffer.length) {
              (key === 'course')
                ? output.parts.push({ course: { raw: buffer } })
                : output.parts.push({ equals: { raw: buffer } })
              buffer = []
            }
          }
          for (let line of side) {
            if (line.match(/\([0-9]\)/)) {
              flush()
            }
            buffer.push(line)
          }
          flush()
          plan[key] = output
        }
      } else parseAmpersand(plan[key])
    }
  }
}
let parseCourses = function (plan) {
  for (let key in plan) {
    if (typeof plan[key] === 'object') {
      if (plan[key].hasOwnProperty('raw')) {
        let side = plan[key].raw.join(' ')
        if (side.toLowerCase().match(/no course articulated/)) {
          plan[key] = { articulated: false }
          continue
        }
        if (!side.match(/\([0-9]\)/)) {
          plan[key] = { text: collapseWhitespace(side).trim() }
          continue
        }
        let output = { id: '', name: '', units: 0 }
        if (side.match(/[0-Z]\s*&\s*[0-Z]/)) side = side.replace(/&/, ' ')
        output.id = side.match(/([0-Z\s]*)\s\s/)[0].trim()
        side = side.substring(output.id.length)
        output.units = parseInt(side.match(/\([0-9]\)/)[0].replace(/[()]/g, ''))
        side = side.replace(/\([0-9]\)/, '')
        output.name = collapseWhitespace(side).trim()
        plan[key] = output
      } else parseCourses(plan[key])
    }
  }
}
let combineOrAndRequiredGroups = function (plan) {
  let output = { relation: 'parallel or', parts: [] }
  for (let block of plan.or) {
    if (JSON.stringify(block).match(/\s\sOR/)) {
      let wrapper = { value: block }
      parseOr(wrapper)
      block = wrapper.value
    }
    output.parts.push(block)
  }
  plan.required.push(output)
  delete plan.or
}

module.exports = function (agreement) {
  let plan = splitAgreementToGroupStreams(agreement)
  sortStreamsByBlock(plan)
  parseAnd(plan)
  if (plan.required) parseOr(plan.required)
  if (plan.recommended) parseOr(plan.recommended)
  if (plan.or) combineOrAndRequiredGroups(plan)
  parseAmpersand(plan)
  parseCourses(plan)
  return plan
}
