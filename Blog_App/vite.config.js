  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // https://vitejs.dev/config/
  export default defineConfig({
    hmr:true,
    plugins: [
      react(),
    ],
    server : {
      host: '127.0.0.1'
    }
  })
