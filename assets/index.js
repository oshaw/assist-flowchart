'use strict'
/* global XMLHttpRequest */

let addInstitutions = function (institutions) {
  for (var institution of institutions) {
    console.log(institution.name + ' ' + institution.path)
  }
}

let req = new XMLHttpRequest()
req.open('GET', '/institutions.json', true)
req.onload = function () { addInstitutions(JSON.parse(req.responseText)) }
req.send()

console.log('index.js')
