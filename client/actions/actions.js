'use strict'

export const originUpdateResults = (results) => {
  return {type: 'ORIGIN_RESULTS', payload: results}
}

export const originSelect = (item) => {
  return {type: 'ORIGIN_SELECT', payload: item}
}
