import { persisted } from 'svelte-persisted-store'

export const settings = persisted('utags-settings', {
  sortBy: 'updated',
  sidebarPosition: 'left',
  viewMode: 'compact',
  isFirstRun: true,
})
