import React from 'react';

class Trie {
  constructor(input) {
    this.root = {};
    for (const key in input) {
      this.add(root, key, input[key]);
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
      view: {
        focused: false,
        query: '',
      }
    };
  }
  onSelect(labelSelected) {
    const newData = Object.assign(this.state.data);
    const newView = Object.assign(this.state.view);
    newData.selected = this.state.data.results[labelSelected];
    newView.query = labelSelected;
    this.setState({
      data: newData,
      view: newView,
    });
    this.props.onSelect(this.state.data.results[labelSelected]);
  }
  onBlur() {
    // Matches only shown when query box focused, but to select match, query box is blurred. Timeout solves race condition
    setTimeout(
      () => {
        const newView = Object.assign(this.state.view);
        newView.focused = false;
        this.setState({
          view: newView,
        });
      },
      120 // Tested to be delay needed for an option onClick to trigger
    );
  }
  onFocus(event) {
    const newView = Object.assign(this.state.view);
    newView.focused = true;
    this.setState({
      view: newView,
    });
  }
  onSearch(event) {
    const newData = Object.assign(this.state.data);
    const newView = Object.assign(this.state.view);
    newView.query = event.target.value;
    newData.results = {};
    if (newView.query.length !== 0) {
      newData.results = this.state.data.options.search(newView.query);
    }
    else {
      newData.results = this.props.options; // Empty query returns everything
    }
    newView.focused = (newView.query.length !== 0 && Object.keys(newData.results).length !== 0 && this.state.view.query !== newView.query);
    this.setState({
      data: newData,
      view: newView,
    });
  }
  render() {
    if (this.props.selected !== this.state.data.selected) {
      const newData = Object.assign(this.state.data);
      const newView = Object.assign(this.state.view);
      newData.selected = this.props.selected;
      newData.options = this.props.options;
      newView.query = this.props.selected ? this.props.options[this.props.selected] : '';
      this.setState({
        data: newData,
        view: newView
      });
    }
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
          value={this.state.view.query}
        />
        {/* Results */}
        {this.state.view.focused && <select multiple className="form-control">
          {Object.keys(this.state.data.results).map((label, index) => (
            <option key={index} onClick={() => this.onSelect(label)}>{label}</option>
          ))}
        </select>}
      </div>
    );
  }
};