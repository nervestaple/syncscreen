import * as firebase from 'firebase/app';
import * as React from 'react';

import { generateNewRoom, getOrCreateUserRoom } from './roomUtils';
import { useAuth } from './AuthProvider';

const RoomContext = React.createContext<{
  roomId: string | null;
  setNewRoom: () => void;
  members: firebase.firestore.DocumentData[];
}>({
  roomId: null,
  setNewRoom: () => {},
  members: [],
});

interface Props {
  children: React.ReactNode;
}

const firestore = firebase.firestore();

export function RoomProvider({ children }: Props) {
  const [roomId, setNewRoom] = useRoomId();
  const members = useMembers(roomId);

  return (
    <RoomContext.Provider value={{ roomId, setNewRoom, members }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return React.useContext(RoomContext);
}

function useRoomId(): [string | null, () => Promise<void>] {
  const { user } = useAuth();
  const [roomId, setRoomId] = React.useState<string | null>(null);

  const setNewRoom = React.useCallback(async () => {
    if (!user) {
      return;
    }

    const room = await generateNewRoom(user);
    setRoomId(room.id);
  }, [user]);

  React.useEffect(() => {
    async function fetchRoom() {
      if (!user) {
        return;
      }
      const currentRoom = await getOrCreateUserRoom(user);
      setRoomId(currentRoom.id);
    }

    fetchRoom();
  }, [setNewRoom, user]);

  return [roomId, setNewRoom];
}

interface Member {
  admin?: boolean;
  photoURL?: string;
  name: string;
}

function useMembers(roomId: string | null) {
  const [members, setMembers] = React.useState<Member[]>([]);

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
