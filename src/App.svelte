<script>
  import { persisted } from 'svelte-persisted-store'
  import { fade } from 'svelte/transition'
  import VirtualList from 'svelte-virtual-list'
  import AddBookmark from './components/AddBookmark.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import NavSidebar from './components/NavSidebar.svelte'

  // 初始化书签存储
  const bookmarks = persisted('utags', { data: {} })
  const settings = persisted('ustags-settings', {
    sortBy: 'updated',
    showTags: true,
    showDomains: true,
    sidebarPosition: 'right',
  })
  const originalBookmarks = $derived(Object.entries($bookmarks.data))
  let sortBy = $state('updated')
  let scrollTop = $state(0)
  let showAddModal = $state(false)
  let allTags = $state(new Set())
  let allDomains = $state(new Set())
  let filteredBookmarks1 = $state([])
  let filteredBookmarks2 = $state([])
  let filteredBookmarks3 = $state([])
  let useLevel2 = $derived(
    filteredBookmarks1.length &&
      filteredBookmarks1.length !== originalBookmarks.length
  )
  let useLevel3 = $derived(
    filteredBookmarks2.length &&
      filteredBookmarks2.length !== filteredBookmarks1.length
  )
  let timeoutId
  let filteredBookmarks = $state([])

  function updateFilteredBookmarks() {
    console.log('!!! updateFilteredBookmarks')

    const temp = useLevel3
      ? filteredBookmarks3
      : useLevel2
        ? filteredBookmarks2
        : filteredBookmarks1

    if (sortBy) {
      console.log(`sort by:`, sortBy)
      temp.sort((a, b) => {
        const aTime =
          sortBy === 'updated' ? a[1].meta.updated : a[1].meta.created
        const bTime =
          sortBy === 'updated' ? b[1].meta.updated : b[1].meta.created
        return bTime - aTime
      })
    }

    filteredBookmarks = temp

    setTimeout(() => {
      document.querySelector('.bookmark-list > *').scrollTo(0, 0)
      document
        .querySelector('.aside-area aside:last-of-type')
        .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }, 100)
  }

  window.addEventListener('filterUpdated', () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    timeoutId = setTimeout(() => {
      updateFilteredBookmarks()
    }, 100)

    const originalBookmarksLength = originalBookmarks.length
    const filteredBookmarks1Length = filteredBookmarks1.length
    const filteredBookmarks2Length = filteredBookmarks2.length
    const filteredBookmarks3Length = filteredBookmarks3.length

    console.log(
      'filterUpdated',
      originalBookmarksLength,
      filteredBookmarks1Length,
      filteredBookmarks2Length,
      filteredBookmarks3Length
    )

    if (
      filteredBookmarks1Length === 0 ||
      filteredBookmarks1Length === originalBookmarksLength
    ) {
      console.log('clear level 2, level 3')
      filteredBookmarks2 = []
      filteredBookmarks3 = []
    } else if (filteredBookmarks1Length > 0) {
      if (
        filteredBookmarks2Length === 0 ||
        filteredBookmarks2Length === filteredBookmarks1Length
      ) {
        console.log('clear level 3')
        filteredBookmarks3 = []
      }
    }
  })

  const stats = $derived({
    totalBookmarks: filteredBookmarks.length,
    selectedTagsCount: new Set(
      filteredBookmarks.flatMap(([_, entry]) => entry.tags)
    ).size,
    selectedDomainsCount: new Set(
      filteredBookmarks.map(([url, _]) => new URL(url).hostname)
    ).size,
  })

  function clearAll() {
    if (confirm('请确认是否清空所有书签？此操作不可逆，建议先导出备份数据。')) {
      $bookmarks.data = {}
      bookmarks.set($bookmarks)
      // selectedTags = new Set()
      // selectedDomains = new Set()
    }
  }

  function exportData() {
    const dataStr = JSON.stringify($bookmarks)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
    a.href = url
    a.download = `utags-backup-${timestamp}.json`
    a.click()
  }

  // 新增导入状态
  let importProgress = $state({
    current: 0,
    total: 0,
    stats: {
      newBookmarks: 0,
      newDomains: new Set(),
      newTags: new Set(),
    },
  })

  async function importData() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'

    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      try {
        const content = await file.text()
        const data = JSON.parse(content)

        // 初始化进度
        importProgress = {
          current: 0,
          total: Object.keys(data.data).length,
          stats: {
            newBookmarks: 0,
            newDomains: new Set(),
            newTags: new Set(),
          },
        }

        // 分批处理避免阻塞
        const batchSize = 50
        const entries = Object.entries(data.data)

        for (let i = 0; i < entries.length; i += batchSize) {
          const batch = entries.slice(i, i + batchSize)
          batch.forEach(([url, entry]) => {
            if (!$bookmarks.data[url]) {
              importProgress.stats.newBookmarks++

              // 统计新域名
              const domain = new URL(url).hostname
              if (!allDomains.has(domain)) {
                importProgress.stats.newDomains.add(domain)
              }

              // 统计新标签
              entry.tags.forEach((tag) => {
                if (!allTags.has(tag)) {
                  importProgress.stats.newTags.add(tag)
                }
              })
            }
            $bookmarks.data[url] = entry
            importProgress.current++
          })

          // 触发响应式更新
          bookmarks.set($bookmarks)
          await new Promise((resolve) => setTimeout(resolve, 0))
        }

        // 显示统计结果
        alert(`
          导入完成！
          新增书签: ${importProgress.stats.newBookmarks}
          新增标签: ${importProgress.stats.newTags.size}
          新增域名: ${importProgress.stats.newDomains.size}
        `)

        // 重置进度
        importProgress = { current: 0, total: 0, stats: null }
      } catch (error) {
        alert('文件导入失败，请检查文件格式')
      }
    }

    input.click()
  }

  function toggleView() {
    $settings.sidebarPosition =
      $settings.sidebarPosition === 'right' ? 'left' : 'right'
  }
</script>

<main class="container {$settings.sidebarPosition}-sidebar">
  <div class="aside-area">
    <NavSidebar />
    <Sidebar
      name="level1"
      paused={importProgress.total > 0}
      input={originalBookmarks}
      bind:output={filteredBookmarks1}
      bind:allTags
      bind:allDomains />

    {#if useLevel2 && importProgress.total === 0}
      <Sidebar
        name="level2"
        paused={importProgress.total > 0}
        input={filteredBookmarks1}
        bind:output={filteredBookmarks2} />

      {#if useLevel3}
        <Sidebar
          name="level3"
          paused={importProgress.total > 0}
          input={filteredBookmarks2}
          bind:output={filteredBookmarks3} />
      {/if}
    {/if}
  </div>
  <div class="vertical-seperator-line"></div>
  <div class="content-area">
    <div
      class="toolbar flex items-center justify-between mb-6 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
      <div class="flex items-center gap-3">
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
          onclick={importData}>
          导入
        </button>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
          onclick={exportData}>导出</button>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
          onclick={clearAll}>清空</button>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
          onclick={() => (showAddModal = true)}>+ 添加</button>
        <AddBookmark bind:show={showAddModal} />
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
          onclick={toggleView}>切换侧边栏位置</button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700">排序方式：</span>
        <div class="flex bg-gray-100 p-1 rounded-md gap-1">
          <label
            class="px-3 py-1.5 rounded-md transition-colors cursor-pointer {sortBy ===
            'updated'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'}">
            <input
              type="radio"
              name="sort-by"
              value="updated"
              checked={sortBy === 'updated'}
              class="hidden"
              onchange={() => {
                sortBy = 'updated'
                updateFilteredBookmarks()
              }} />
            <span class="text-sm">更新时间</span>
          </label>
          <label
            class="px-3 py-1.5 rounded-md transition-colors cursor-pointer {sortBy ===
            'created'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'}">
            <input
              type="radio"
              name="sort-by"
              value="created"
              checked={sortBy === 'created'}
              class="hidden"
              onchange={() => {
                sortBy = 'created'
                updateFilteredBookmarks()
              }} />
            <span class="text-sm">创建时间</span>
          </label>
        </div>
      </div>
    </div>

    {#if importProgress.total > 0}
      <div class="import-progress" out:fade={{ duration: 1000 }}>
        导入进度: {importProgress.current}/{importProgress.total}
        {#if importProgress.stats}
          <div class="stats">
            新增: {importProgress.stats.newBookmarks}书签・
            {importProgress.stats.newTags.size}标签・
            {importProgress.stats.newDomains.size}域名
            <div class="total-stats">
              总数: {Object.keys($bookmarks.data).length}书签・
              {allTags.size}标签・{allDomains.size}域名
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <div class="flex gap-4 mb-3 px-4 py-3 bg-white">
      <div class="flex items-center gap-2">
        <span class="text-blue-500 text-lg flex items-center">🔖</span>
        <div class="flex flex-col justify-center">
          <span class="text-xs font-medium text-gray-500">书签总数</span>
          <span class="text-xl font-semibold text-gray-900">
            {stats.totalBookmarks}</span>
        </div>
      </div>
      <div class="h-full w-px bg-gray-200 my-auto self-stretch"></div>
      <div class="flex items-center gap-2">
        <span class="text-green-500 text-lg flex items-center">🏷️</span>
        <div class="flex flex-col justify-center">
          <span class="text-xs font-medium text-gray-500">使用标签</span>
          <span class="text-xl font-semibold text-gray-900">
            {stats.selectedTagsCount}</span>
        </div>
      </div>
      <div class="h-full w-px bg-gray-200 my-auto self-stretch"></div>
      <div class="flex items-center gap-2">
        <span class="text-purple-500 text-lg flex items-center">🌐</span>
        <div class="flex flex-col justify-center">
          <span class="text-xs font-medium text-gray-500">来源域名</span>
          <span class="text-xl font-semibold text-gray-900">
            {stats.selectedDomainsCount}</span>
        </div>
      </div>
    </div>

    <div class="bookmark-list shadow-lg">
      <VirtualList items={filteredBookmarks} bind:scrollTop let:item>
        <div
          class="group relative bg-white p-3 rounded-md transition-colors duration-50 hover:bg-gray-100 ml-[10px] mr-[10px]">
          <div class="flex items-center gap-3">
            <div class="flex-1 min-w-0 space-y-0.5">
              <div class="flex items-center gap-2 truncate">
                <h3
                  class="text-sm text-gray-900 truncate"
                  style="flex: 0 0 50%; min-width: 0;">
                  <a
                    href={item[0]}
                    title={item[1].meta.title || '无标题'}
                    target="_blank"
                    class="flex items-center gap-1 flex-nowrap"
                    style="flex-shrink:0; min-width:0">
                    <img
                      src={import.meta.env.MODE === 'development'
                        ? '/favicon.ico'
                        : `https://www.google.com/s2/favicons?domain=${new URL(item[0]).hostname}`}
                      class="w-4 h-4 flex-none"
                      alt="favicon" />
                    <span class="truncate" style="min-width:0"
                      >{item[1].meta.title || '无标题'}</span>
                  </a>
                </h3>

                <a
                  href={item[0]}
                  title={item[0]}
                  target="_blank"
                  class="text-xs text-gray-800 hover:text-gray-800 truncate pt-0.5">
                  {item[0].replace(/^https:\/\//, '')}
                </a>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                {#each item[1].tags as tag}
                  <span
                    class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-sm border border-gray-200 bg-gray-50 text-gray-700 gap-1">
                    <span class="font-normal tracking-tight">{tag}</span>
                  </span>
                {/each}
              </div>
            </div>
            <div class="top-3 right-3 text-right">
              <span class="text-xs text-gray-500 font-mono tracking-tight">
                {#if item[1].meta.created === item[1].meta.updated}
                  <div class="flex flex-col gap-0.5 items-end">
                    <span title="创建时间/更新时间"
                      >{new Date(item[1].meta.updated).toLocaleString('zh-CN', {
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}</span>
                  </div>
                {:else}
                  <div class="flex flex-col gap-0.5 items-end justify-end">
                    <span title="更新时间"
                      >{new Date(item[1].meta.updated).toLocaleString('zh-CN', {
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}</span>
                    <span title="创建时间"
                      >{new Date(item[1].meta.created).toLocaleString('zh-CN', {
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}</span>
                  </div>
                {/if}
              </span>
            </div>
          </div>
        </div></VirtualList>
    </div>
  </div>
</main>

<style>
  :root {
    --container-justify-content: flex-end;
    --vertical-seperator-line-order: 0;
    --aside-area-order: 0;
    --aside-area-flex-direction: row-reverse;
    --aside-area-margin-left: 0px;
    --aside-area-margin-right: -20px;
    --sidebar-border-right: 1px solid #eee;
    --sidebar-border-left: none;
    --sidebar-padding-left: 0px;
    --sidebar-padding-right: 20px;
  }

  .right-sidebar {
    --container-justify-content: flex-start;
    --vertical-seperator-line-order: 1;
    --aside-area-order: 2;
    --aside-area-flex-direction: row;
    --aside-area-margin-left: -20px;
    --aside-area-margin-right: 0px;
    --sidebar-border-right: none;
    --sidebar-border-left: 1px solid #eee;
    --sidebar-padding-left: 20px;
    --sidebar-padding-right: 0px;
  }

  .container {
    display: flex;
    justify-content: var(--container-justify-content);
    gap: 20px;
    max-width: min(calc(100vw - 100px), 1842px);
    height: 100vh;
    margin: 0 auto;
    padding: 20px 20px 0;
    overflow: hidden;
  }

  .aside-area {
    overflow-x: auto;
    display: flex;
    flex-direction: var(--aside-area-flex-direction);
    gap: 20px;
    order: var(--aside-area-order);
    margin-left: var(--aside-area-margin-left);
    margin-right: var(--aside-area-margin-right);
  }

  .vertical-seperator-line {
    width: 0px;
    height: calc(100% - 20px);
    border-right: none;
    border-left: 1px solid #eee;
    box-shadow: 0px -15px 15px 15px white;
    display: block;
    z-index: 2;
    order: var(--vertical-seperator-line-order);
  }

  .content-area {
    flex: 1;
    max-width: 900px;
    min-width: 900px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
  }

  .toolbar .left-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .toolbar .sort-controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .bookmark-list {
    height: calc(100vh - 195px);
    overflow-y: auto;
  }

  button.primary {
    background: #0066cc;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
