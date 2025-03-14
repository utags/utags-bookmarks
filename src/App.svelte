<script>
  import { persisted } from 'svelte-persisted-store'
  import { fade } from 'svelte/transition'
  import AddBookmark from './components/AddBookmark.svelte'
  import BookmarkList from './components/BookmarkList.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import NavSidebar from './components/NavSidebar.svelte'
  import SavedFilters from './components/SavedFilters.svelte'

  // 初始化书签存储
  const bookmarks = persisted('utags-bookmarks', {
    data: {},
    meta: {
      databaseVersion: 3,
    },
  })
  const settings = persisted('utags-settings', {
    sortBy: 'updated',
    showTags: true,
    showDomains: true,
    sidebarPosition: 'right',
    viewMode: 'compact',
    isFirstRun: true,
  })

  $effect(() => {
    if ($settings.viewMode === 'card') {
      alert('card 模式即将上线，敬请期待！')
      $settings.viewMode = 'list'
    }
  })

  // 首次访问检测并添加示例数据
  if (Object.keys($bookmarks.data).length === 0 && $settings.isFirstRun) {
    $settings.isFirstRun = false
    $bookmarks.data = {
      'https://greasyfork.org/scripts/460718': {
        meta: {
          title: 'Userscript - 🏷️ 小鱼标签 (UTags) - 为链接添加用户标签',
          created: Date.now(),
          updated: Date.now(),
        },
        tags: ['开源项目', 'Tools', '油猴脚本', 'userscript'],
      },
      'https://chromewebstore.google.com/detail/utags-add-usertags-to-lin/kofjcnaphffjoookgahgjidofbdplgig':
        {
          meta: {
            title: 'Chrome extension - UTags - Add usertags to links',
            created: Date.now() - 1000 - Math.floor(Math.random() * 3600000),
            updated: Date.now() - 1000,
          },
          tags: ['chrome', '浏览器扩展', 'Tools', '开源项目'],
        },
      'https://microsoftedge.microsoft.com/addons/detail/utags-add-usertags-to-l/bhlbflbehfoccjjenpekilgabbjjnphe':
        {
          meta: {
            title: 'Edge extension - UTags - Add usertags to links',
            created: Date.now() - 2000 - Math.floor(Math.random() * 3600000),
            updated: Date.now() - 2000,
          },
          tags: ['edge', '浏览器扩展', 'Productivity', 'Tools', '开源项目'],
        },
      'https://addons.mozilla.org/firefox/addon/utags/': {
        meta: {
          title: 'Firefox extension - UTags - Add usertags to links',
          created: Date.now() - 3000 - Math.floor(Math.random() * 3600000),
          updated: Date.now() - 3000,
        },
        tags: ['firefox', '浏览器扩展', '开源项目', 'Tools', 'Bookmarks'],
      },
      'https://github.com/utags/utags': {
        meta: {
          title:
            'GitHub - utags/utags: 🏷️ 小鱼标签 (UTags) - 为链接添加用户标签',
          created: Date.now() - 4000 - Math.floor(Math.random() * 3600000),
          updated: Date.now() - 4000,
        },
        tags: ['开源项目', '浏览器扩展', '油猴脚本', 'userscript'],
      },
    }
    bookmarks.set($bookmarks)
  }

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
  const maxBookmarksPerPage = 100
  let fullList = $state(false)

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
    fullList = false
    scrollTop = 0

    setTimeout(() => {
      document.querySelector('.bookmark-list').scrollTo(0, scrollTop)
      document.querySelector('.bookmark-list > *').scrollTo(0, scrollTop)
      document.querySelector('.aside-area aside:last-of-type').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: $settings.sidebarPosition === 'right' ? 'end' : 'start',
      })
    }, 10)
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
      const event = new CustomEvent('clearAll')
      window.dispatchEvent(event)
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

    <SavedFilters />

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
      class="toolbar mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
          onclick={importData}>
          导入
        </button>
        <button
          class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
          onclick={exportData}>导出</button>
        <button
          class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
          onclick={clearAll}>清空</button>
        <button
          class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
          onclick={() => (showAddModal = true)}>+ 添加</button>
        <button
          class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
          onclick={toggleView}>切换侧边栏位置</button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700">排序方式: </span>
        <div class="flex gap-1 rounded-md bg-gray-100 p-1">
          <label
            class="cursor-pointer rounded-md px-3 py-1.5 transition-colors {sortBy ===
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
            class="cursor-pointer rounded-md px-3 py-1.5 transition-colors {sortBy ===
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

      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700">视图模式: </span>
        <select
          class="rounded-md bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          bind:value={$settings.viewMode}>
          <option value="list">列表视图</option>
          <option value="compact">紧凑视图</option>
          <option value="card">卡片视图</option>
        </select>
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

    <div class="mb-3 flex gap-4 bg-white px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="flex items-center text-lg text-blue-500">🔖</span>
        <div class="flex flex-col justify-center">
          <span class="text-xs font-medium text-gray-500">书签总数</span>
          <span class="text-xl font-semibold text-gray-900">
            {stats.totalBookmarks}</span>
        </div>
      </div>
      <div class="my-auto h-full w-px self-stretch bg-gray-200"></div>
      <div class="flex items-center gap-2">
        <span class="flex items-center text-lg text-green-500">🏷️</span>
        <div class="flex flex-col justify-center">
          <span class="text-xs font-medium text-gray-500">使用标签</span>
          <span class="text-xl font-semibold text-gray-900">
            {stats.selectedTagsCount}</span>
        </div>
      </div>
      <div class="my-auto h-full w-px self-stretch bg-gray-200"></div>
      <div class="flex items-center gap-2">
        <span class="flex items-center text-lg text-purple-500">🌐</span>
        <div class="flex flex-col justify-center">
          <span class="text-xs font-medium text-gray-500">来源域名</span>
          <span class="text-xl font-semibold text-gray-900">
            {stats.selectedDomainsCount}</span>
        </div>
      </div>
    </div>

    <div class="bookmark-list shadow-lg">
      <BookmarkList
        filteredBookmarks={fullList
          ? filteredBookmarks
          : filteredBookmarks.slice(0, maxBookmarksPerPage)}
        viewMode={$settings.viewMode}
        bind:scrollTop />
      {#if filteredBookmarks.length > maxBookmarksPerPage && !fullList}
        <div
          class="mt-4 flex items-center justify-center border-t-1 border-gray-200 bg-white/90 p-4 shadow-sm">
          <div class="text-center">
            <span class="text-sm leading-relaxed text-gray-600">
              当前已加载前 100 个书签🔖 <br />
              <span class="text-xs text-gray-500"
                >若您想查看全部书签，请点击‘展开所有’按钮</span>
            </span>
          </div>
          <button
            class="ml-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
            onclick={() => {
              fullList = true
              scrollTop = document.querySelector('.bookmark-list').scrollTop
            }}>
            展开所有
          </button>
        </div>
      {/if}
    </div>

    <AddBookmark bind:show={showAddModal} />
  </div>
</main>

<style>
  :root {
    --seperator-line: 1px solid #eee;
    --container-justify-content: flex-end;
    --vertical-seperator-line-order: 0;
    --aside-area-order: 0;
    --aside-area-flex-direction: row-reverse;
    --aside-area-margin-left: 0px;
    --aside-area-margin-right: -20px;
    --sidebar-border-right: var(--seperator-line);
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
    --sidebar-border-left: var(--seperator-line);
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
    border-left: var(--seperator-line);
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

  .bookmark-list {
    height: calc(100vh - 198px);
    overflow-y: auto;
  }
</style>
