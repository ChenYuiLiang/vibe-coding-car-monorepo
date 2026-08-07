import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [basicSsl()],
  server: {
    host: true, // 允許同個局域網 (WiFi) 的手機連線
    port: 5173
  }
});
