import { Card, Layout } from 'antd';
import * as firebase from 'firebase/app';
import * as React from 'react';
import { useRoute } from 'react-router5';

import { useAuth } from '../providers/AuthProvider';
import { useDropzoneURL } from '../providers/DropzoneProvider';
import { Player } from '../components/Player';
import { RoomSider } from '../components/RoomSider';
import { SignIn } from '../components/SignIn';
import { URLControl } from '../components/URLControl';
import { useInputURL } from '../components/URLInput';

const { Content } = Layout;

const firestore = firebase.firestore();

export function RoomView() {
  const {
    inputValue,
    inputURL,
    lastSetTime: lastInputURLSetTime,
    onInputChange,
  } = useInputURL();
  const {
    url: dropzoneURL,
    lastSetTime: lastDropzoneURLSetTime,
    onClick: onFilePickerClick,
  } = useDropzoneURL();

  const latestURL = useLatestURL(
    [inputURL, lastInputURLSetTime],
    [dropzoneURL, lastDropzoneURLSetTime],
  );

  const { user } = useAuth();
  const {
    route: {
      params: { roomId },
    },
    router: { navigate },
  } = useRoute();

  React.useEffect(() => {
    async function checkRoomAndSetLastRoom() {
      if (!user) {
        return;
      }

      const lastRoom = firestore.collection('rooms').doc(roomId);
      const lastRoomSnap = await lastRoom.get();

      if (!lastRoomSnap.exists) {
        navigate('rooms');
        return;
      }

      await firestore.collection('users').doc(user.uid).update({ lastRoom });
    }

    checkRoomAndSetLastRoom();
  }, [navigate, roomId, user]);

  if (!user) {
    return (
      <Card title="Sign In">
        <SignIn />
      </Card>
    );
  }

  return (
    <Layout
      className="site-layout-background"
      style={{ margin: '0 auto', padding: '20px 0', maxWidth: 900 }}
    >
      <RoomSider />
      <Content className="site-layout-background" style={{ padding: '0 20px' }}>
        {latestURL}
        <Player url={latestURL} />
        <URLControl
          inputValue={inputValue}
          onInputChange={onInputChange}
          onFilePickerClick={onFilePickerClick}
        />
      </Content>
    </Layout>
  );
}

function useLatestURL(...urlsWithTimes: Array<[string | null, number]>) {
  const validURLs = urlsWithTimes.filter(([url]) => url !== null);
  const [latestURL] = validURLs.reduce(
    ([url, time], [maxURL, maxTime]) => {
      if (time > maxTime) {
        return [url, time];
      }
      return [maxURL, maxTime];
    },
    ['', 0],
  );

  return latestURL;
}

// function useRoomFromRoute() {
//   const {
//     route: {
//       params: { roomId },
//     },
//   } = useRoute();
//
//   const { user } = useAuth();
//
//   React.useEffect(() => {
//     async function checkAndFetchRoom() {
//       if (!user) {
//         return;
//       }
//
//       const roomSnap = await firestore.collection('rooms').doc(roomId).get();
//       if (!roomSnap.exists) {
//         return;
//       }

//       generateNewRoom(user);
//     }

//     checkAndFetchRoom();
//   }, [roomId, user]);
// }
