import * as React from 'react';

import '../video-js.css';

import { useHover } from '../utils/useHover';
import { usePlayer } from '../utils/usePlayer';

import { PlayerControls } from './PlayerControls';
import { useRoom } from '../utils/useRoom';

interface Props {
  url: string | null;
  file: File | null;
}

export function Player({ url, file }: Props) {
  const [isVideoHovered, videoHoverRef] = useHover<HTMLDivElement>();
  const [{ isPlaying, currentPlayedSeconds }, player, ref] = usePlayer(
    url,
    file,
  );

  const dispatch = useRoom(url, file, player);

  const controlsDisabled = !player || !url || !file;

  return (
    <>
      <div
        data-vjs-player
        style={{
          width: '100%',
          height: '30vw',
          backgroundColor: 'black',
          border: '1px solid #303030',
          maxHeight: '90vh',
        }}
        ref={videoHoverRef}
      >
        <video
          ref={ref}
          className="video-js"
          onClick={
            () => null
            // controlsDisabled ? null : dispatch({ type: 'togglePlay' })
          }
        />
        <PlayerControls
          isVideoHovered={isVideoHovered}
          disabled={controlsDisabled}
          time={currentPlayedSeconds}
          isPlaying={isPlaying}
          onFullScreenClick={() => {
            if (!player) {
              return;
            }
            if (document.fullscreenElement) {
              player.exitFullscreen();
            } else {
              player.requestFullscreen();
            }
          }}
          onTogglePlayClick={() => dispatch({ type: 'togglePlay' })}
          onSeek={(newValue) => dispatch({ type: 'seek', time: newValue })}
          duration={player?.duration()}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: '2px 10px',
          }}
        />
      </div>
    </>
  );
}
