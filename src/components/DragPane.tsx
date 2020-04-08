import * as React from 'react';

interface Props {
  isDragAccept: boolean;
}

export function DragPane({ isDragAccept }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        background: 'seagreen',
        opacity: isDragAccept ? 0.7 : 0,
        zIndex: 99999999,
        pointerEvents: 'none',
        transition: `0.15s opacity ease-${isDragAccept ? 'in' : 'out'}`,
      }}
    />
  );
}
