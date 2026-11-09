// Used by `ng serve` / `ionic cap run android -l --external` (development build).
// Points at the phone's own loopback, forwarded to this machine's port 3000
// over USB via `adb reverse tcp:3000 tcp:3000` — this avoids depending on
// both devices being on the same Wi-Fi network (which breaks every time the
// network changes, or on networks with client isolation). Re-run that adb
// command after reconnecting the phone/restarting adb.
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
