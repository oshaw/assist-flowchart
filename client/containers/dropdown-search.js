'use strict'
import React, {Component} from 'react'
import {connect} from 'react-redux'

class DropdownSearch extends Component {
  search () {
    const query = this.refs.searchBar.value.trim()
    const regexp = new RegExp(query, 'i')
    let results = []
    if (!query) {
      this.setState({results: []})
      return
    }
    this.state.items.map(function (item, i) {
      if (item.name.match(regexp)) results.push(item)
    })
    this.setState({results: results})
  }
  select () {}
  render () {
    return (
      <div>
        <input ref='searchBar' onKeyUp={this.search} type='text' />
      </div>
    )
  }
}

export default DropdownSearch
