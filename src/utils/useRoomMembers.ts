import * as firebase from 'firebase/app';
import * as React from 'react';
import { useRoute } from 'react-router5';

const firestore = firebase.firestore();

interface Member {
  admin?: boolean;
  photoURL?: string;
  name: string;
}

export function useRoomMembers() {
  const [members, setMembers] = React.useState<Member[]>([]);

  const {
    route: {
      params: { roomId },
    },
  } = useRoute();

  React.useEffect(() => {
    if (!roomId) {
      return;
    }

    const unsubscribe = firestore
      .collection('rooms')
      .doc(roomId)
      .collection('members')
      .onSnapshot(({ docs }) => {
        const allMembers = docs.map((doc) => doc.data() as Member);
        setMembers(allMembers);
      });

    return () => unsubscribe();
  }, [roomId]);

  return members;
}
