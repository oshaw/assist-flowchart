'use strict'

export default function (state = null, action) {
  switch (action.type) {
    case 'ORIGIN_SELECT': return action.payload
  }
  return state
}
