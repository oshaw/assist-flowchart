'use strict'

export const originUpdateResults = (results) => {
  return {type: 'ORIGIN_RESULTS', payload: results}
}
export const originSelect = (item) => {
  return {type: 'ORIGIN_SELECT', payload: item}
}
export const originQuery = (query) => {
  return {type: 'ORIGIN_QUERY', payload: query}
}
