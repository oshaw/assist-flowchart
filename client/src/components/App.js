import React from 'react';
import Form from './App/Form';
import Graph from './App/Graph';
import {callAPI} from '../utils';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // agreement: undefined,
      agreement: {
        required: [],
        recommended: [],
      },
    };
    callAPI('agreement', {
        origin: 'DIABLO',
        destination: 'UCB',
        year: '16-17',
        major: 'EECS',
      })
      .then((response) => {
        this.onGetAgreement(response);
      });
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
        {this.state.agreement ?
          <Graph agreement={this.state.agreement} />
        : null}
      </div>
    );
  }
};