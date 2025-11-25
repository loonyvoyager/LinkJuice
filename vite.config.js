import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["link-juice-app-g24km.ondigitalocean.app"]
  },
  preview: {
    allowedHosts: ["link-juice-app-g24km.ondigitalocean.app"]
  }
})