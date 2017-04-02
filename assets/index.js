'use strict'
/* global XMLHttpRequest */

let addMajors = function (origin, destination, year, majors) {
  for (let major of majors) {
    let button = document.createElement('p')
    let click = function (element, origin, destination, year, major) {
      element.addEventListener('click', function () {
        let req = new XMLHttpRequest()
        req.open('GET', '/?from=' + origin.path + '&to=' + destination.path + '&year=' + '16-17' + '&major=' + major.path, true)
        req.onload = function () {
          document.body.innerHTML = ''
          console.log(req.responseText)
        }
        req.send()
      })
    }
    button.textContent = major.name
    button.style.display = 'block'
    click(button, origin, destination, year, major)
    document.body.appendChild(button)
  }
}
let addYears = function (years) {
  for (let year of years) {
    let button = document.createElement('p')
    button.textContent = year
    button.style.display = 'block'
    document.body.appendChild(button)
  }
}
let addDestinations = function (origin, destinations) {
  for (let destination of destinations) {
    let button = document.createElement('p')
    let click = function (element, origin, destination) {
      element.addEventListener('click', function () {
        let req = new XMLHttpRequest()
        req.open('GET', '/?from=' + origin.path + '&to=' + destination.path + '&year=' + '16-17', true)
        req.onload = function () {
          document.body.innerHTML = ''
          addMajors(origin, destination, '16-17', JSON.parse(req.responseText))
        }
        req.send()
      })
    }
    button.textContent = destination.name
    button.style.display = 'block'
    click(button, origin, destination)
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
          addDestinations(
            { name: name, path: path },
            JSON.parse(req.responseText).destinations
          )
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
