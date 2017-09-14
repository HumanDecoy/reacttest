import firebase from 'firebase';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA0jI5LOr252ELdKinEUf7171HrlWp9mdo",
    authDomain: "aproject-7e642.firebaseapp.com",
    databaseURL: "https://aproject-7e642.firebaseio.com",
    projectId: "aproject-7e642",
    storageBucket: "aproject-7e642.appspot.com",
    messagingSenderId: "1041399695909"
  };
  firebase.initializeApp(config);

export default firebase;