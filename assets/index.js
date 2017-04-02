'use strict'
/* global XMLHttpRequest */

let addYears = function (years) {
  for (let year of years) {
    let button = document.createElement('p')
    button.textContent = year
    button.style.display = 'block'
    document.body.appendChild(button)
  }
}
let addDestinations = function (destinations) {
  for (let destination of destinations) {
    let button = document.createElement('p')
    button.textContent = destination.name
    button.style.display = 'block'
    document.body.appendChild(button)
  }
}
let addOrigins = function (origins) {
  for (let origin of origins) {
    let button = document.createElement('p')
    let click = function (element, name, path) {
      element.addEventListener('click', function () {
        let req = new XMLHttpRequest()
        req.open('GET', '/institutions/' + path + '.json', true)
        req.onload = function () {
          document.body.innerHTML = ''
          addDestinations(JSON.parse(req.responseText).destinations)
          addYears(JSON.parse(req.responseText).years)
        }
        req.send()
      })
    }
    button.textContent = origin.name
    button.style.display = 'block'
    click(button, origin.name, origin.path)
    document.body.appendChild(button)
  }
}

let req = new XMLHttpRequest()
req.open('GET', '/institutions.json', true)
req.onload = function () { addOrigins(JSON.parse(req.responseText)) }
req.send()

console.log('index.js')
