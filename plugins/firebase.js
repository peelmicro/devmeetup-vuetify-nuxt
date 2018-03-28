import firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyDgQ64wKXo7zQLLda7pWY_VOYmbrSU_TBw',
  authDomain: 'devmeetup-3e7e5.firebaseapp.com',
  databaseURL: 'https://devmeetup-3e7e5.firebaseio.com',
  projectId: 'devmeetup-3e7e5',
  storageBucket: 'devmeetup-3e7e5.appspot.com'
}

let firebaseApp

if (firebase.apps.length === 0) {
  firebaseApp = firebase.initializeApp(config)
} else {
  firebaseApp = firebase.apps[0]
}

export default firebaseApp
