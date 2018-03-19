import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedMeetups: [
        {
          imageUrl:
            'https://cdn.images.express.co.uk/img/dynamic/136/590x/travel-activity-Madrid-Spain-nightlife-museums-bars-UploadExpress-Rob-Crossan-658625.jpg',
          id: '3asd342342342',
          title: 'Meetup in Madrid',
          date: '2018-05-05'
        },
        {
          imageUrl:
            'https://travel.usnews.com/static-travel/images/destinations/44/empire_state_building_getty_zsolt_hlinka.jpg',
          id: '32314ff4sdsff',
          title: 'Meetup in New York',
          date: '2018-05-04'
        }
      ],
      user: {
        id: '3424242424',
        registeredMeetups: ['3asd342342342']
      }
    },
    mutations: {},
    actions: {},
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
      }
    }
  })
}

export default createStore
