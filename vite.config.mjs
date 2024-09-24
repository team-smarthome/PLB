import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// Ensure you're using `import` syntax
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    viteTsconfigPaths()
  ],
  server: {
    open: true,
    port: 3000,
  },
})
