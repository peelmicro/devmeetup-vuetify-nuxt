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
      registerUserForMeetup (state, payload) {
        const id = payload.id
        if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
          return
        }
        state.user.registeredMeetups.push(id)
        state.user.fbKeys[id] = payload.fbkey
      },
      unregisterUserFromMeetup (state, payload) {
        const registeredMeetups = state.user.registeredMeetups
        registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
        Reflect.deleteProperty(state.user.fbKeys, payload)
      },
      setLoadedMeetups (state, payload) {
        state.loadedMeetups = payload
      },
      createMeetup (state, payload) {
        state.loadedMeetups.push(payload)
      },
      updateMeetupData (state, payload) {
        const meetup = state.loadedMeetups.find(meetup => {
          return meetup.id === payload.id
        })
        if (payload.title) {
          meetup.title = payload.title
        }
        if (payload.description) {
          meetup.description = payload.description
        }
        if (payload.date) {
          meetup.date = payload.date
        }
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
      registerUserForMeetup ({commit, getters}, payload) {
        commit('setLoading', true)
        const user = getters.user
        firebase.database().ref('/users/' + user.id).child('/registrations/')
          .push(payload)
          .then(data => {
            commit('setLoading', false)
            commit('registerUserForMeetup', {
              id: payload,
              fbkey: data.key
            })
          })
          .catch(error => {
            commit('setLoading', false)
            console.log(error)
          })
      },
      unregisterUserFromMeetup ({commit, getters}, payload) {
        const user = getters.user
        if (!user.fbKeys) {
          return
        }
        commit('setLoading', true)
        const fbKey = user.fbKeys[payload]
        firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
          .remove()
          .then(() => {
            commit('setLoading', false)
            commit('unregisterUserFromMeetup', payload)
          })
          .catch(error => {
            commit('setLoading', false)
            console.log(error)
          })
      },
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
          description: payload.description,
          date: payload.date.toISOString(),
          creatorId: getters.user.id
        }
        let imageUrl
        let key
        firebase.database().ref('meetups').push(meetup)
          .then((data) => {
            key = data.key
            return key
          })
          .then(key => {
            const filename = payload.image.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
          })
          .then(fileData => {
            imageUrl = fileData.metadata.downloadURLs[0]
            return firebase.database().ref('meetups').child(key).update({imageUrl})
          })
          .then(() => {
            commit('createMeetup', { ...meetup, imageUrl, id: key })
          })
          .catch((error) => {
            console.log(error)
          })
      },
      updateMeetupData ({commit}, payload) {
        commit('setLoading', true)
        const updateObj = {}
        if (payload.title) {
          updateObj.title = payload.title
        }
        if (payload.description) {
          updateObj.description = payload.description
        }
        if (payload.date) {
          updateObj.date = payload.date
        }
        firebase.database().ref('meetups').child(payload.id).update(updateObj)
          .then(() => {
            commit('setLoading', false)
            commit('updateMeetupData', payload)
          })
          .catch(
            error => {
              commit('setLoading', false)
              console.log(error)
            }
          )
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
                registeredMeetups: [],
                fbKeys: {}
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
                registeredMeetups: [],
                fbKeys: {}
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
        commit('setUser', {
          id: payload.uid,
          registeredMeetups: [],
          fbKeys: {}
        })
      },
      fetchUserData  ({ commit, getters }) {
        commit('setLoading', true)
        firebase.database().ref('/users/' + getters.user.id + '/registrations/')
          .once('value')
          .then(data => {
            const dataPairs = data.val()
            let registeredMeetups = []
            let swappedPairs = {}
            for (let key in dataPairs) {
              registeredMeetups.push(dataPairs[key])
              swappedPairs[dataPairs[key]] = key
            }
            const updatedUser = {
              id: getters.user.id,
              registeredMeetups: registeredMeetups,
              fbKeys: swappedPairs
            }
            commit('setLoading', false)
            commit('setUser', updatedUser)
          })
          .catch(error => {
            commit('setLoading', false)
            console.log(error)
          })
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
