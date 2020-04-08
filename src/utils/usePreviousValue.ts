import * as React from 'react';

export function usePreviousValue<T>(value: T) {
  const ref = React.useRef<null | T>(null);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
