import Vuex from 'vuex'

import meetup from './meetup'
import user from './user'
import shared from './shared'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      meetup,
      user,
      shared
    }
  })
}

export default createStore
