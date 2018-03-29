import Vuex from 'vuex'
import firebase from 'firebase'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedMeetups: [],
      user: null,
      loading: false,
      authError: null
    },
    mutations: {
      setLoadedMeetups (state, payload) {
        state.loadedMeetups = payload
      },
      createMeetup (state, payload) {
        state.loadedMeetups.push(payload)
      },
      setUser (state, payload) {
        state.user = payload
      },
      setLoading (state, payload) {
        state.loading = payload
      },
      setAuthError (state, payload) {
        state.authError = payload
      },
      clearAuthError (state) {
        state.authError = null
      }
    },
    actions: {
      loadMeetups ({ commit }) {
        commit('setLoading', true)
        firebase.database().ref('meetups').once('value')
          .then((data) => {
            const meetups = []
            const obj = data.val()
            for (let key in obj) {
              meetups.push({
                id: key,
                title: obj[key].title,
                location: obj[key].location,
                imageUrl: obj[key].imageUrl,
                description: obj[key].description,
                date: obj[key].date,
                creatorId: obj[key].creatorId
              })
            }
            commit('setLoadedMeetups', meetups)
            commit('setLoading', false)
          })
          .catch((error) => {
            commit('setLoading', false)
            console.log(error)
          })
      },
      createMeetup ({ commit, getters }, payload) {
        const meetup = {
          title: payload.title,
          location: payload.location,
          imageUrl: payload.imageUrl,
          description: payload.description,
          date: payload.date.toISOString(),
          creatorId: getters.user.id
        }
        firebase.database().ref('meetups').push(meetup)
          .then((data) => {
            const key = data.key
            commit('createMeetup', {...meetup, id: key})
          })
          .catch((error) => {
            console.log(error)
          })
      },
      signUserUp ({ commit }, payload) {
        commit('setLoading', true)
        commit('clearAuthError')
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              const newUser = {
                id: user.id,
                registeredMeetups: []
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setAuthError', error)
            }
          )
      },
      signUserIn ({ commit }, payload) {
        commit('setLoading', true)
        commit('clearAuthError')
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              const newUser = {
                id: user.id,
                registeredMeetups: []
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setAuthError', error)
            }
          )
      },
      autoSignIn ({ commit }, payload) {
        commit('setUser', {id: payload.uid, registeredMeetups: []})
      },
      logout ({ commit }) {
        firebase.auth().signOut()
        commit('setUser', null)
      },
      clearAuthError ({ commit }) {
        commit('clearAuthError')
      }
    },
    getters: {
      loadedMeetups (state) {
        return state.loadedMeetups.sort((meetupA, meetupB) => {
          return meetupA.date > meetupB.date
        })
      },
      featuredMeetups (state, getters) {
        return getters.loadedMeetups.slice(0, 5)
      },
      loadedMeetup (state) {
        return meetupId => {
          return state.loadedMeetups.find(meetup => {
            return meetup.id === meetupId
          })
        }
      },
      user (state) {
        return state.user
      },
      authError (state) {
        return state.authError
      },
      loading (state) {
        return state.loading
      }
    }
  })
}

export default createStore
