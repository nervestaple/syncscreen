import { Layout, Typography } from 'antd';
import * as firebase from 'firebase/app';
import * as React from 'react';
import { useRoute } from 'react-router5';

import { useAuth } from '../providers/AuthProvider';
import { useDropzoneURL } from '../providers/DropzoneProvider';
import { Player } from '../components/Player';
import { RoomSider } from '../components/RoomSider';
import { URLControl } from '../components/URLControl';
import { useInputURL } from '../components/URLInput';
import { RemoteRoom } from '../types';

const { Content } = Layout;
const { Title } = Typography;

const firestore = firebase.firestore();
const rooms = firestore.collection('rooms');

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
    file,
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

      const lastRoom = rooms.doc(roomId);
      const lastRoomSnap = await lastRoom.get();

      if (!lastRoomSnap.exists) {
        navigate('rooms');
        return;
      }

      await firestore.collection('users').doc(user.uid).update({ lastRoom });
    }

    checkRoomAndSetLastRoom();
  }, [navigate, roomId, user]);

  const filename = useRoomField('filename');

  return (
    <Layout
      className="site-layout-background"
      style={{ margin: '0 auto', padding: '20px 0', maxWidth: 900 }}
    >
      <RoomSider />
      <Content className="site-layout-background" style={{ padding: '0 20px' }}>
        <Title
          level={4}
          style={
            filename === file?.name
              ? { fontStyle: 'normal' }
              : { fontStyle: 'italic', opacity: 0.5 }
          }
        >
          {filename}
        </Title>
        <Player url={latestURL} file={file} />
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

function useRoomField<TKey extends keyof RemoteRoom>(key: TKey) {
  const [value, setValue] = React.useState<RemoteRoom[TKey] | null>(null);
  const {
    route: {
      params: { roomId },
    },
  } = useRoute();

  React.useEffect(() => {
    const unsubscribe = rooms.doc(roomId).onSnapshot((snap) => {
      setValue(snap.get(key));
    });

    return () => unsubscribe();
  }, [key, roomId]);

  return value;
}
