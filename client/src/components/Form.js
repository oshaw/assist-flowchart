import React from 'react';
import Fetch from 'whatwg-fetch';
import SearchableDropdownSelect from './SearchableDropdownSelect';

const callAPI = (endpoint, body) => {
  return new Promise((resolve, reject) => {
    let serializedBody = '';
    for (const key in body) {
      serializedBody += key + '=' + body[key];
    }
    fetch('./api?endpoint=' + endpoint + serializedBody).then((response) => {
      if (response.status !== 200) {
        reject(response);
      }
      else {
        response.json().then((json) => {
          resolve(json);
        }).catch(reject);
      }
    }).catch(reject);
  });
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        origin: '',
        destination: '',
        year: '',
        major: '',
      },
      origins: {},
      destinations: {},
      years: {},
      majors: {},
    };
    callAPI('origins').then((response) => {
      this.setState({
        origins: response.origins,
      });
    });
  }
  render() {
    return (
      <form>
        {Object.keys(this.state.origins).length && <SearchableDropdownSelect entries={this.state.origins} />}
      </form>
    );
  }
};