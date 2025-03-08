<script>
  import { persisted } from 'svelte-persisted-store'
  import VirtualList from 'svelte-virtual-list'
  import AddBookmark from './AddBookmark.svelte'

  // 初始化书签存储
  const bookmarks = persisted('utags', { data: {} })
  let sortBy = 'updated'
  let searchKeyword = ''
  let showAddModal = false
  let selectedTags = new Set()
  let selectedDomains = new Set()

  $: allTags = new Set(
    Object.values($bookmarks.data).flatMap((entry) => entry.tags)
  )

  $: allDomains = new Set(
    Object.keys($bookmarks.data).map((url) => new URL(url).hostname)
  )

  $: filteredBookmarks = Object.entries($bookmarks.data)
    .filter(([url, entry]) => {
      const lowerKeyword = searchKeyword.trim().toLowerCase()
      const hasKeyword =
        lowerKeyword === '' ||
        url.toLowerCase().includes(lowerKeyword) ||
        entry.meta.title?.toLowerCase().includes(lowerKeyword) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))

      const hasAllTags =
        selectedTags.size === 0 ||
        (selectedTags.size > 0 &&
          entry.tags.some((tag) => selectedTags.has(tag)))

      const hasDomain =
        selectedDomains.size === 0 || selectedDomains.has(new URL(url).hostname)

      return hasKeyword && hasAllTags && hasDomain
    })
    .sort((a, b) => {
      const aTime = sortBy === 'updated' ? a[1].meta.updated : a[1].meta.created
      const bTime = sortBy === 'updated' ? b[1].meta.updated : b[1].meta.created
      return bTime - aTime
    })

  function toggleTag(tag) {
    selectedTags = selectedTags.has(tag)
      ? new Set([...selectedTags].filter((t) => t !== tag))
      : new Set([...selectedTags, tag])
  }

  function toggleDomain(domain) {
    selectedDomains = selectedDomains.has(domain)
      ? new Set([...selectedDomains].filter((d) => d !== domain))
      : new Set([...selectedDomains, domain])
  }
  let scrollTop = 0

  function clearAll() {
    if (confirm('请确认是否清空所有书签？此操作不可逆，建议先导出备份数据。')) {
      $bookmarks.data = {}
      bookmarks.set($bookmarks)
      selectedTags = new Set()
      selectedDomains = new Set()
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
  let importProgress = {
    current: 0,
    total: 0,
    stats: {
      newBookmarks: 0,
      newDomains: new Set(),
      newTags: new Set(),
    },
  }

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
  <aside class="sidebar">
    <div class="search-box">
      <input
        type="text"
        placeholder="搜索 URL/标题/标签..."
        bind:value={searchKeyword} />
    </div>

    <div class="filter-controls">
      <div class="filter-group">
        <h4>标签筛选：</h4>
        {#each Array.from(allTags) as tag}
          <label class="filter-tag">
            <input
              type="checkbox"
              checked={selectedTags.has(tag)}
              on:change={() => {
                toggleTag(tag)
                selectedTags = selectedTags // 触发响应式更新
              }} />
            {tag}
          </label>
        {/each}
      </div>

      <div class="filter-group">
        <h4>域名筛选：</h4>
        {#each Array.from(allDomains) as domain}
          <label class="filter-domain">
            <input
              type="checkbox"
              checked={selectedDomains.has(domain)}
              on:change={() => {
                toggleDomain(domain)
                selectedDomains = selectedDomains // 触发响应式更新
              }} />
            {domain}
          </label>
        {/each}
      </div>
    </div>
    <div class="filter-controls">
      <div class="filter-group">
        <h4>标签筛选：</h4>
        {#each Array.from(allTags) as tag}
          <label class="filter-tag">
            <input
              type="checkbox"
              checked={selectedTags.has(tag)}
              on:change={() => {
                toggleTag(tag)
                selectedTags = selectedTags
              }} />
            {tag}
          </label>
        {/each}
      </div>

      <div class="filter-group">
        <h4>域名筛选：</h4>
        {#each Array.from(allDomains) as domain}
          <label class="filter-domain">
            <input
              type="checkbox"
              checked={selectedDomains.has(domain)}
              on:change={() => {
                toggleDomain(domain)
                selectedDomains = selectedDomains
              }} />
            {domain}
          </label>
        {/each}
      </div>
    </div>
  </aside>

  <div class="content-area">
    <div class="toolbar">
      <button class="primary" on:click={importData}>导入</button>
      <button class="primary" on:click={exportData}>导出</button>
      <button class="primary" on:click={clearAll}>清空</button>
      <button class="primary" on:click={() => (showAddModal = true)}
        >+ 添加</button>
      <AddBookmark bind:show={showAddModal} />
    </div>

    <div class="list-header">
      <span>图标</span>
      <span>标题</span>
      <span>URL</span>
      <span>标签</span>
      <span>更新时间</span>
    </div>

    <div class="bookmark-list">
      <VirtualList items={filteredBookmarks} bind:scrollTop let:item>
        <div class="bookmark-item">
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(item[0]).hostname}`}
            alt="favicon"
            class="favicon" />
          <span class="title">{item[1].meta.title || '无标题'}</span>
          <a href={item[0]} target="_blank" class="url"
            >{new URL(item[0]).hostname}</a>
          <div class="tags">
            {#each item[1].tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
          <span class="updated">
            {new Date(item[1].meta.updated).toLocaleDateString()}
          </span>
        </div>
      </VirtualList>
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
      <button
        class="sort-btn {sortBy === 'updated' ? 'active' : ''}"
        on:click={() => (sortBy = 'updated')}>
        按更新时间排序
      </button>
      <button
        class="sort-btn {sortBy === 'created' ? 'active' : ''}"
        on:click={() => (sortBy = 'created')}>
        按创建时间排序
      </button>
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
    height: calc(100vh - 60px);
  }

  .sidebar {
    width: 280px;
    min-width: 280px;
    border-right: 1px solid #eee;
    padding-right: 20px;
    overflow-y: auto;
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

  .list-header {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr 2fr 1fr;
    font-weight: bold;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .bookmark-list {
    height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .bookmark-item {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr 2fr 1fr;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .favicon {
    width: 16px;
    height: 16px;
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
