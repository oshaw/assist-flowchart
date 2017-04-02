'use strict'
/* global XMLHttpRequest */

let addInstitutions = function (institutions) {
  for (var institution of institutions) {
    let button = document.createElement('a')
    let click = function (element, name, path) {
      element.addEventListener('click', function () {
        let req = new XMLHttpRequest()
        req.open('GET', '/institutions/' + path + '.json', true)
        req.onload = function () { console.log(req.responseText) }
        req.send()
      })
    }
    button.textContent = institution.name
    button.style.display = 'block'
    click(button, institution.name, institution.path)
    document.body.appendChild(button)
  }
}

let req = new XMLHttpRequest()
req.open('GET', '/institutions.json', true)
req.onload = function () { addInstitutions(JSON.parse(req.responseText)) }
req.send()

console.log('index.js')
