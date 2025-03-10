<script>
  const { collapsed: initialCollapsed = false } = $props()
  let collapsed = $state(initialCollapsed)

  const links = [
    { name: '书签管理', icon: '📚', url: '/' },
    { name: '标签统计', icon: '🏷️', url: '/tags' },
    { name: '域名分析', icon: '🌐', url: '/domains' },
    { name: '设置', icon: '⚙️', url: '/settings' },
  ]
</script>

<div
  style="order: 1;"
  class="nav-sidebar bg-gradient-to-r from-gray-50 to-gray-100 backdrop-blur-md bg-opacity-30 border-r border-gray-100 shadow-lg shadow-gray-300/10 transition-all duration-300 {collapsed
    ? 'w-16 min-w-[64px]'
    : 'w-60 min-w-[240px]'} p-4 flex flex-col gap-5">
  <button
    class="toggle-btn p-2 hover:bg-gray-50 rounded-full transition-all duration-300 self-start shadow-sm border border-gray-200 bg-white/80"
    onclick={() => (collapsed = !collapsed)}>
    {collapsed ? '➔' : '✕'}
  </button>

  {#if !collapsed}
    <span
      class="logo-text text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text"
      >UTags</span>
  {/if}

  <nav class="nav-links flex flex-col gap-1">
    {#each links as link}
      <a
        href={link.url}
        class="nav-link group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-white/80 hover:shadow-sm transition-all duration-300 border border-transparent hover:border-gray-200">
        <span
          class="icon text-xl transition-transform duration-300 group-hover:scale-110"
          >{link.icon}</span>
        {#if !collapsed}
          <span class="text-sm font-medium group-hover:text-blue-600"
            >{link.name}</span>
        {/if}
      </a>
    {/each}
  </nav>
</div>
