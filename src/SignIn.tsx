import * as firebase from 'firebase/app';
import * as React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

const auth = firebase.auth();

export function SignIn() {
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
}
