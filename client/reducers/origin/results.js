'use strict'

export default function (state = null, action) {
  switch (action.type) {
    case 'ORIGIN_RESULTS': return action.payload
  }
  return state
}
