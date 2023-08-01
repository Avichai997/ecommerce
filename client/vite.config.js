import { defineConfig } from 'vite';
import { join } from 'path';

const host = 'localhost',
  PORT = 3000;
const openUrl = (port = PORT) => `http://localhost:${port}`;

export default defineConfig(({}) => {
  return {
    // define: {
    //   'process.env.NODE_ENV': JSON.stringify(mode),
    // },
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
      rollupOptions: {
        output: {
          // Disable time stamping (hash) in the output file names
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@public': join(__dirname, 'public'),
        '@Assets': join(__dirname, 'src/Assets'),
        '@Components': join(__dirname, 'src/Components'),
        '@ApiService': join(__dirname, 'src/ApiService'),
        '@Interfaces': join(__dirname, 'src/ApiService/Interfaces'),
        '@RequestApi': join(__dirname, 'src/ApiService/RequestApi'),
        '@Tests': join(__dirname, 'src/ApiService/Tests'),
        '@Hooks': join(__dirname, 'src/Hooks'),
        '@Utils': join(__dirname, 'src/Utils'),
        '@Common': join(__dirname, 'src/Common'),
        '@Atoms': join(__dirname, 'src/Atoms'),
        '@CommonComponents': join(__dirname, 'src/Components/Common'),
        '@CommonFunctions': join(__dirname, 'src/Common/CommonFunctions'),
        '@CommonInterfaces': join(__dirname, 'src/Common/CommonInterfaces'),
        '@CommonConstants': join(__dirname, 'src/Common/CommonConstants'),
      },
    },
  };
});
