'use strict'

const S = require('string')
const numDashesInDivider = 80

let isOrSection = function (section) {
  section = S(section.toLowerCase())
  let tests = [
    function (data) { return data.contains('from') && data.contains('list') }
  ]
  for (let test of tests) { if (test(section)) return true }
}
let isRecommendedSection = function (section) {
  section = S(section.toLowerCase())
  let tests = [
    function (data) { return data.contains('strongly recommended') }
  ]
  for (let test of tests) { if (test(section)) return true }
}

let parseStream = function (stream, object) {
  object.id = S(stream).between('', '    ').s
  stream = S(stream).between('    ').s
  object.units = S(stream).between('(', ')').s
  stream = S(stream.replace(/ \([^)]*\) /g, '')).collapseWhitespace().s
  object.name = stream.trim()
  return object
}
let parseStreams = function (streams) {
  let course = { articulates: {} }
  if (S(streams.course).contains('NO COURSE ARTICULATED')) {
    course.articulated = false
  }
  else course = parseStream(streams.course, course)
  course.articulates = parseStream(streams.articulates, course.articulates)
  console.log(course)
  return course
}
let parseSections = function (section) {
  let lines = section.split('\n')
  let buffer = { course: '', articulates: '' }
  let streamses = []
  let courses = []
  let flush = function () {
    streamses.push(buffer)
    buffer = { course: '', articulates: '' }
  }
  for (let line of lines) {
    line = S(line)
    if (
      line.between('', '|').s.match('/((1-9)/)') &&
      line.between('|').s.match('/((1-9)/)')
    ) flush()
    buffer.course += line.between('|').s.trim() + ' '
    buffer.articulates += line.between('', '|').s.trim() + ' '
  }
  if (buffer.course !== '') flush()
  for (let streams of streamses) courses.push(parseStreams(streams))
  return courses
}

module.exports = function (agreement) {
  S.extendPrototype()
  let sections = agreement.split(('-').repeat(numDashesInDivider))
  let courses = { required: [], or: [], recommended: [] }
  let current = courses.required
  for (let section of sections) {
    if (courses.required.length !== 0 && isOrSection(section)) {
      current = courses.or
    }
    if (courses.required.length !== 0 && isRecommendedSection(section)) {
      current = courses.recommended
    }
    if (section.contains('|')) {
      current.push.apply(current, parseSections(section))
    }
  }
  S.restorePrototype()
  return agreement
}
