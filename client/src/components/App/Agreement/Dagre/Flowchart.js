import {AGREEMENT_PAIR_TYPES, capitalize, determineAgreementPairType} from './../../../../utils';
import Graph from './Graph';

const COURSE_NECESSITIES = Object.freeze({
  recommended: 'recommended',
  required: 'required',
});

export default class Flowchart extends Graph {
  constructor(svg, gToSelect, agreement) {
    super(svg, gToSelect);
    this.agreement = agreement;
    this.renderCourses(this.agreement.recommended, COURSE_NECESSITIES.recommended);
    this.renderCourses(this.agreement.required, COURSE_NECESSITIES.required);
    this.render();
  }
  renderCourse(course, necessity) {
    this.createNode(capitalize(course.id), [necessity, 'course']);
  }
  renderCourseRelationship(courseFrom, courseTo, relation) {
    this.createEdge(courseFrom.id, courseTo.id, relation);
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
  renderNotArticulated(pair, necessity) {
    this.createNode(`No courses articulated for ${pair.equals.id}`, [necessity, 'not-articulated']);
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
}