<script>
  const { collapsed: initialCollapsed = false } = $props()
  let collapsed = $state(initialCollapsed)

  const links = [
    { name: '这里不知道如何设计好了', icon: '💡', url: '/' },
    { name: '暂时先这么放着', icon: '⏳', url: '/' },
    {
      name: '欢迎给出您的建议',
      icon: '🙏',
      url: 'https://github.com/utags/utags/issues',
    },
    { name: '书签管理', icon: '📚', url: '/' },
    { name: '标签统计', icon: '🏷️', url: '/' },
    { name: '域名分析', icon: '🌐', url: '/' },
    { name: '设置', icon: '⚙️', url: '/' },
    {
      name: '问题反馈',
      icon: '🙏',
      url: 'https://github.com/utags/utags/issues',
    },
  ]

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      try {
        const content = await file.text()
        // bookmarkStore.importBookmarks(JSON.parse(content));
      } catch (error) {
        console.error('导入失败:', error)
      }
    }
    input.click()
  }

  const handleExport = () => {
    // const data = bookmarkStore.exportBookmarks();
    // const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `utags-backup-${new Date().toISOString().slice(0,10)}.json`;
    // a.click();
    // URL.revokeObjectURL(url);
  }

  const handleClear = () => {
    if (window.confirm('确定要清空所有书签数据吗？此操作不可恢复！')) {
      // bookmarkStore.clearAll();
    }
  }
</script>

<div
  style="order: 2;"
  class="nav-sidebar bg-opacity-95 border-r border-gray-200/50 bg-gradient-to-r from-white/70 to-gray-50/50 shadow-sm transition-all duration-300 {collapsed
    ? 'w-16 min-w-[64px]'
    : 'w-60 min-w-[240px]'} flex flex-col gap-4 p-3">
  <button
    class="toggle-btn self-start rounded-xl border border-gray-200/70 bg-white/90 p-2 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-md"
    onclick={() => (collapsed = !collapsed)}>
    {collapsed ? '➔' : '✕'}
  </button>

  {#if !collapsed}
    <span
      class="logo-text bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-xl font-bold text-transparent"
      >UTags</span>
  {/if}

  <nav class="nav-links flex flex-col gap-2">
    {#each links as link}
      <a
        href={link.url}
        class="nav-link group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-gray-600 transition-all duration-200 hover:border-gray-200/50 hover:bg-white/90 hover:shadow-xs">
        <span
          class="icon text-xl transition-transform duration-200 group-hover:scale-[1.15]"
          >{link.icon}</span>
        {#if !collapsed}
          <span class="text-sm font-medium group-hover:text-blue-600"
            >{link.name}</span>
        {/if}
      </a>
    {/each}
  </nav>

  {#each [{ name: '导入书签', icon: '📥', handler: handleImport }, { name: '导出书签', icon: '📤', handler: handleExport }, { name: '清空书签', icon: '🗑️', handler: handleClear }] as btn}
    <button
      onclick={btn.handler}
      class="nav-link group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-gray-600 transition-all duration-200 hover:border-gray-200/50 hover:bg-white/90 hover:shadow-xs">
      <span
        class="icon text-xl transition-transform duration-200 group-hover:scale-[1.15]"
        >{btn.icon}</span>
      {#if !collapsed}
        <span class="text-sm font-medium group-hover:text-blue-600"
          >{btn.name}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .nav-sidebar {
    width: 100%;
  }
</style>
