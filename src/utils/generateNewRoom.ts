import * as firebase from 'firebase/app';

const firestore = firebase.firestore();

export async function generateNewRoom(user: firebase.User) {
  const rooms = firestore.collection('rooms');
  const batch = firestore.batch();

  const newRoomDoc = rooms.doc();

  batch.set(newRoomDoc, {});

  const userDoc = firestore.collection('users').doc(user.uid);
  batch.update(userDoc, { lastRoom: newRoomDoc });

  const memberDoc = newRoomDoc.collection('members').doc(user.uid);
  batch.set(memberDoc, {
    admin: true,
    name: user.displayName,
    photoURL: user.photoURL,
  });

  await batch.commit();

  return newRoomDoc;
}
