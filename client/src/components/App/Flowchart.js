import React from 'react';
import {AGREEMENT_PAIR_TYPES, determineAgreementPairType} from './../../utils';
const d3 = window.d3;
const dagre = window.dagreD3;


const COURSE_RELATIONSHIPS = Object.freeze({
  prerequisite: 'prerequisite',
  recommended: 'recommended',
});
const COURSE_NECESSITIES = Object.freeze({
  recommended: 'recommended',
  required: 'required',
});

class DagreGraph {
  constructor(svg, g, draw) {
    this.graph = new dagre.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(() => {});
    this.renderer = new dagre.render();
    // Dagre requires access to <svg> and <g> in DOM (this.svg, this.svg)
    this.elements = {
      svg,
      g,
    }
    // Dagre also requires those elements be selections by D3 too (this.selections.svg, this.selections.g)
    this.selections = {
      svg: d3.select(svg),
      g: d3.select(g),
    }
  }
  render() {
    // Do the actual rendering
    this.renderer(this.selections.g, this.graph);
    // Fit
    const dimensions = {
      current: this.graph.graph(),
      desired: this.elements.svg.getBBox(),
    }
    const transform = {
      x: dimensions.desired.width - dimensions.current.width,
      y: dimensions.desired.height - dimensions.current.height,
    }
    this.selections.svg.attr('height', dimensions.desired.height);
    this.selections.svg.attr('width', dimensions.desired.width);
    this.selections.g.attr('transform', d3.zoomIdentity.translate(transform.x, transform.y));
  }
}
class DagreGraphAssistAgreementFlowchart extends DagreGraph {
  constructor(svg, g, agreement) {
    super(svg, g);
    this.agreement = agreement;
    // Dagre D3 is apparently incapable of correctly rendering nodes with indexes which are string-based or large integers
    // Must create lookup table as an array of courseIds where the array index is the node id
    this.nodes = [];
    this.renderCourses(this.agreement.recommended, COURSE_NECESSITIES.recommended);
    this.renderCourses(this.agreement.required, COURSE_NECESSITIES.required);
    this.render();
  }
  getNodeId(courseId) {
    return this.nodes.findIndex((potentialCourseId) => potentialCourseId === courseId);
  }
  renderCourse(course) {
    if (this.getNodeId(course.id) === -1) {
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
    // this.graph.setEdge(nodeFromId, nodeToId);
    console.log(this.graph.edges());
    console.log(this.graph.edge({
      v: nodeFromId,
      w: nodeToId,
    }));
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
class DagreGraphAssistAgreementCourse {
  
}
export default class Flowchart extends React.Component {
  constructor(props) {
    super(props);
    this.dagreGraph = {
      elements: {}
    }
  }
  componentDidMount() {
    this.renderDagreGraph();
  }
  componentDidUpdate() {
    this.renderDagreGraph();
  }
  render() {
    return (
      <svg id='dagreGraph' ref={(ref) => {this.dagreGraph.elements.svg = ref}}>
        <g ref={(ref) => {this.dagreGraph.elements.g = ref}}></g>
      </svg>
    );
  }
  renderDagreGraph() {
    this.dagreGraph = new DagreGraphAssistAgreementFlowchart(
      this.dagreGraph.elements.svg,
      this.dagreGraph.elements.g,
      this.props.agreement,
    );
  }
};