import {AGREEMENT_PAIR_TYPES, capitalize, determineAgreementPairType} from './../../../../utils';
import Graph from './Graph';
const d3 = window.d3;

const COURSE_NECESSITIES = Object.freeze({
  recommended: 'recommended',
  required: 'required',
});

export default class Flowchart extends Graph {
  constructor(svg, gToSelect, agreement) {
    super(svg, gToSelect);
    this.agreement = agreement;
    // // Dagre has no way of saving metadata to each node
    // // Keep all course information in an array for display when a course is hovered
    // // Index of course's data in array is equivalent to its Dagre node id
    // this.courses = [];
    this.renderCourses(this.agreement.recommended, COURSE_NECESSITIES.recommended);
    this.renderCourses(this.agreement.required, COURSE_NECESSITIES.required);
    this.render();
  }
  // render() {
  //   super.render();
  //   const flowchart = this;
  //   const nodes = d3.selectAll('g.node')._groups[0];
  //   nodes.forEach((node, index) => {
  //     if (Array.from(node.classList).includes('course')) {
  //       node.onclick = () => {
  //         const index = flowchart.courses.findIndex((course) => course.id === this.textContent);
  //         d3.select(this).append('div')
  //           .classed('popup', true)
  //           .html(`
  //             <p class='courseId'>${flowchart.courses[index].id}</p>
  //             <p class='courseName'>${flowchart.courses[index].name}</p>
  //             <p class='satisfies'>Satisfies ${flowchart.courses[index].satisfies.id}: ${flowchart.courses[index].satisfies.name}, ${flowchart.courses[index].satisfies.units} units</p>
  //             <p class='courseUnits'>${flowchart.courses[index].satisfies.units} units</p>
  //           `);
  //         ;
  //       }
  //     }
  //     else {
        
  //     }
  //   });
  // }
  renderCourse(course, necessity) {
    this.createNode(capitalize(course.id), [necessity, 'course']);
    // this.saveCourse(course, necessity);
  }
  renderCourseRelationship(courseFrom, courseTo, relation) {
    this.createEdge(courseFrom.id, courseTo.id, relation);
    this.saveRelationship(courseFrom, courseTo, relation);
  }
  renderNotArticulated(pair, necessity) {
    this.createNode(`No courses articulated for ${pair.equals.id}`, [necessity, 'not-articulated']);
    // this.savePair(pair, necessity);
  }
  renderCourses(pairs, necessity) {
    pairs.forEach((pair) => {
      const pairType = determineAgreementPairType(pair);
      switch (pairType) {
        case AGREEMENT_PAIR_TYPES.singleCourse: {
          this.renderPair(pair, necessity);
          break;
        }
        case AGREEMENT_PAIR_TYPES.multipleCourses: {
          this.renderCourses(pair.course.parts, necessity);
          break;
        }
        case AGREEMENT_PAIR_TYPES.multiplePairs: {
          this.renderCourses(pair.parts, necessity);
          break;
        }
        case AGREEMENT_PAIR_TYPES.notArticulated: {
          this.renderNotArticulated(pair, necessity);
          break;
        }
        default: {}
      }
    });
  }
  renderPair(pair, necessity) {
    this.renderCourse(pair.course, necessity);
    if (pair.course.prerequisites) {
      pair.course.prerequisites.forEach((prerequisite) => {
        prerequisite = {
          id: prerequisite.replace(/-/, ' '),
        }
        this.renderCourse(prerequisite, COURSE_NECESSITIES.prerequisite);
        this.renderCourseRelationship(prerequisite, pair.course, COURSE_NECESSITIES.required);
      });
    }
    if (pair.course.recommended) {
      pair.course.recommended.forEach((recommended) => {
        recommended = {
          id: recommended.replace(/-/, ' '),
        }
        this.renderCourse(recommended, COURSE_NECESSITIES.recommended);
        this.renderCourseRelationship(recommended, pair.course, COURSE_NECESSITIES.recommended);
      });
    }
  }
  // saveCourse(course, necessity) {
  //   course = Object.assign(course);
  //   course.necessity = necessity;
  //   this.courses.push(course);
  // }
  // saveRelationship(courseFrom, courseTo, relation) {
  //   const courseFromSavedIndex = this.courses.findIndex((course) => course.id === courseFrom.id);
  //   const courseToSavedIndex = this.courses.findIndex((course) => course.id === courseTo.id);
  //   this.courses[courseFromSavedIndex][relation] = courseToSavedIndex;
  // }
  // savePair(pair, necessity) {
  //   pair = Object.assign(pair);
  //   const course = pair.course;
  //   course.necessity = necessity;
  //   course.satisfies = pair.equals;
  //   this.courses.push(course);
  // }
}