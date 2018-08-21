import React from 'react';
import lodash from 'lodash';

class Trie {
  constructor(input) {
    this.root = {};
    for (const key in input) {
      this.add(root, input[key], key);
    }
  }
  add(trie, string, code) {
    if (string.length) {
      const character = string[0];
      if (!trie[character]) {
        trie[character] = {};
      }
      this.add(trie[character], string.substring(1), code);
    }
    else {
      trie.code = code;
    }
  }
  search(query) {
    const getResults = (node, query) => {
      let results = {};
      if (node.code) {
        results[query] = node.code;
      }
      for (const character in node) {
        if (character.length === 1) {
          results = Object.assign(results, getResults(node[character], query + character));
        }
      }
      return results;
    }
    // Navigate to the trie node corresponding to the last character of the query
    let traverser = query;
    let node = this.root;
    while (traverser.length) {
      const character = traverser[0];
      if (node[character]) {
        node = node[character];
        traverser = traverser.substring(1);
      }
      else {
        return {}; // Exit early if no results
      }
    }
    return getResults(node, query); // Get all results connected to the last character node
  }
}

export default class SearchableDropdownSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        options: new Trie(this.props.options),
        results: this.props.options,
        selected: this.props.selected,
      },
      focused: false,
    };
  }
  onBlur() {
    // Matches only shown when query box focused, but to select match, query box is blurred. Timeout solves race condition
    setTimeout(
      () => {
        this.setState({
          focused: false,
        });
      },
      120 // Tested to be delay needed for an option onClick to trigger
    );
  }
  onFocus(event) {
    this.setState({
      focused: true,
    });
  }
  onSelect(labelSelected) {
    const newData = Object.assign(this.state.data);
    newData.selected = lodash.findKey(this.state.data.results, (result) => result === labelSelected);
    this.setState({
      data: newData,
    });
    this.props.onSelect(this.state.data.selected);
  }
  onSearch(event) {
    const newData = Object.assign(this.state.data);
    newData.results = {};
    this.props.onQueryChange(event.target.value);
    if (this.props.query.length !== 0) {
      newData.results = this.state.data.options.search(this.props.query);
    }
    else {
      newData.results = this.props.options; // Empty query returns everything
    }
    this.setState({
      data: newData,
    });
  }
  render() {
    return (
      <div className="input-group">
        {/* Search box */}
        <input
          className="form-control"
          onBlur={this.onBlur.bind(this)}
          onChange={this.onSearch.bind(this)}
          onFocus={this.onFocus.bind(this)}
          placeholder={this.props.placeholder}
          type="text"
          value={this.props.query}
        />
        {/* Results */}
        {this.state.focused &&
          <select multiple className="form-control" size="30">
            {Object.values(this.state.data.results).map((label, index) => (
              <option
                key={index}
                onClick={() => this.onSelect(label)}
              >{label}</option>
            ))}
          </select>
        }
      </div>
    );
  }
};