import {AGREEMENT_PAIR_TYPES, capitalize, determineAgreementPairType} from './../../../../utils';
import Graph from './Graph';

const COURSE_RELATIONSHIPS = Object.freeze({
  prerequisite: 'prerequisite',
  recommended: 'recommended',
});
const COURSE_NECESSITIES = Object.freeze({
  prerequisite: 'prerequisite',
  recommended: 'recommended',
  required: 'required',
});

export default class Flowchart extends Graph {
  constructor(svg, gToSelect, agreement) {
    super(svg, gToSelect);
    // Dagre D3 does not support node indexes that are string-based or large integers
    // Must create lookup table as array of courseIds where array index is node id
    this.nodes = [];
    this.agreement = agreement;
    this.renderCourses(this.agreement.recommended, COURSE_NECESSITIES.recommended);
    this.renderCourses(this.agreement.required, COURSE_NECESSITIES.required);
    this.render();
  }
  getNodeId(courseId) {
    return this.nodes.findIndex((potentialCourseId) => potentialCourseId === courseId);
  }
  renderCourse(course, necessity) {
    if (this.getNodeId(course.id) === -1 && course.id !== '') {
      this.graph.setNode(this.nodes.length, {
        class: `${necessity} course`,
        label: capitalize(course.id),
      });
      this.nodes.push(course.id);
    }
  }
  renderCourseRelationship(courseFrom, courseTo, relation) {
    let nodeFromId = this.getNodeId(courseFrom.id);
    let nodeToId = this.getNodeId(courseTo.id);
    if (nodeFromId === -1) {
      this.renderCourse(courseFrom);
      nodeFromId = this.getNodeId(courseFrom.id);
    }
    if (this.getNodeId(courseTo.id) === -1) {
      this.renderCourse(courseTo);
      nodeToId = this.getNodeId(courseTo.id);
    }
    this.graph.setEdge(nodeToId, nodeFromId, {
      class: relation,
    });
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
      }
    });
  }
  renderNotArticulated(pair, necessity) {
    this.graph.setNode(this.nodes.length, {
      class: `${necessity} not-articulated`,
      label: `No courses articulated for ${pair.equals.id}`,
    });
  }
  renderPair(pair, necessity) {
    this.renderCourse(pair.course, necessity);
    if (pair.course.prerequisites) {
      pair.course.prerequisites.forEach((prerequisite) => {
        prerequisite = prerequisite.replace(/-/, ' ');
        this.renderCourse({id: prerequisite}, COURSE_NECESSITIES.prerequisite);
        this.renderCourseRelationship(pair.course, {id: prerequisite}, COURSE_RELATIONSHIPS.prerequisite);
      });
    }
    if (pair.course.recommended) {
      pair.course.recommended.forEach((recommended) => {
        recommended = recommended.replace(/-/, ' ');
        this.renderCourse({id: recommended}, COURSE_NECESSITIES.recommended);
        this.renderCourseRelationship(pair.course, {id: recommended}, COURSE_RELATIONSHIPS.recommended, COURSE_RELATIONSHIPS.recommended);
      });
    }
  }
}