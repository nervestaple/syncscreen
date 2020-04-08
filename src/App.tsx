import { Layout } from 'antd';
import React from 'react';

import { Header } from './components/Header';
import { useAuth } from './providers/AuthProvider';
import { DropzoneProvider } from './providers/DropzoneProvider';
import { RenderRoute } from './router/RenderRoute';

import './App.css';

const { Content, Footer } = Layout;

export function App() {
  const { isAuthLoaded, user } = useAuth();

  const shouldDisableDrag = !isAuthLoaded || !user;

  const render = (
    <div className="App">
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        {isAuthLoaded && (
          <>
            <Content style={{ marginTop: 50, padding: '0 60px' }}>
              <RenderRoute />
            </Content>
            <Footer style={{ textAlign: 'center' }}>Jim ©2020</Footer>
          </>
        )}
      </Layout>
    </div>
  );

  if (shouldDisableDrag) {
    return render;
  }

  return <DropzoneProvider>{render}</DropzoneProvider>;
}
