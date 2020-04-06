import * as React from 'react';
import createRouter, { Router, Route } from 'router5';
import browserPlugin from 'router5-plugin-browser';
import persistentParamsPlugin from 'router5-plugin-persistent-params';

import { RoomView } from './RoomView';
import { RoomsView } from './RoomsView';

type AppRoute = Route<Record<string, any>> & {
  render: JSX.Element | null;
};

export const routes: AppRoute[] = [
  { name: 'rooms', path: '/rooms', render: <RoomsView /> },
  { name: 'rooms.:roomId', path: '/:roomId', render: <RoomView /> },
];

export const routesByName: { [key: string]: AppRoute } = routes.reduce(
  (acc, route) => ({
    ...acc,
    [route.name]: route,
  }),
  {},
);

export function startRouter() {
  return new Promise<Router<Record<string, any>>>((resolve) => {
    const router = createRouter(routes, { defaultRoute: 'rooms' });

    router.usePlugin(browserPlugin(), persistentParamsPlugin());
    router.start(() => resolve(router));
  });
}
