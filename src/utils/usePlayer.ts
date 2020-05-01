import * as React from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

import '../video-js.css';

import { useInterval } from '../utils/useInterval';

const options: VideoJsPlayerOptions = {
  fluid: true,
  preload: 'auto',
  defaultVolume: 1,
  html5: {
    hls: {
      enableLowInitialPlaylist: true,
      smoothQualityChange: true,
      overrideNative: true,
    },
  },
};

export function usePlayer(
  url: string | null,
  file: File | null,
): [
  { isPlaying: boolean; currentPlayedSeconds: number },
  VideoJsPlayer | null,
  React.Ref<HTMLVideoElement>,
] {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentPlayedSeconds, setCurrentPlayedSeconds] = React.useState(0);
  const [player, setPlayer] = React.useState<VideoJsPlayer | null>(null);
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const p = videojs(ref.current, options, () => {
      p.volume(1);
      setPlayer(p);
    });

    return () => {
      p.dispose();
    };
  }, []);

  React.useEffect(() => {
    if (!player || !url || !file) {
      return;
    }
    player.src({ src: url, type: getType(file) });
    setCurrentPlayedSeconds(0);
  }, [file, player, url]);

  React.useEffect(() => {
    if (!player) {
      return;
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    player.on('play', handlePlay);
    player.on('pause', handlePause);

    return () => {
      if (!player) {
        return;
      }
      player.off('play', handlePlay);
      player.off('pause', handlePause);
    };
  }, [player]);

  useInterval(() => {
    if (!player || player.paused()) {
      return;
    }
    const time = player.currentTime();
    if (typeof time === 'number') {
      setCurrentPlayedSeconds(time);
    }
  }, 500);

  return [{ isPlaying, currentPlayedSeconds }, player, ref];
}

const converter: Record<string, string> = {
  'video/x-matroska': 'video/mp4',
};

function getType(file: File) {
  const converted = converter[file.type];

  if (converted) {
    return converted;
  }
  return file.type;
}
