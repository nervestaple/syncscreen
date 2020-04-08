export const X = 'x';
// import * as firebase from 'firebase/app';
// import * as React from 'react';

// import { generateNewRoom, DocRef } from '../utils/roomUtils';
// import { useAuth } from './AuthProvider';
// import { useRoute } from 'react-router5';

// const RoomContext = React.createContext<{
//   roomId: string | null;
//   members: Member[];
//   generateNewRoom: () => void;
// }>({
//   roomId: null,
//   members: [],
//   generateNewRoom: () => {},
// });

// interface Props {
//   children: React.ReactNode;
// }

// const firestore = firebase.firestore();

// export function RoomProvider({ children }: Props) {
//   const { route: { params: roomId }} = useRoute();
//   const members = useMembers();

//   const generateNewRoom = React.useCallback(() => {

//   }, []);

//   return (
//     <RoomContext.Provider value={{ roomId, generateNewRoom, members }}>
//       {children}
//     </RoomContext.Provider>
//   );
// }

// export function useRoom() {
//   return React.useContext(RoomContext);
// }

// function useRoomId(): [string | null, () => Promise<void>] {
//   const { user } = useAuth();
//   const [roomId, setRoomId] = React.useState<string | null>(null);

//   const setNewRoom = React.useCallback(async () => {
//     if (!user) {
//       return;
//     }

//     const room = await generateNewRoom(user);
//     setRoomId(room.id);
//   }, [user]);

//   React.useEffect(() => {
//     if (!user) {
//       return;
//     }

//     // async function getOrCreateUserRoom(
//     //   userSnap: firebase.firestore.DocumentSnapshot<
//     //     firebase.firestore.DocumentData
//     //   >,
//     // ) {
//     //   if (!user) {
//     //     return;
//     //   }
//     //   const currentRoom: DocRef = userSnap.get('currentRoom');

//     //   if (!currentRoom) {
//     //     return await generateNewRoom(user);
//     //   }

//     //   try {
//     //     const roomSnap = await currentRoom.get();
//     //     if (!roomSnap.exists) {
//     //       return await generateNewRoom(user);
//     //     }
//     //   } catch (e) {
//     //     return await generateNewRoom(user);
//     //   }

//     //   return currentRoom;
//     // }

//     // async function getOrCreateUserRoom(
//     //   userSnap: firebase.firestore.DocumentSnapshot<
//     //     firebase.firestore.DocumentData
//     //   >,
//     // ) {
//     //   if (!user) {
//     //     return;
//     //   }
//     //   try {
//     //     const userDoc = firestore.collection('users').doc(user.uid);

//     //     const userSnap = await userDoc.get();
//     //     const currentRoom: DocRef | null = userSnap.get('currentRoom');

//     //     if (!currentRoom) {
//     //       return await generateNewRoom(user);
//     //     }

//     //     const roomSnap = await currentRoom.get();
//     //     if (!roomSnap.exists) {
//     //       return await generateNewRoom(user);
//     //     }

//     //     return currentRoom;
//     //   } catch (e) {
//     //     return await generateNewRoom(user);
//     //   }
//     // }

//     const unsubscribe = firestore
//       .collection('users')
//       .doc(user.uid)
//       .onSnapshot(async (userSnap) => {
//         // const room = await getOrCreateUserRoom(userSnap);
//         // if (!room) {
//         //   return;
//         // }
//         // setRoomId(room.id);
//         console.log({ userSnap });
//       });

//     return () => unsubscribe();
//   }, [setNewRoom, user]);

//   return [roomId, setNewRoom];
// }
