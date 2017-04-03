'use strict'

const S = require('string')
const numDashesInDivider = 80

let isOrSection = function (section) {
  section = S(section.toLowerCase())
  let checks = [
    function (data) { return data.contains('from') && data.contains('list') }
  ]
  for (let check of checks) { if (check(section)) return true }
}
let isRecommendedSection = function (section) {
  section = S(section.toLowerCase())
  let checks = [
    function (data) { return data.contains('strongly recommended') }
  ]
  for (let check of checks) { if (check(section)) return true }
}
let extractCourses = function (section, callback) {
  let lines = section.split('\n')
  let courses = []
  let buffer = ''
  for (let line of lines) {
    line = S(line)
    if (line.between('|').isEmpty()) continue
    if (line.contains('(') && !S(buffer).isEmpty()) {
      courses.push(buffer)
      buffer = ''
    }
    buffer += line.between('|').collapseWhitespace().s.trim()
  }
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
      for (let course of extractCourses(section)) {
        console.log(course)
        current.push(course)
      }
    }
  }
  // console.log(courses)
  S.restorePrototype()
  return agreement
}
