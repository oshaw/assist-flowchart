import React from 'react';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';

export default class Graph extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <svg>
          <g></g>
        </svg>
      </div>
    );
  }
  componentDidMount() {
    if (this.props.agreement) {
      this.renderGraph();
    }
    
  }
  componentDidUpdate() {
    if (this.props.agreement) {
      this.renderGraph();
    }
  }
  renderGraph() {
    const graph = new dagreD3.graphlib.Graph().setGraph({});
    graph.setNode(1, 'Hello');
  }
};