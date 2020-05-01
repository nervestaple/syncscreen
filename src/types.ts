import * as firebase from 'firebase/app';

export type RoomAction =
  | { type: 'togglePlay' }
  | { type: 'seek'; time: number }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'newSrc' };

interface BaseRoom {
  isPlaying: boolean;
  playedSeconds: number;
  filename: string | null;
  url: string | null;
  lastActionId: string | null;
}

export interface RemoteRoom extends BaseRoom {
  lastPlayTime: firebase.firestore.FieldValue | null;
}

export interface LocalRoom extends BaseRoom {
  lastPlayTime: { seconds: number } | null;
}
