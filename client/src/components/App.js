import React from 'react';
import Agreement from './App/Agreement';
import Form from './App/Form';
import Header from './App/Header';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agreement: {
        required: [],
        recommended: [],
      },
    };
  }
  onGetAgreement(agreement) {
    this.setState({
      agreement: agreement
    });
  }
  render() {
    return (
      <div className="container">
        <Header></Header>
        <div>
          <Form onGetAgreement={this.onGetAgreement.bind(this)} />
          {(this.state.agreement.required.length || this.state.agreement.recommended.length) ?
            <Agreement agreement={this.state.agreement} />
          : null}
        </div>
      </div>
    );
  }
};