import { svelte } from '@sveltejs/vite-plugin-svelte'

export default {
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
