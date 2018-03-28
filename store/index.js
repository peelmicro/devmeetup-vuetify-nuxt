import Vuex from 'vuex'
import firebase from 'firebase'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedMeetups: [
        {
          imageUrl:
            'https://cdn.images.express.co.uk/img/dynamic/136/590x/travel-activity-Madrid-Spain-nightlife-museums-bars-UploadExpress-Rob-Crossan-658625.jpg',
          id: '3asd342342342',
          title: 'Meetup in Madrid',
          date: new Date(),
          location: 'Madrid',
          description: 'Madrid is good!'
        },
        {
          imageUrl:
            'https://travel.usnews.com/static-travel/images/destinations/44/empire_state_building_getty_zsolt_hlinka.jpg',
          id: '32314ff4sdsff',
          title: 'Meetup in New York',
          date: new Date(),
          location: 'New York',
          description: 'New York is good as well!'
        }
      ],
      user: null
    },
    mutations: {
      createMeetup (state, payload) {
        state.loadedMeetups.push(payload)
      },
      setUser (state, payload) {
        state.user = payload
      }
    },
    actions: {
      createMeetup ({ commit }, payload) {
        const meetup = {
          title: payload.title,
          location: payload.location,
          imageUrl: payload.imageUrl,
          description: payload.description,
          date: payload.date,
          id: '34dw634rr664'
        }
        commit('createMeetup', meetup)
        // reach out to firebase and store it
      },
      signUserUp ({ commit }, payload) {
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              const newUser = {
                id: user.id,
                registeredMeetups: []
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              console.log(error)
            }
          )
      },
      signUserIn ({ commit }, payload) {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              const newUser = {
                id: user.id,
                registeredMeetups: []
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              console.log(error)
            }
          )
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
      }
    }
  })
}

export default createStore
