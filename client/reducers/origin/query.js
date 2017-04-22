'use strict'

export default function (state = '', action) {
  switch (action.type) {
    case 'ORIGIN_QUERY': return action.payload
    case 'ORIGIN_SELECT': return action.payload.name
  }
  return state
}
