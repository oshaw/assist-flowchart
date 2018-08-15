import React from 'react';
import * as dagre from 'dagre-d3';
import * as d3 from 'd3';

class DagreGraph {
  constructor(svg, g, render) {
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
    render(this.graph);
    this.renderer(this.selections.g, this.graph);
    this.fit();
    this.center();
  }
  center() {
    const dimensions = {
      current: this.graph.graph(),
    }
    const offset = {
      x: (this.selections.svg.attr('width') - dimensions.current.width) / 2,
    }
    this.selections.g.attr('transform', `translate(${offset.x}, 20)`);
    this.selections.svg.attr('height', dimensions.current.height + 40);
  }
  fit() {
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
    this.dagreGraph = new DagreGraph(
      this.dagreGraph.elements.svg,
      this.dagreGraph.elements.g,
      (graph) => {
        this.props.agreement.required.forEach((pair, index) => {
          if (pair.course && pair.course.id) {
            graph.setNode(pair.course.id, {
              label: pair.course.id,
            });
          }
        });
      }
    );
  }
};