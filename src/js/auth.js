import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import * as authModal from './authModal';
import * as loginModal from './loginModal';

const firebaseConfig = {
  apiKey: 'AIzaSyD8FnUfZWnKXjBhhdLmvKeEnxMua2fFWzk',
  authDomain: 'filmoteka-ce20f.firebaseapp.com',
  projectId: 'filmoteka-ce20f',
  storageBucket: 'filmoteka-ce20f.appspot.com',
  messagingSenderId: '1092324271578',
  appId: '1:1092324271578:web:801259c858eac0c4e10ce3',
};

export function init() {
  !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();
  authModal.init();
  loginModal.init();

  const auth = firebase.auth();
  const db = firebase.firestore();

  const authformRef = document.querySelector('.js-register-form');
  const loginformRef = document.querySelector('.js-login-form');
  const backdropRef = document.querySelector('.js-backdrop');
  const logoutRef = document.querySelector('.js-logout');
  const loggedInLinks = document.querySelector('.js-logged-in');
  const loggedOutLinks = document.querySelector('.js-logged-out');

  auth.onAuthStateChanged(user => {
    if (user) {
      setupUI(user);
    } else {
      setupUI();
    }
  });

  authformRef.addEventListener('submit', loginUser);
  logoutRef.addEventListener('click', logoutUser);
  loginformRef.addEventListener('submit', authUser);

  function authUser(e) {
    e.preventDefault();

    const email = loginformRef['login-email'].value;
    const password = loginformRef['login-password'].value;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        loginformRef.reset();
        backdropRef.classList.add('hidden');
      })
      .catch(err => {
        if (err.code === 'auth/user-not-found') {
          alert('Invalid email entered!');
          return;
        }

        if (err.code === 'auth/wrong-password') {
          alert('The password is invalid!');
          return;
        }
      });
  }

  function loginUser(e) {
    e.preventDefault();

    const email = authformRef['email'].value;
    const password = authformRef['password'].value;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        authformRef.reset();
        backdropRef.classList.add('hidden');
      })
      .catch(err => {
        if (err.code === 'auth/invalid-email') {
          alert('Please, enter correct email!');
          return;
        }

        if (err.code === 'auth/weak-password') {
          alert('Password must be at least 6 characters long!');
          return;
        }

        if (err.code === 'auth/email-already-in-use') {
          alert('This email already in use!');
        }
      });
  }

  function logoutUser(e) {
    e.preventDefault();
    auth.signOut();
  }

  function setupUI(user) {
    if (user) {
      loggedInLinks.classList.remove('nav-hidden');
      loggedOutLinks.classList.add('nav-hidden');
    } else {
      loggedInLinks.classList.add('nav-hidden');
      loggedOutLinks.classList.remove('nav-hidden');
    }
  }
}
