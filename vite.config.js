import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'modules/y0f-terminal/public/*',
          dest: '.',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@y0f/terminal': path.resolve(__dirname, './modules/y0f-terminal/src/index.ts'),
    },
  },
  publicDir: 'public',
  // Copy terminal package assets to dist
  assetsInclude: ['**/*.webp', '**/*.gif'],
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons'
            }
            if (id.includes('keen-slider')) {
              return 'vendor-slider'
            }
            return 'vendor-other'
          }
          if (id.includes('/games/')) {
            return 'games'
          }
          if (id.includes('/terminal/')) {
            return 'terminal'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['js-dos'],
  },
})
