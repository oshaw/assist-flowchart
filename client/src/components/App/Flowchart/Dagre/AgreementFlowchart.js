import {AGREEMENT_PAIR_TYPES, determineAgreementPairType} from './../../../../utils';
import Graph from './Graph';

const COURSE_RELATIONSHIPS = Object.freeze({
  prerequisite: 'prerequisite',
  recommended: 'recommended',
});
const COURSE_NECESSITIES = Object.freeze({
  recommended: 'recommended',
  required: 'required',
});

export default class AssistAgreementFlowchart extends Graph {
  constructor(svg, gToSelect, agreement) {
    super(svg, gToSelect);
    // Dagre D3 is apparently incapable of correctly rendering nodes with indexes that are string-based or large integers
    // Must create lookup table as an array of courseIds where the array index is the node id
    this.nodes = [];
    this.agreement = agreement;
    this.renderCourses(this.agreement.recommended, COURSE_NECESSITIES.recommended);
    this.renderCourses(this.agreement.required, COURSE_NECESSITIES.required);
    this.render();
  }
  getNodeId(courseId) {
    return this.nodes.findIndex((potentialCourseId) => potentialCourseId === courseId);
  }
  renderCourse(course) {
    if (this.getNodeId(course.id) === -1 && course.id !== '') {
      this.graph.setNode(this.nodes.length, {
        label: course.id,
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
    this.graph.setEdge(nodeToId, nodeFromId);
  }
  renderCourses(pairs, necessity) {
    pairs.forEach((pair) => {
      const pairType = determineAgreementPairType(pair);
      switch (pairType) {
        case AGREEMENT_PAIR_TYPES.singleCourse: {
          this.renderPair(pair);
          break;
        }
        case AGREEMENT_PAIR_TYPES.multipleCourses: {
          this.renderCourses(pair.course.parts);
          break;
        }
        case AGREEMENT_PAIR_TYPES.multiplePairs: {
          this.renderCourses(pair.parts);
          break;
        }
        case AGREEMENT_PAIR_TYPES.notArticulated: {
          this.renderNotArticulated(pair);
          break;
        }
      }
    });
  }
  renderNotArticulated(pair) {
    this.graph.setNode(this.nodes.length, {
      label: `No courses articulated for ${pair.equals.id}`,
    });
  }
  renderPair(pair) {
    this.renderCourse(pair.course);
    if (pair.course.prerequisites) {
      pair.course.prerequisites.forEach((prerequisite) => {
        prerequisite = prerequisite.replace(/-/, ' ');
        this.renderCourse({id: prerequisite});
        this.renderCourseRelationship(pair.course, {id: prerequisite}, COURSE_RELATIONSHIPS.prerequisite);
      });
    }
    if (pair.course.recommended) {
      pair.course.recommended.forEach((recommended) => {
        recommended = recommended.replace(/-/, ' ');
        this.renderCourse({id: recommended});
        this.renderCourseRelationship(pair.course, {id: recommended}, COURSE_RELATIONSHIPS.recommended);
      });
    }
  }
}