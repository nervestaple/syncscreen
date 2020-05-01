const padZero = (digit: number) => `${digit < 10 ? '0' : ''}${digit}`;

export function formatTime(numSeconds: number) {
  const prefix = numSeconds < 0 ? '-' : '';
  const absNumSeconds = Math.abs(numSeconds);

  const hours = Math.floor(absNumSeconds / 3600);
  const minutes = Math.floor((absNumSeconds % 3600) / 60);
  const seconds = Math.floor(absNumSeconds) % 60;

  return hours > 0
    ? `${prefix}${hours}:${padZero(minutes)}:${padZero(seconds)}`
    : `${prefix}${minutes}:${padZero(seconds)}`;
}
