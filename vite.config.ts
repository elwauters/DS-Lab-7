// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000, // Make sure your Vue dev server runs on this port inside the container
    proxy: {
      // Proxy for the Naming Server
      // Requests to '/g2c1/...' will be forwarded to 'http://localhost:8083/...'
      '/g2c1': {
        target: 'http://172.19.0.6:8083', // This points to your Spring Naming Server inside the container
        changeOrigin: true, // Necessary for proper host header rewriting
        rewrite: (path) => path.replace(/^\/g2c1/, ''), // Removes the prefix
      },

      '/g2c2': {
        target: 'http://172.19.0.4:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/g2c2/, ''),
      },

      '/g2c3': {
        target: 'http://172.19.0.5:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/g2c3/, ''),
      },

      '/g2c4': {
        target: 'http://172.19.0.2:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/g2c4/, ''),
      },

      '/g2c5': {
        target: 'http://172.19.0.3:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/g2c5/, ''),
      },
    }
  },
})
