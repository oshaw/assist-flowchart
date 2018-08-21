import Flowchart from './Agreement/Dagre/Flowchart';
import React from 'react';

export default class Agreement extends React.Component {
  constructor(props) {
    super(props);
    this.dagreGraph = {
      elements: {},
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
      <div id="agreement">
        <svg ref={(ref) => {this.dagreGraph.elements.svg = ref;}}>
          <g ref={(ref) => {this.dagreGraph.elements.gToSelect = ref;}}></g>
        </svg>
      </div>
    );
  }
  renderDagreGraph() {
    this.flowchart = new Flowchart(
      this.dagreGraph.elements.svg,
      this.dagreGraph.elements.gToSelect,
      this.props.agreement,
    );
  }
};