import * as firebase from 'firebase/app';
import * as React from 'react';
import { useRoute } from 'react-router5';
import { VideoJsPlayer } from 'video.js';

import { RemoteRoom, LocalRoom, RoomAction } from '../types';
import { createRoomReducer } from './createRoomReducer';
import { id } from './id';

const initialState: RemoteRoom = {
  isPlaying: false,
  lastPlayTime: null,
  playedSeconds: 0,
  filename: null,
  url: null,
  lastActionId: null,
};

const rooms = firebase.firestore().collection('rooms');

export function useRoom(
  url: string | null,
  file: File | null,
  player: VideoJsPlayer | null,
) {
  const localActionId = React.useRef('');
  const localLastPlayTime = React.useRef<number | null>(null);

  const {
    route: {
      params: { roomId },
    },
  } = useRoute();

  const roomDoc = React.useMemo(
    () =>
      roomId
        ? (rooms.doc(roomId) as firebase.firestore.DocumentReference<
            RemoteRoom
          >)
        : null,
    [roomId],
  );

  const filename = file?.name;
  React.useEffect(() => {
    async function setFileData() {
      if (!roomDoc || !filename || !url) {
        return;
      }

      if (filename) {
        await roomDoc.update({
          ...initialState,
          filename,
          url: null,
        });
        return;
      }

      await roomDoc.update({
        ...initialState,
        url,
        filename: null,
      });
    }

    setFileData();
  }, [filename, roomDoc, url]);

  React.useEffect(() => {
    async function refresh() {
      if (!roomDoc || !player) {
        return;
      }
      const snap = await roomDoc.get();
      const { playedSeconds, isPlaying } = await getData(roomDoc, snap);

      player.currentTime(playedSeconds);

      if (isPlaying) {
        player.play();
      }
    }

    refresh();
  }, [player, roomDoc]);

  React.useEffect(() => {
    if (!roomDoc) {
      return;
    }

    const unsubscribe = roomDoc.onSnapshot(async (snap) => {
      const { isPlaying, playedSeconds, lastPlayTime } = await getData(
        roomDoc,
        snap,
      );

      console.log({ isPlaying, playedSeconds, lastPlayTime });

      if (lastPlayTime && lastPlayTime.seconds !== localLastPlayTime.current) {
        const newTime = playedSeconds + getNowSeconds() - lastPlayTime.seconds;
        player?.currentTime(newTime);
      }
      localLastPlayTime.current = lastPlayTime ? lastPlayTime.seconds : null;

      if (isPlaying) {
        player?.play();
      } else {
        player?.pause();
      }
    });

    return () => unsubscribe();
  }, [player, roomDoc]);

  const reducer = React.useMemo(
    () =>
      createRoomReducer<RemoteRoom, RoomAction>({
        togglePlay: () => {
          const isPlaying = !player?.paused();
          if (isPlaying) {
            player?.pause();
          } else {
            player?.play();
          }
          return {
            isPlaying,
          };
        },
        seek: ({ time }) => {
          player?.currentTime(time);
          return {
            playedSeconds: time,
            lastPlayTime: firebase.firestore.FieldValue.serverTimestamp(),
          };
        },
        play: () => {
          const playedSeconds = player?.currentTime() || 0;
          player?.play();
          return {
            isPlaying: true,
            playedSeconds,
            lastPlayTime: firebase.firestore.FieldValue.serverTimestamp(),
          };
        },
        pause: () => {
          player?.pause();
          const playedSeconds = player?.currentTime() || 0;
          return {
            isPlaying: false,
            playedSeconds,
            lastPlayTime: null,
          };
        },
        newSrc: () => ({ lastPlayTime: null, playedSeconds: 0 }),
      }),
    [player],
  );

  // const dispatch = React.useCallback(
  //   async (a: RoomAction | { type: 'togglePlay' }) => {
  //     const action =
  //       a.type === 'togglePlay'
  //         ? ({ type: player?.paused() ? 'play' : 'pause' } as RoomAction)
  //         : a;

  //     const newData = reducer(action);

  //     if (newData) {
  //       localActionId.current = id();

  //       await roomDoc?.update({
  //         ...newData,
  //         lastActionId: localActionId.current,
  //       });
  //     }
  //   },
  //   [player, reducer, roomDoc],
  // );

  return (a: RoomAction) => reducer(a);
}

function areKeysEqual<T>(a: T, b: {}) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  const bKeysSet = new Set(bKeys);

  return aKeys.every((k) => bKeysSet.has(k));
}

async function getData(
  doc: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
  snap: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
) {
  const maybeData = snap.data();
  if (!maybeData) {
    throw new Error("tried to access room that doesn't exist?");
  }

  const maybeUnitializedData: Partial<LocalRoom> = maybeData;
  if (!areKeysEqual(maybeUnitializedData, initialState)) {
    console.log('unitialized room, initializing...');
    await doc.update(initialState);
    console.log('...room initialized.');
    return initialState as LocalRoom;
  }

  return maybeData as LocalRoom;
}

function getNowSeconds() {
  return Date.now() / 1000;
}
