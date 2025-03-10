<script>
  let {
    name,
    input,
    output = $bindable(),
    allTags = $bindable(),
    allDomains = $bindable(),
    paused,
  } = $props()

  // 筛选相关状态
  let searchKeyword = $state('')
  let selectedTags = $state(new Set())
  let selectedDomains = $state(new Set())
  let tagCounts = $state()
  let domainCounts = $state()

  // 监听 input 变化并更新 allTags 和 allDomains
  $effect(() => {
    console.log(`[${name}] init`)
    allTags = new Set(input.flatMap((entry) => entry[1].tags))
    allDomains = new Set(input.map((entry) => new URL(entry[0]).hostname))

    searchKeyword = ''
    selectedTags = new Set()
    selectedDomains = new Set()

    tagCounts = new Map(
      input
        .flatMap((entry) => entry[1].tags)
        .reduce((acc, tag) => {
          acc.set(tag, (acc.get(tag) || 0) + 1)
          return acc
        }, new Map())
    )

    domainCounts = new Map(
      input
        .map((entry) => new URL(entry[0]).hostname)
        .reduce((acc, domain) => {
          acc.set(domain, (acc.get(domain) || 0) + 1)
          return acc
        }, new Map())
    )
  })

  // 监听筛选条件变化并更新 output
  $effect(() => {
    if (paused) {
      console.log(`[${name}] paused`)
      return
    }
    console.log(
      `[${name}] current filter:`,
      `'${searchKeyword}'`,
      selectedTags,
      selectedDomains
    )

    if (searchKeyword || selectedTags.size || selectedDomains.size) {
      console.log(`=> [${name}] apply filter`)
      output = input.filter(([url, entry]) => {
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
          selectedDomains.size === 0 ||
          selectedDomains.has(new URL(url).hostname)

        return hasKeyword && hasAllTags && hasDomain
      })
    } else {
      output = [...input]
    }

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('filterUpdated'))
    }, 5)
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
    {#if allTags && allTags.size}
      <div class="filter-group">
        <h4>标签筛选：</h4>
        {#each Array.from(allTags).sort((a, b) => tagCounts.get(b) - tagCounts.get(a)) as tag}
          <label class="filter-tag text-sm">
            <input
              type="checkbox"
              checked={selectedTags.has(tag)}
              onchange={() => {
                toggleTag(tag)
                selectedTags = selectedTags
              }} />
            {tag}（{tagCounts.get(tag) || 0}）
          </label>
        {/each}
      </div>
    {/if}

    {#if allDomains && allDomains.size}
      <div class="filter-group">
        <h4>域名筛选：</h4>
        {#each Array.from(allDomains).sort((a, b) => domainCounts.get(b) - domainCounts.get(a)) as domain}
          <label class="filter-domain text-sm">
            <input
              type="checkbox"
              checked={selectedDomains.has(domain)}
              onchange={() => {
                toggleDomain(domain)
                selectedDomains = selectedDomains
              }} />
            {domain}（{domainCounts.get(domain) || 0}）
          </label>
        {/each}
      </div>
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    width: 280px;
    min-width: 280px;
    border-left: 1px solid #eee;
    padding-left: 20px;
    margin-bottom: 20px;
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
