import AgreementFlowchart from './Flowchart/Dagre/AgreementFlowchart';
import React from 'react';

export default class Flowchart extends React.Component {
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
      <svg ref={(ref) => {this.dagreGraph.elements.svg = ref;}} width="100%">
        <g ref={(ref) => {this.dagreGraph.elements.gToSelect = ref;}}></g>
      </svg>
    );
  }
  renderDagreGraph() {
    this.agreementFlowchart = new AgreementFlowchart(
      this.dagreGraph.elements.svg,
      this.dagreGraph.elements.gToSelect,
      this.props.agreement,
    );
  }
};