import AgreementFlowchart from './Flowchart/Dagre/AgreementFlowchart';
import React from 'react';

export default class Flowchart extends React.Component {
  componentDidMount() {
    this.renderDagreGraph();
  }
  componentDidUpdate() {
    this.renderDagreGraph();
  }
  render() {
    return (
      <svg ref={(ref) => {this.svg = ref;}} width="100%">
        <g></g>
      </svg>
    );
  }
  renderDagreGraph() {
    this.agreementFlowchart = new AgreementFlowchart(
      this.svg,
      this.props.agreement,
    );
  }
};