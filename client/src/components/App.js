import React from 'react';
import Form from './app/Form';
import Graph from './app/Graph';



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agreement: undefined,
    };
  }
  onGetAgreement(agreement) {
    this.setState({
      agreement: agreement
    });
  }
  render() {
    return (
      <div>
        <Form onGetAgreement={this.onGetAgreement.bind(this)} />
        {this.state.agreement ? <Graph agreement={this.state.agreement} /> : null}
      </div>
    );
  }
};