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
  <div class="flex flex-col gap-2 mb-4">
    <button
      class="self-start px-2 py-1 text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors"
      onclick={() => {
        searchKeyword = ''
        selectedTags = new Set()
        selectedDomains = new Set()
      }}>
      重置筛选
    </button>
    <div class="w-full relative" style="padding-right: 1px;">
      <input
        type="text"
        placeholder="搜索 URL/标题/标签..."
        class="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded-md bg-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        bind:value={searchKeyword} />
      {#if searchKeyword}
        <button
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          onclick={() => (searchKeyword = '')}
          aria-label="清除搜索关键词">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      {/if}
    </div>
  </div>

  <div class="filter-controls">
    {#if allTags && allTags.size}
      <div
        class="filter-group max-h-[calc(50vh-32px)] overflow-y-auto relative mb-5">
        <h4
          class="sticky top-0 bg-white py-2 m-0 text-gray-600 font-medium text-sm border-b border-gray-100">
          标签筛选
        </h4>
        {#each Array.from(allTags).sort((a, b) => tagCounts.get(b) - tagCounts.get(a)) as tag}
          <label
            class="flex items-center gap-2 px-1 py-1.5 hover:bg-gray-50 rounded-md text-sm text-gray-700 truncate">
            <input
              type="checkbox"
              class="form-checkbox h-3.5 w-3.5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              checked={selectedTags.has(tag)}
              onchange={() => {
                toggleTag(tag)
                selectedTags = selectedTags
              }} />
            <span class="truncate">{tag}</span>
            <span class="text-gray-400 text-xs font-medium"
              >{tagCounts.get(tag) || 0}</span>
          </label>
        {/each}
      </div>
    {/if}

    {#if allDomains && allDomains.size}
      <div
        class="filter-group max-h-[calc(50vh-32px)] overflow-y-auto relative mb-5">
        <h4
          class="sticky top-0 bg-white py-2 m-0 text-gray-600 font-medium text-sm border-b border-gray-100">
          域名筛选
        </h4>
        {#each Array.from(allDomains).sort((a, b) => domainCounts.get(b) - domainCounts.get(a)) as domain}
          <label
            class="flex items-center gap-2 px-1 py-1.5 hover:bg-gray-50 rounded-md text-sm text-gray-700 truncate">
            <input
              type="checkbox"
              class="form-checkbox h-3.5 w-3.5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              checked={selectedDomains.has(domain)}
              onchange={() => {
                toggleDomain(domain)
                selectedDomains = selectedDomains
              }} />
            <span class="truncate">{domain}</span>
            <span class="text-gray-400 text-xs font-medium"
              >{domainCounts.get(domain) || 0}</span>
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
    border-right: var(--sidebar-border-right);
    border-left: var(--sidebar-border-left);
    padding-left: var(--sidebar-padding-left);
    padding-right: var(--sidebar-padding-right);
    margin-bottom: 20px;
    overflow: hidden;
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
</style>
