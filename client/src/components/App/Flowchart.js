import React from 'react';
import * as dagre from 'dagre-d3';
import * as d3 from 'd3';

class DagreGraph {
  constructor(svg, g, draw) {
    this.graph = new dagre.graphlib.Graph().setGraph({});
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
    // Do the rendering
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

class DagreGraphAgreementFlowchart extends DagreGraph {
  constructor(svg, g, agreement) {
    super(svg, g);
    this.renderCourseList([...agreement.required, ...agreement.recommended]);
    this.render();
  }
  renderCourseList(list) {
    list.forEach((pair, index) => {
      // Requirement satisfied by single course
      if (pair.course && pair.course.id) {
        this.graph.setNode(pair.course.id, {
          label: pair.course.id,
        });
      }
      // Requirement satisfied by multiple courses
      else if (pair.course && pair.relationship) {
        this.renderCourseList(pair.parts);
      }
      // Requirement not articulated
      else {
        
      }
    });
  }
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
    this.dagreGraph = new DagreGraphAgreementFlowchart(
      this.dagreGraph.elements.svg,
      this.dagreGraph.elements.g,
      this.props.agreement,
    );
    // this.dagreGraph = new DagreGraph(
    //   this.dagreGraph.elements.svg,
    //   this.dagreGraph.elements.g,
    //   (graph) => this.drawInDagreGraph(graph)
    // );
  }
  // drawInDagreGraph(graph) {
  //   const agreement = this.props.agreement;
  //   [...agreement.required, ...agreement.recommended].forEach((pair, index) => {
  //     // Requirement satisfied by single course
  //     if (pair.course && pair.course.id) {
  //       graph.setNode(pair.course.id, {
  //         label: pair.course.id,
  //       });
  //     }
  //     // Requirement satisfied by multiple courses
  //     else if (pair.course && pair.relationship) {
        
  //     }
  //     // Requirement not articulated
  //     else {
        
  //     }
  //   });
  // }
};