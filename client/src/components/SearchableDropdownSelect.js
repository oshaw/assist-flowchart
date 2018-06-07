import React from 'react';

const trieAdd = (trie, string, code) => {
  if (string.length) {
    const character = string[0];
    if (!trie[character]) {
      trie[character] = {};
    }
    trieAdd(trie[character], string.substring(1), code);
  }
  else {
    trie.code = code;
  }
}
const trieSearch = (trie, query) => {
  const getResults = (trie, query) => {
    let results = {};
    if (trie.code) {
      results[query] = trie.code;
    }
    for (const character in trie) {
      if (character.length === 1) {
        results = Object.assign(results, getResults(trie[character], query + character));
      }
    }
    return results;
  }
  let traverser = query;
  while (traverser.length) {
    const character = traverser[0];
    if (trie[character]) {
      trie = trie[character];
      traverser = traverser.substring(1);
    }
    else {
      return {};
    }
  }
  return getResults(trie, query);
}

export default class SearchableDropdownSelect extends React.Component {
  constructor(props) {
    super(props);
    const entriesTrie = {};
    for (const key in this.props.entries) {
      trieAdd(entriesTrie, key, this.props.entries[key]);
    }
    this.state = {
      entriesTrie: entriesTrie,
      matches: {},
    };
  }
  onMatchSelect(code) {
    console.log(code);
  }
  onQueryBoxDeselect() {
    setTimeout( // Matches only shown when query box focused, but to select match, query box is blurred. Timeout solves race condition
      () => {
        this.setState({
          selected: false,
        });
      },
      120 // Tested to be delay needed for an option onClick to trigger
    );
  }
  onQueryBoxSelect(event) {
    if (event.target.value.length !== 0) {
      this.setState({
        selected: true,
      });
    }
  }
  onQueryChange(event) {
    if (event.target.value.length === 0) {
      this.setState({
        matches: {},
        query: event.target.value,
        selected: false,
      });
    }
    else if (this.state.query !== event.target.value) {
      this.setState({
        matches: trieSearch(this.state.entriesTrie, event.target.value),
        query: event.target.value,
        selected: true,
      });
    }
  }
  render() {
    return (
      <div className="input-group">
        <input
          className="form-control"
          onBlur={this.onQueryBoxDeselect.bind(this)}
          onChange={this.onQueryChange.bind(this)}
          onFocus={this.onQueryBoxSelect.bind(this)}
          type="text"
        />
        {this.state.selected && <select multiple className="form-control">
          {Object.keys(this.state.matches).map((key, index) => (
            <option key={index} onClick={() => this.onMatchSelect(this.state.matches[key])}>{key}</option>
          ))}
        </select>}
      </div>
    );
  }
};