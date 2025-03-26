import { svelte } from '@sveltejs/vite-plugin-svelte'
import pkg from './package.json'

export default {
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [svelte()],
  optimizeDeps: {
    include: ['svelte-persisted-store', 'svelte-virtual-list'],
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
}
