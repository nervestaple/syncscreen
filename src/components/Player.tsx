import * as firebase from 'firebase/app';
import * as React from 'react';
import ReactPlayer from 'react-player';
import { useRoute } from 'react-router5';

interface Props {
  url: string | null;
}

type ProgressHandler = (state: {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}) => void;

const rooms = firebase.firestore().collection('rooms');

export function Player({ url }: Props) {
  const {
    route: {
      params: { roomId },
    },
  } = useRoute();

  const roomDoc = roomId ? rooms.doc(roomId) : null;

  // TODO: any better way to handle null roomId? catch it earlier?
  const handleProgress: ProgressHandler = React.useCallback(
    async ({ playedSeconds }) => {
      if (!roomDoc) {
        return;
      }
      await roomDoc.update({ playedSeconds });
    },
    [roomDoc],
  );

  const handleStart = React.useCallback(async () => {
    if (!roomDoc) {
      return;
    }
    await roomDoc.update({ isPlaying: true });
  }, [roomDoc]);

  const handlePause = React.useCallback(async () => {
    if (!roomDoc) {
      return;
    }
    await roomDoc.update({ isPlaying: false });
  }, [roomDoc]);

  return (
    <div
      style={{
        width: '100%',
        height: '30vw',
        backgroundColor: 'black',
        border: '1px solid #303030',
        maxHeight: '90vh',
      }}
    >
      {url && (
        <ReactPlayer
          url={url}
          controls={true}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onStart={handleStart}
          onPause={handlePause}
        />
      )}
    </div>
  );
}
