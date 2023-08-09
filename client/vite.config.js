import { defineConfig } from 'vite';

const host = 'localhost',
  PORT = 3000;
const openUrl = (port = PORT) => `http://localhost:${port}`;

export default defineConfig(({}) => {
  return {
    server: {
      host,
      port: +PORT,
      open: openUrl(),
    },
    preview: {
      host,
      port: +PORT + 1,
      open: host === 'localhost' ? openUrl(+PORT + 1) : false,
    },
    build: {
      outDir: 'build',
    },
  };
});
