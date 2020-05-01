import {
  CaretRightOutlined,
  PauseOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { Slider } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import * as React from 'react';

import { formatTime } from '../utils/formatTime';

interface Props {
  isVideoHovered: boolean;
  disabled?: boolean;
  time: number;
  isPlaying: boolean;
  duration: number | undefined;
  onSeek: (newValue: number) => void;
  onFullScreenClick: () => void;
  onTogglePlayClick: () => void;
  style?: React.CSSProperties;
}

export function PlayerControls({
  isVideoHovered,
  disabled,
  time,
  isPlaying,
  duration,
  onFullScreenClick,
  onTogglePlayClick,
  onSeek,
  style,
}: Props) {
  console.log(time);
  const fadeStyle: React.CSSProperties = isVideoHovered
    ? {
        transition: '0.1s opacity ease-in',
        opacity: 1,
      }
    : {
        transition: '0.7s opacity ease-out',
        transitionDelay: '1s',
        opacity: 0,
      };

  const disabledStyle: React.CSSProperties = disabled
    ? {
        cursor: 'default',
        opacity: 0.5,
      }
    : {
        cursor: 'pointer',
      };

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          ...fadeStyle,
        }}
      >
        <button
          disabled={disabled}
          onClick={onTogglePlayClick}
          style={{
            border: 'none',
            background: 'none',
            color: disabled ? '' : 'white',
            fontSize: 14,
            ...disabledStyle,
          }}
        >
          {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        </button>
        <Slider
          defaultValue={0}
          disabled={disabled}
          style={{ flexGrow: 1, margin: 15, ...disabledStyle }}
          onChange={onSeek as (val: SliderValue) => void}
          value={time}
          max={duration}
          tipFormatter={disabled ? null : formatTime}
        />
        <button
          disabled={disabled}
          onClick={onFullScreenClick}
          style={{
            border: 'none',
            background: 'none',
            color: disabled ? '' : 'white',
            fontSize: 14,
            ...disabledStyle,
          }}
        >
          <FullscreenOutlined />
        </button>
      </div>
    </div>
  );
}
