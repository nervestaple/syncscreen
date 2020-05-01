import React from 'react';
import { useDropzone } from 'react-dropzone';

import { DragPane } from '../components/DragPane';

const DropzoneContext = React.createContext<{
  url: string | null;
  file: File | null;
  lastSetTime: number;
  onClick: React.MouseEventHandler;
}>({ url: null, file: null, lastSetTime: Date.now(), onClick: () => {} });

interface Props {
  children: React.ReactNode;
}

export function DropzoneProvider({ children }: Props) {
  const [url, setURL] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [lastSetTime, setLastSetTime] = React.useState(() => Date.now());

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (!(acceptedFiles.length > 0)) {
      return;
    }
    const file = acceptedFiles[0];
    setURL(URL.createObjectURL(file));
    setFile(file);
    setLastSetTime(Date.now());
  }, []);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: 'video/*,.mkv',
    multiple: false,
  });

  const { onClick, ...rootProps } = getRootProps();

  if (!onClick) {
    return null;
  }

  return (
    <div {...rootProps}>
      <DropzoneContext.Provider value={{ url, file, onClick, lastSetTime }}>
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
