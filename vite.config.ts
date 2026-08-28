import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The app is a browser-only SPA, so every LLM request is issued from the page.
 * The dev server proxies those requests to an OpenAI-compatible gateway (One API
 * or equivalent), which avoids CORS and keeps the gateway host out of the bundle.
 * Set VITE_GATEWAY_BASE_URL to point at your own gateway.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const gatewayBaseUrl = env.VITE_GATEWAY_BASE_URL || 'https://api.anthropic.com';
  const requestTimeout = 1_200_000;

  return {
    server: {
      port: 3000,
      proxy: {
        '/api/oneapi': {
          target: gatewayBaseUrl,
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api\/oneapi/, ''),
          timeout: requestTimeout,
          proxyTimeout: requestTimeout,
          configure: (proxy: { on: Function }) => {
            proxy.on('proxyReq', (proxyReq: any, req: any) => {
              const auth = req.headers['authorization'];
              if (auth) {
                proxyReq.setHeader('Authorization', auth);
              }
            });
          },
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
