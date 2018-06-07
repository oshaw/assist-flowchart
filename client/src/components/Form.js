import React from 'react';
import SearchableDropdownSelect from './SearchableDropdownSelect';

const FIELDS = [
  'origin',
  'destination',
  'year',
  'major',
];

const callAPI = (endpoint, body) => {
  return new Promise((resolve, reject) => {
    let serializedBody = '';
    for (const key in body) {
      serializedBody += '&' + key + '=' + body[key];
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
const capitalize = (string) => {
  return string[0].toUpperCase() + string.substring(1);
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
      years: [],
      majors: {},
    };
    callAPI('origins').then((response) => {
      this.setState({
        origins: response.origins,
      });
    });
  }
  onEntrySelect(fieldChanged, newValue) {
    if (this.state.selected[fieldChanged] !== newValue) {
      const newState = Object.assign(this.state, {});
      delete newState.agreement;
      switch (fieldChanged) {
        case 'origin': {
          delete newState.selected.destination;
          delete newState.selected.year;
          delete newState.selected.major;
          newState.selected[fieldChanged] = newValue;
          callAPI('destinations', newState.selected).then((response) => {
            const newSelected = Object.assign(this.state.selected, {});
            newSelected.year = response.years[0];
            this.setState({
              destinations: response.destinations,
              selected: newSelected,
              years: response.years,
            });
          });
          break;
        }
        case 'year': {
          delete newState.selected.major;
          newState.selected[fieldChanged] = newValue;
          if (this.state.selected.destination) {
            callAPI('majors', newState.selected).then((response) => {
              this.setState({
                majors: response.majors,
              });
            });
          }
          break;
        }
        case 'destination': {
          delete newState.selected.major;
          newState.selected[fieldChanged] = newValue;
          if (this.state.selected.year) {
            callAPI('majors', newState.selected).then((response) => {
              this.setState({
                majors: response.majors,
              });
            });
          }
          break;
        }
        case 'major': {
          newState.selected[fieldChanged] = newValue;
          callAPI('agreement', newState.selected).then((response) => {
            console.log(response.agreement);
          });
          break;
        }
        default: {
          break;
        }
      }
      this.setState(newState);
    }
  }
  render() {
    return (
      <form>
        {FIELDS.map((field, index) => 
          (field === 'year') ? (
            this.state.years.length !== 0 &&
              <div className="input-group" key={index}>
                <select
                  className="form-control"
                  onChange={(selectedYear) => this.onEntrySelect(field, selectedYear)}
                  value={this.state.selected.year}
                >
                  {this.state.years.map((year, index) =>
                    <option key={index}>{year}</option>
                  )}
                </select>
              </div>
          ) : (
            this.state[field + 's'] && Object.keys(this.state[field + 's']).length &&
              <SearchableDropdownSelect
                key={index}
                entries={this.state[field + 's']}
                placeholder={capitalize(field)}
                onEntrySelect={(payload) => this.onEntrySelect(field, payload)}
              />
          )
        )}
      </form>
    );
  }
};