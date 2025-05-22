import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      // Proxy for the Naming Server
      '/api-naming-server': {
        target: 'http://localhost:8083', // Spring Naming Server inside container
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-naming-server/, ''),
      },
      // For other nodes, we need a separate proxy that takes the full URL in the path.
      // This is a bit of a hack, but works if the backend can't be changed for CORS.
      '/proxy-node-direct': {
        target: 'http://127.0.0.1', // Dummy target
        changeOrigin: true,
        rewrite: (path) => {
          // Path will be like '/proxy-node-direct/http://172.19.0.1:8082/node/count'
          const actualUrl = path.replace(/^\/proxy-node-direct\//, '');
          console.log(`Proxying direct node call to: ${actualUrl}`);
          return actualUrl; // This will become the new URL for the proxy
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const targetUrl = req.url; // This is the actual URL including host and port
            const { protocol, hostname, port, pathname, search, hash } = new URL(targetUrl);

            proxyReq.setHeader('Host', `<span class="math-inline">\{hostname\}\:</span>{port}`);
            proxyReq.path = `<span class="math-inline">\{pathname\}</span>{search}${hash}`;
            proxy.target = `<span class="math-inline">\{protocol\}//</span>{hostname}:${port}`; // Dynamically set target
            console.log(`Final proxy target: <span class="math-inline">\{proxy\.target\}</span>{proxyReq.path}`);
          });
        }
      }
    },
  },
});
