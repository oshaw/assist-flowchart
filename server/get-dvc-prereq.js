'use strict'

const request = require('./request.js')
let logObject = function (object) {
  console.log(JSON.stringify(object, null, 4))
}

module.exports = function () {
  let course = {
    id: 'MATH 192',
    name: 'Analytic Geometry and Calculus I',
    units: 5
  }
  let url = 'http://www3.dvc.edu/org/info/course-outlines/'
  request(url + 'course-outline-results.htm?course=' + course.id.replace(/\s/, '+'), function ($) {
    $('a').each(function (i, link) {
      if ($(this).text().match(/See details\.\.\./)) {
        request(url + $(this).attr('href'), function ($) {
          $('font').each(function (j, row) {
            if ($(this).text().match(/Prerequisite/)) {
              course.prerequisites = $('font')[j + 1].children[0].data
            }
            if ($(this).text().match(/Recommended/)) {
              course.recommended = $('font')[j + 1].children[0].data
            }
          })
          logObject(course)
        })
      }
    })
  })
}
