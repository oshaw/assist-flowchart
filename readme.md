# Assist Client
[![build-status](https://img.shields.io/travis/oshaw/assist-client/master.svg)](https://travis-ci.org/oshaw/assist-client)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Parses and displays articulation agreements from assist.org as a flowchart of courses students need to take. Node.js with Express.js.

## Features
- Returns list of origin colleges, destination colleges and majors from assist.org as a JSON object.

- Parses articulation agreements as a JSON object, complete with special conditions. For example, courses which must be taken as a series to satisfy a requirement are parsed as a special group.

- Fetches prerequisite courses for certain requirements listed in agreements.

- Resolves college and major codes from assist.org.

## Installation
1. With npm installed, run ```bash npm install ``` in project directory.

2. Navigate to ```bash localhost:3000/api?endpoint= ```.

3. Fetch and parse list of origin colleges by appending ```bash origins ```.

4. View colleges with agreements with an origin college with
   ```bash .../api?endpoint=destinations&origin=ORIGIN ```
   with ORIGIN as the origin's path code.
   
5. View majors with
   ```bash .../api?endpoint=majors&origin=ORIGIN&destination=DESTINATION&year=YEAR ```
   with DESTINATION as destination's path code and YEAR as academic year (i.e. 16-17).
   
6. View parsed agreement with 
   ```bash .../api?endpoint=agreement&origin=ORIGIN&destination=DESTINATION&year=YEAR&major=MAJOR ```.

For example, the following
```bash
localhost:3000/api?endpoint=agreement&origin=AHC&destination=CPP&year=15-16&major=ARCH
```
returns the agreement from Allan Hancock College to California Polytechnic University, Pomona in the academic year 15-16 for Architecture B. Arch.
