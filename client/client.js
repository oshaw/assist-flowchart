'use strict'
/* global React ReactDOM */

const DropdownSearch = React.createClass({
  getInitialState: function () {
    return {
      items: [
        {name: 'Allan Hancock College', path: 'AHC'},
        {name: 'Diablo Valley College', path: 'DIABLO'}
      ],
      results: [],
      selected: null
    }
  },
  search: function () {
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
  },
  select: function () {
    
  },
  render: function () {
    return (
      <div>
        <input ref='searchBar' onKeyUp={this.search} type='text' />
        <div>
          {
            this.state.results.map(function (item, i) {
              return (
                <p>{item.name}</p>
              )
            })
          }
        </div>
      </div>
    )
  }
})

ReactDOM.render(<DropdownSearch />, document.getElementById('root'))
