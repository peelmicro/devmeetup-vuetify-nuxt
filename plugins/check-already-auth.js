import firebaseApp from './firebase'

export default function ({store, router}) {
  firebaseApp.auth().onAuthStateChanged((user) => {
    if (user) {
      store.dispatch('autoSignIn', user)
      store.dispatch('fetchUserData')
    }
  })
}
