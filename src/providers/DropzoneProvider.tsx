import React from 'react';
import { useDropzone } from 'react-dropzone';

import { DragPane } from '../components/DragPane';

const DropzoneContext = React.createContext<{
  url: string | null;
  lastSetTime: number;
  onClick: React.MouseEventHandler;
}>({ url: null, lastSetTime: Date.now(), onClick: () => {} });

interface Props {
  children: React.ReactNode;
}

export function DropzoneProvider({ children }: Props) {
  const [url, setURL] = React.useState<string | null>(null);
  const [lastSetTime, setLastSetTime] = React.useState(() => Date.now());

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (!(acceptedFiles.length > 0)) {
      return;
    }
    setURL(URL.createObjectURL(acceptedFiles[0]));
    setLastSetTime(Date.now());
  }, []);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: 'video/*',
    multiple: false,
  });

  const { onClick, ...rootProps } = getRootProps();

  if (!onClick) {
    return null;
  }

  return (
    <div {...rootProps}>
      <DropzoneContext.Provider value={{ url, onClick, lastSetTime }}>
        {children}
      </DropzoneContext.Provider>

      <input {...getInputProps()} hidden />
      <DragPane isDragAccept={isDragAccept} />
    </div>
  );
}

export function useDropzoneURL() {
  return React.useContext(DropzoneContext);
}
