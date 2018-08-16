import AgreementFlowchart from './Flowchart/Dagre/AgreementFlowchart';
import React from 'react';

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
    this.dagreGraph = new AgreementFlowchart(
      this.dagreGraph.elements.svg,
      this.dagreGraph.elements.g,
      this.props.agreement,
    );
  }
};