import * as React from 'react';

import { useRoom } from './RoomProvider';
import { useRouter } from 'react-router5';

export function RoomsView() {
  const { navigate } = useRouter();
  const { roomId } = useRoom();

  React.useEffect(() => {
    if (!roomId) {
      return;
    }

    navigate('rooms.:roomId', { roomId });
  }, [navigate, roomId]);

  return null;
}
