import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    visualizer({ open: true, filename: 'bundle-analysis.html' })
  ],
  build: {
    sourcemap: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'lodash-es':['lodash-es'],
          'react': ['react'],
          'react-dom': ['react-dom'],
          '@axdspub/axiom-ui-utilities': ['@axdspub/axiom-ui-utilities']
        }
      }
    }
  },
  resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'), 
          '@Components': path.resolve(__dirname, './src/Components'),
          '@Layouts': path.resolve(__dirname, './src/Layouts'),
          '@Pages': path.resolve(__dirname, './src/Pages'),
          '@types': path.resolve(__dirname, './src/types'),
          '@state': path.resolve(__dirname, './src/state'),
          '@services': path.resolve(__dirname, './src/services'),
        },
      },
})
