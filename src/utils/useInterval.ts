import { useEffect, useRef } from 'react';

export function useInterval<T>(callback: T, delay: number) {
  const savedCallback = useRef<T>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (
        savedCallback.current &&
        typeof savedCallback.current === 'function'
      ) {
        savedCallback.current();
      }
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
