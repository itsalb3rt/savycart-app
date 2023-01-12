import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'assets': path.resolve(__dirname, './src/assets'),
      'tests': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    environment: 'happy-dom'
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VuetifyResolver()],
    })
  ],
  css: {
    // https://vitejs.dev/config/#css-preprocessoroptions
    preprocessorOptions: {
      sass: {
        additionalData: [
        ]
      },
    },
  },
})