import React from 'react';
import SearchableDropdownSelect from './form/SearchableDropdownSelect';
import {callAPI, capitalize} from './../../utils';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        origins: {},
        destinations: {},
        years: [],
        majors: {},
      },
      queries: {
        origin: '',
        destination: '',
        major: '',
      },
      selected: {
        origin: '',
        destination: '',
        year: '',
        major: '',
      },
    };
    callAPI('origins').then((response) => {
      const newData = Object.assign(this.state.data);
      newData.origins = response.origins;
      this.setState({
        data: newData,
      });
    });
  }
  onOptionSelect(fieldChanged, newValue) {
    if (this.state.selected[fieldChanged] !== newValue) {
      const newState = Object.assign(this.state);
      if (this.state.queries.hasOwnProperty(fieldChanged)) {
        newState.queries[fieldChanged] = this.state.data[fieldChanged + 's'][newValue];
      }
      switch (fieldChanged) {
        case 'origin': {
          delete newState.selected.destination;
          delete newState.selected.year;
          delete newState.selected.major;
          newState.selected.origin = newValue;
          callAPI('destinations', newState.selected).then((response) => {
            const newData = Object.assign(this.state.data);
            const newSelected = Object.assign(this.state.selected, {});
            newSelected.year = response.years[0];
            newData.destinations = response.destinations;
            newData.years = response.years;
            newData.majors = {};
            this.setState({
              data: newData,
              selected: newSelected,
            });
          });
          break;
        }
        case 'destination': {
          delete newState.selected.major;
          newState.selected.destination = newValue;
          if (this.state.selected.year) {
            callAPI('majors', newState.selected).then((response) => {
              const newData = Object.assign(this.state.data);
              newData.majors = response.majors;
              this.setState({
                data: newData
              });
            });
          }
          break;
        }
        case 'year': {
          delete newState.selected.major;
          newState.selected.year = newValue;
          if (this.state.selected.destination) {
            callAPI('majors', newState.selected).then((response) => {
              const newData = Object.assign(this.state.data);
              newData.majors = response.majors;
              this.setState({
                data: newData
              });
            });
          }
          break;
        }
        case 'major': {
          newState.selected.major = newValue;
          callAPI('agreement', newState.selected).then((response) => {
            this.props.onGetAgreement(response);
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
  onQueryChange(fieldChanged, newQuery) {
    const newState = Object.assign(this.state);
    newState.queries[fieldChanged] = newQuery;
    this.setState(newState);
  }
  render() {
    const FIELDS = Object.freeze([
      'origin',
      'destination',
      'year',
      'major',
    ]);
    return (
      <form>
        {FIELDS.map((field, index) => 
          (field === 'year') ? (
            (this.state.data.years.length !== 0) ?
              (<div className="input-group" key={index}>
                <select
                  className="form-control"
                  onChange={(selectedYear) => this.onOptionSelect(field, selectedYear)}
                  value={this.state.selected.year}
                >
                  {this.state.data.years.map((year, index) =>
                    <option key={index}>{year}</option>
                  )}
                </select>
              </div>) : null
          ) : (
            (this.state.data[field + 's'] && Object.keys(this.state.data[field + 's']).length) ?
              (<SearchableDropdownSelect
                key={index}
                onQueryChange={(newQuery) => this.onQueryChange(field, newQuery)}
                onSelect={(payload) => this.onOptionSelect(field, payload)}
                options={this.state.data[field + 's']}
                placeholder={capitalize(field)}
                query={this.state.queries[field]}
                selected={this.state.selected[field]}
              />) : null
          )
        )}
      </form>
    );
  }
};