import * as firebase from 'firebase/app';

type DocRef = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

const firestore = firebase.firestore();

export async function getOrCreateUserRoom(user: firebase.User) {
  try {
    const userDoc = firestore.collection('users').doc(user.uid);

    const userSnap = await userDoc.get();
    const currentRoom: DocRef | null = userSnap.get('currentRoom');

    if (!currentRoom) {
      return await generateNewRoom(user);
    }

    const roomSnap = await currentRoom.get();
    if (!roomSnap.exists) {
      return await generateNewRoom(user);
    }

    return currentRoom;
  } catch (e) {
    return await generateNewRoom(user);
  }
}

export async function generateNewRoom(user: firebase.User) {
  const batch = firestore.batch();

  const rooms = firestore.collection('rooms');
  const newRoomDoc = rooms.doc();

  batch.set(newRoomDoc, {});

  const userDoc = firestore.collection('users').doc(user.uid);
  batch.update(userDoc, { currentRoom: newRoomDoc });

  const memberDoc = newRoomDoc.collection('members').doc(user.uid);
  batch.set(memberDoc, {
    admin: true,
    name: user.displayName,
    photoURL: user.photoURL,
  });

  await batch.commit();

  return newRoomDoc;
}
