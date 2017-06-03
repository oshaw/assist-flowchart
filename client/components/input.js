'use strict'
import React from 'react'
import DropdownSearch from '../containers/dropdown-search'

const Input = () => (
  <div>
    <DropdownSearch content='origin' />
    <DropdownSearch content='destination' />
    <DropdownSearch content='year' />
    <DropdownSearch content='major' />
  </div>
)

export default Input
