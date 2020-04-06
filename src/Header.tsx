import {
  Avatar,
  Layout,
  Typography,
  Dropdown,
  Menu,
  Button,
  Popconfirm,
} from 'antd';
import * as React from 'react';

import { useAuth } from './AuthProvider';
import { useRoom } from './RoomProvider';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export function Header() {
  const { user, logout } = useAuth();
  const { roomId, setNewRoom } = useRoom();

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <AntHeader>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          SyncScreen
        </Title>
        {user && (
          <div>
            <code>{roomId}</code>{' '}
            <Popconfirm
              title="Are you sure?"
              okText="Yes"
              cancelText="No"
              okType="danger"
              onConfirm={setNewRoom}
            >
              <Button style={{ marginRight: 20 }}>Generate new room</Button>
            </Popconfirm>
            <Dropdown overlay={menu} trigger={['click']}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <Avatar src={getAvatarSrc(user)} />
              </a>
            </Dropdown>
          </div>
        )}
      </div>
    </AntHeader>
  );
}

function getAvatarSrc(currentUser: firebase.User | null) {
  if (!currentUser) {
    return;
  }
  if (!currentUser.photoURL) {
    return;
  }
  return currentUser.photoURL;
}
