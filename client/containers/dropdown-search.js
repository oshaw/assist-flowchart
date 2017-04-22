'use strict'
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {originUpdateResults} from '../actions/actions'

class DropdownSearch extends Component {
  search (query) {
    const regexp = new RegExp(query, 'i')
    let results = []
    if (!query) {
      this.props.originUpdateResults([])
      return
    }
    this.props.origin.all.map(function (item, i) {
      if (item.name.match(regexp)) results.push(item)
    })
    this.props.originUpdateResults(results)
  }
  select () {}
  renderList () {
    if (!this.props.origin.results) return
    return this.props.origin.results.map((item) => {
      return (
        <p key={item.name}>{item.name}</p>
      )
    })
  }
  render () {
    return (
      <div>
        <input onChange={event => this.search(event.target.value)} type='text' />
        <div>{this.renderList()}</div>
      </div>
    )
  }
}
function mapStateToProps (state) { return {origin: state} }
function matchDispatchToProps (dispatch) {
  return bindActionCreators(
    {originUpdateResults: originUpdateResults},
    dispatch
  )
}

export default connect(mapStateToProps, matchDispatchToProps)(DropdownSearch)
