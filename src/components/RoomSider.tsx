import { Layout, Avatar, Menu } from 'antd';
import * as React from 'react';

import { useRoomMembers } from '../utils/useRoomMembers';

const { Sider } = Layout;

export function RoomSider() {
  const members = useRoomMembers();

  return (
    <Sider className="site-layout-background" width={200}>
      <Menu style={{ height: '100%' }}>
        {members.map(({ name, photoURL }) => (
          <Menu.Item key={photoURL}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <Badge status="success" /> */}
              <Avatar src={photoURL} style={{ marginRight: 10 }} size="small" />
              <div style={{ flexGrow: 1 }}>{name}</div>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}
