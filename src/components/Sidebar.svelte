<script>
  export let originalBookmarks
  export let filteredBookmarks
  export let allTags
  export let allDomains

  // 筛选相关状态
  let searchKeyword = ''
  let selectedTags = new Set()
  let selectedDomains = new Set()
  let sortBy = 'updated'

  // 计算属性
  $: allTags = new Set(
    Object.values(originalBookmarks).flatMap((entry) => entry.tags)
  )

  $: allDomains = new Set(
    Object.keys(originalBookmarks).map((url) => new URL(url).hostname)
  )

  $: tagCounts = new Map(
    Object.values(originalBookmarks)
      .flatMap((entry) => entry.tags)
      .reduce((acc, tag) => {
        acc.set(tag, (acc.get(tag) || 0) + 1)
        return acc
      }, new Map())
  )

  $: domainCounts = new Map(
    Object.keys(originalBookmarks)
      .map((url) => new URL(url).hostname)
      .reduce((acc, domain) => {
        acc.set(domain, (acc.get(domain) || 0) + 1)
        return acc
      }, new Map())
  )

  $: filteredBookmarks = Object.entries(originalBookmarks)
    .filter(([url, entry]) => {
      const lowerKeyword = searchKeyword.trim().toLowerCase()
      const hasKeyword =
        lowerKeyword === '' ||
        url.toLowerCase().includes(lowerKeyword) ||
        entry.meta.title?.toLowerCase().includes(lowerKeyword) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))

      const hasAllTags =
        selectedTags.size === 0 ||
        entry.tags.some((tag) => selectedTags.has(tag))

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
</script>

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
      {#each Array.from(allTags).sort((a, b) => tagCounts.get(b) - tagCounts.get(a)) as tag}
        <label class="filter-tag text-sm">
          <input
            type="checkbox"
            checked={selectedTags.has(tag)}
            on:change={() => {
              toggleTag(tag)
              selectedTags = selectedTags
            }} />
          {tag}（{tagCounts.get(tag) || 0}）
        </label>
      {/each}
    </div>

    <div class="filter-group">
      <h4>域名筛选：</h4>
      {#each Array.from(allDomains).sort((a, b) => domainCounts.get(b) - domainCounts.get(a)) as domain}
        <label class="filter-domain text-sm">
          <input
            type="checkbox"
            checked={selectedDomains.has(domain)}
            on:change={() => {
              toggleDomain(domain)
              selectedDomains = selectedDomains
            }} />
          {domain}（{domainCounts.get(domain) || 0}）
        </label>
      {/each}
    </div>
  </div>
</aside>

<style>
  .sidebar {
    width: 280px;
    min-width: 280px;
    border-right: 1px solid #eee;
    padding-right: 20px;
    overflow: hidden;
  }

  .search-box {
    height: 24px;
  }

  .filter-group {
    max-height: calc(50vh - 32px);
    overflow-y: auto;
    position: relative;
    margin-bottom: 20px;
  }

  .filter-group h4 {
    position: sticky;
    top: 0;
    background: white;
    padding: 8px 0;
    z-index: 1;
    margin: 0;
  }

  .filter-tag,
  .filter-domain {
    display: flex;
    align-items: center;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 8px;
  }

  .filter-tag input,
  .filter-domain input {
    flex-shrink: 0;
    margin-right: 6px;
  }
</style>
