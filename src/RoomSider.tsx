import { Layout, Avatar, Menu, Badge } from 'antd';
import * as React from 'react';
import { useRoom } from './RoomProvider';

const { Sider } = Layout;

export function RoomSider() {
  const { members } = useRoom();

  return (
    <Sider className="site-layout-background" width={200}>
      <Menu style={{ height: '100%' }}>
        {members.map(({ name, photoURL }) => (
          <Menu.Item>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <Badge status="success" /> */}
              <Avatar src={photoURL} style={{ margin: 10 }} />
              <div style={{ flexGrow: 1 }}>{name}</div>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}
