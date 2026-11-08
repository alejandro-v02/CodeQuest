// Used by `ng serve` / `ionic cap run android -l --external` (development build).
// IMPORTANT: this must be your computer's LAN IP, not "localhost" — the phone
// reaches the backend over the network, not through its own loopback interface.
// Update it if your IP changes (e.g. `ipconfig` on Windows, look for Wi-Fi IPv4).
export const environment = {
  production: false,
  apiUrl: 'http://192.168.18.10:3000',
};
