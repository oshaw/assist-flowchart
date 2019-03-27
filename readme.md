# [Assister](http://oshaw-assister.herokuapp.com/)
[![build-status](https://img.shields.io/travis/oshaw/assist-client/master.svg)](https://travis-ci.org/oshaw/assister)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Parses and displays articulation agreements from assist.org as a flowchart of courses students need to take. Node.js, Express.js, React.js.

## Features
* Returns list of origin colleges, destination colleges and majors from assist.org as a JSON object.
* Parses articulation agreements as a JSON object, complete with special conditions. For example, courses which must be taken as a series to satisfy a requirement are parsed as a special group.
* Fetches prerequisite courses for certain requirements listed in agreements.
* Resolves college and major codes from assist.org.

## Implementation

The following algorithms are implemented in [`/server/parse-agreement.js`](https://github.com/oshaw/assister/blob/master/server/parse-agreement.js).

### Algorithm to parse course equivalencies from articulation agreements

1. Articulation agreement text is scraped, trimmed to only the two-column course equivalencies section, and split into lines.
2. Two empty buffers are initialized, one for each column.
3. A line is halved, with each half containing text from each column.
4. The line halves are pushed to their respective buffers.
5. Steps 3 through 4 are repeated until all lines corresponding to a single course equivalency have been pushed to the buffer.
6. Both buffers are flushed and their contained lines are joined to form a description of a course.

### Algorithm to represent "one-from-many" and "all-of-above" requirement types

* "One-from-many" requirements are satisfied by taking any course from a list of courses. They are represented by an `OR`  between course equivalencies.
* "All-of-above" requirements are represented by an `AND` between equivalencies.
* The above requirements can be composed together. For example, the requirement `(course_a AND course_b) OR course_c` is satisfiable by either taking both `course_a` as well as `course_b` or only taking `course_c`.

1. The course equivalency parsing algorithm above is modified to only flush buffers upon reading all the lines for a single *requirement*, rather than for a single course equivalency. In other words, when buffers are flushed, they contain "`(course_a AND course_b) OR course_c` is equivalent to `course_d`" instead of "`course_a` is equivalent to `course_d`"
2. Each requirement is recursively divided into sub-requirements and the relationship between the sub-requirements (`OR` or `AND`) is saved.

## Installation
With npm installed, run
```bash
npm install
```

Then run
```bash
yarn dev
```

Navigate to
```bash
localhost:5000/api?endpoint=
```

Fetch and parse list of origin colleges by appending
```bash
origins
```

View colleges with agreements with an origin college with the following, with ORIGIN as the origin's path code.
```bash
.../api?endpoint=destinations&origin=ORIGIN
```

   
View majors with the following. Set DESTINATION as destination's path code and YEAR as academic year (i.e. 16-17).
```bash
.../api?endpoint=majors&origin=ORIGIN&destination=DESTINATION&year=YEAR
```

View the parsed agreement with 
```bash
.../api?endpoint=agreement&origin=ORIGIN&destination=DESTINATION&year=YEAR&major=MAJOR
```

For example, the following returns the agreement from Allan Hancock College to California Polytechnic University, Pomona in the academic year 15-16 for Architecture B. Arch.
```bash
localhost:3000/api?endpoint=agreement&origin=AHC&destination=CPP&year=15-16&major=ARCH
```
