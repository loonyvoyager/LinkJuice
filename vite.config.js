import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // JSON.stringify needed to ensure the string is inserted as a code literal
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      allowedHosts: ["link-juice-app-g24km.ondigitalocean.app", "localhost"]
    },
    preview: {
      allowedHosts: ["link-juice-app-g24km.ondigitalocean.app", "localhost"]
    }
  }
})