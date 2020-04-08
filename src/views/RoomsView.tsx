import * as firebase from 'firebase/app';
import * as React from 'react';
import { useRoute } from 'react-router5';

import { useAuth } from '../providers/AuthProvider';
import { generateNewRoom } from '../utils/generateNewRoom';

type DocRef = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

const firestore = firebase.firestore();

export function RoomsView() {
  const {
    route: {
      params: { roomId: roomIdFromRoute },
    },
    router: { navigate },
  } = useRoute();

  const { user } = useAuth();

  React.useEffect(() => {
    async function check() {
      const roomIdToNavigateTo = await getOrCreateRoomId(user, roomIdFromRoute);
      if (roomIdToNavigateTo) {
        navigate('rooms.:roomId', { roomId: roomIdToNavigateTo });
      }
    }

    check();
  }, [navigate, roomIdFromRoute, user]);

  return null;
}

async function getOrCreateRoomId(
  user: firebase.User | null,
  roomIdFromRoute: string | null,
) {
  if (!user) {
    return;
  }

  if (roomIdFromRoute && doesRoomExist(roomIdFromRoute)) {
    return roomIdFromRoute;
  }

  const lastRoomIdFromUser = await getLastRoom(user);
  if (lastRoomIdFromUser) {
    if (doesRoomExist(lastRoomIdFromUser)) {
      return lastRoomIdFromUser;
    } else {
      await firestore
        .collection('users')
        .doc(user.uid)
        .update({ lastRoom: null });
    }
  }

  const newRoom = await generateNewRoom(user);
  return newRoom.id;
}

async function doesRoomExist(roomId: string) {
  const roomSnap = await firestore.collection('rooms').doc(roomId).get();
  return roomSnap.exists;
}

async function getLastRoom(user: firebase.User) {
  const userSnap = await firestore.collection('users').doc(user.uid).get();
  const roomRef: DocRef | null = userSnap.get('lastRoom');
  if (!roomRef) {
    return null;
  }
  return roomRef.id;
}
