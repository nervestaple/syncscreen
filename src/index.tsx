import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router5';
import * as serviceWorker from './serviceWorker';

import { App } from './App';
import { AuthProvider } from './AuthProvider';
import { RoomProvider } from './RoomProvider';
import { startRouter } from './router';

import './index.css';

async function main() {
  const router = await startRouter();

  ReactDOM.render(
    <React.StrictMode>
      <RouterProvider router={router}>
        <AuthProvider>
          <RoomProvider>
            <App />
          </RoomProvider>
        </AuthProvider>
      </RouterProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}

main();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
