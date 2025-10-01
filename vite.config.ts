import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
