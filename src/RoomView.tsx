import { Card, Layout } from 'antd';
import * as React from 'react';

import { Player } from './Player';
import { useAuth } from './AuthProvider';
import { RoomSider } from './RoomSider';
import { SignIn } from './SignIn';
import { URLControl } from './URLControl';
import { useInputURL } from './URLInput';
import { useDropzoneURL } from './DropzoneProvider';

const { Content } = Layout;

export function RoomView() {
  const {
    inputValue,
    inputURL,
    lastSetTime: lastInputURLSetTime,
    onInputChange,
  } = useInputURL();
  const {
    url: dropzoneURL,
    lastSetTime: lastDropzoneURLSetTime,
    onClick: onFilePickerClick,
  } = useDropzoneURL();

  const latestURL = useLatestURL(
    [inputURL, lastInputURLSetTime],
    [dropzoneURL, lastDropzoneURLSetTime],
  );

  const { user } = useAuth();
  if (!user) {
    return (
      <Card title="Sign In">
        <SignIn />
      </Card>
    );
  }

  return (
    <Layout
      className="site-layout-background"
      style={{ margin: '0 auto', padding: '20px 0', maxWidth: 900 }}
    >
      <RoomSider />
      <Content className="site-layout-background" style={{ padding: '0 20px' }}>
        {latestURL}
        <Player url={latestURL} />
        <URLControl
          inputValue={inputValue}
          onInputChange={onInputChange}
          onFilePickerClick={onFilePickerClick}
        />
      </Content>
    </Layout>
  );
}

function useLatestURL(...urlsWithTimes: Array<[string | null, number]>) {
  const validURLs = urlsWithTimes.filter(([url]) => url !== null);
  const [latestURL] = validURLs.reduce(
    ([url, time], [maxURL, maxTime]) => {
      if (time > maxTime) {
        return [url, time];
      }
      return [maxURL, maxTime];
    },
    ['', 0],
  );

  return latestURL;
}
