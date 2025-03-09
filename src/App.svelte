<script>
  import { persisted } from 'svelte-persisted-store'
  import VirtualList from 'svelte-virtual-list'
  import AddBookmark from './AddBookmark.svelte'
  import Sidebar from './components/Sidebar.svelte'

  // 初始化书签存储
  const bookmarks = persisted('utags', { data: {} })
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

  function getTagColor(tag) {
    const hue =
      Array.from(tag).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 50%)`
  }

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
          新增域名: ${importProgress.stats.newDomains.size}
          新增标签: ${importProgress.stats.newTags.size}
        `)

        // 重置进度
        importProgress = { current: 0, total: 0, stats: null }
      } catch (error) {
        alert('文件导入失败，请检查文件格式')
      }
    }

    input.click()
  }
</script>

<main class="container">
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

  <div class="content-area">
    <div class="toolbar">
      <button class="primary" onclick={importData}>导入</button>
      <button class="primary" onclick={exportData}>导出</button>
      <button class="primary" onclick={clearAll}>清空</button>
      <button class="primary" onclick={() => (showAddModal = true)}
        >+ 添加</button>
      <AddBookmark bind:show={showAddModal} />
    </div>

    {#if importProgress.total > 0}
      <div class="import-progress">
        导入进度: {importProgress.current}/{importProgress.total}
        {#if importProgress.stats}
          <div class="stats">
            新增: {importProgress.stats.newBookmarks}书签・
            {importProgress.stats.newDomains.size}域名・
            {importProgress.stats.newTags.size}标签
            <div class="total-stats">
              总数: {Object.keys($bookmarks.data).length}书签・
              {allTags.size}标签・{allDomains.size}域名
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <div class="sort-controls">
      <div class="stats-display">
        <span class="stat-item">🔖 {stats.totalBookmarks}</span>
        <span class="stat-item">🏷️ {stats.selectedTagsCount}</span>
        <span class="stat-item">🌐 {stats.selectedDomainsCount}</span>
      </div>
      <label class="radio-option {sortBy === 'updated' ? 'active' : ''}">
        <input
          type="radio"
          name="sort-by"
          value="updated"
          checked={sortBy === 'updated'}
          onchange={() => {
            sortBy = 'updated'
            updateFilteredBookmarks()
          }} />
        按更新时间排序
      </label>
      <label class="radio-option {sortBy === 'created' ? 'active' : ''}">
        <input
          type="radio"
          name="sort-by"
          value="created"
          checked={sortBy === 'created'}
          onchange={() => {
            sortBy = 'created'
            updateFilteredBookmarks()
          }} />
        按创建时间排序
      </label>
    </div>

    <div class="bookmark-list">
      <VirtualList items={filteredBookmarks} bind:scrollTop let:item>
        <div
          class="group relative bg-white/80 backdrop-blur-sm rounded-md p-2 shadow-sm hover:shadow transition-all duration-200 border border-gray-100 hover:-translate-y-0">
          <div class="flex items-start gap-2">
            <img
              src={import.meta.env.MODE === 'development'
                ? '/favicon.ico'
                : `https://www.google.com/s2/favicons?domain=${new URL(item[0]).hostname}`}
              class="w-4 h-4 mt-1 flex-none"
              alt="favicon" />
            <div class="flex-1 min-w-0 space-y-0.5">
              <div class="flex items-baseline gap-2 truncate">
                <h3 class="text-sm text-gray-900 truncate">
                  <a
                    href={item[0]}
                    title={item[1].meta.title || '无标题'}
                    target="_blank"
                    class="hover:text-blue-600">
                    {item[1].meta.title || '无标题'}
                  </a>
                </h3>
                <span class="text-gray-400 text-xs">|</span>
                <a
                  href={item[0]}
                  title={item[0]}
                  target="_blank"
                  class="text-xs text-blue-600 hover:text-blue-800 truncate">
                  {new URL(item[0]).hostname}
                </a>
              </div>
              <div class="mt-1 flex flex-wrap gap-1">
                {#each item[1].tags as tag}
                  <span
                    class="flex items-center px-1 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 leading-none">
                    <span
                      class="w-1.5 h-1.5 rounded-full mr-1"
                      class:bg-{tag}-500={tag}
                      style="background-color: {getTagColor(tag)}"></span>
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
            <span
              class="text-[11px] text-gray-500 absolute top-1 right-0 pr-1 text-right">
              {#if item[1].meta.created === item[1].meta.updated}
                <div class="flex flex-col gap-0.5 items-end justify-end">
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
      </VirtualList>
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    height: calc(100vh - 0px);
  }

  .content-area {
    flex: 1;
    min-width: 0;
  }

  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .bookmark-list {
    height: calc(100vh - 150px);
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

  .radio-option {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 8px;
    transition: all 0.2s;
  }

  .radio-option input {
    margin-right: 6px;
  }

  .radio-option.active {
    background: #0066cc;
    color: white;
    border-color: #0066cc;
  }

  .stats-display {
    display: flex;
    gap: 20px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: #f5f5f5;
    border-radius: 16px;
  }
</style>
