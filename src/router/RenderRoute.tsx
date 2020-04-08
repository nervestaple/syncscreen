import * as React from 'react';
import { useRoute } from 'react-router5';

import { routesByName } from './router';

export function RenderRoute(): JSX.Element | null {
  const {
    route,
    router: { navigateToDefault },
  } = useRoute();

  const matchingRoute = route && routesByName[route.name];

  React.useEffect(() => {
    if (!matchingRoute) {
      navigateToDefault();
    }
  }, [matchingRoute, navigateToDefault]);

  if (matchingRoute) {
    return matchingRoute.render;
  }

  return null;
}
