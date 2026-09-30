import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// import.meta.env isn't available here: the config is evaluated before Vite loads
// .env files, so read them with loadEnv. The '' prefix loads every variable, not
// only VITE_* ones (those are still the only ones exposed to client code).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const allowedHosts = (env.ALLOWED_HOSTS || 'localhost')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);
  const port = Number(env.HOST_PORT) || 5173;
  // Where /api/* is forwarded in dev. Inside the Docker container "localhost" is the
  // container itself, so docker-compose.yml sets this to http://host.docker.internal:8000.
  const apiProxyTarget = env.API_PROXY_TARGET || 'http://localhost:8000';

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: true,
      allowedHosts,
      // http://localhost:5173/api/* -> {apiProxyTarget}/api/* (path kept: every myPay
      // route already starts with /api). Same-origin for the browser, so no CORS and it
      // also works through a tunnel (ngrok) without exposing the API separately.
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          // Rewrite redirect Location headers (e.g. /api/doc -> /api/doc/) back to the
          // dev server's host, instead of the internal proxy target.
          autoRewrite: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  };
});
