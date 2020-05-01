import * as firebase from 'firebase/app';

const firestore = firebase.firestore();
const dummyCollection = firestore.collection('test');

export function id() {
  return dummyCollection.doc().id;
}
