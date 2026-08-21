import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // 允許同個局域網 (WiFi) 的手機連線
    port: 5173
  }
});
