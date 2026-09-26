import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// import.meta.env isn't available here: the config is evaluated before Vite loads
// .env files, so read them with loadEnv. The '' prefix loads every variable, not
// only VITE_* ones (those are still the only ones exposed to client code).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const allowedHosts = (env.ALLOWED_HOSTS || 'localhost')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)
  const port = Number(env.HOST_PORT) || 5173

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: true,
      allowedHosts,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  }
})
