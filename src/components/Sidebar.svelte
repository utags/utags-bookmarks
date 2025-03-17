<script>
  import { fade } from 'svelte/transition'
  import {
    $ as _$,
    addEventListener,
    extendHistoryApi,
  } from 'browser-extension-utils'
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

  function scrollTagIntoView(tag) {
    const element = _$(`label[data-tag="${tag}"]`)
    if (element) {
      console.log(element)
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }

  // 重置筛选条件
  function resetFilterWith(keyword, tags, domains) {
    searchKeyword = keyword || ''
    selectedTags = new Set(tags)
    selectedDomains = new Set(domains)
    if (tags && tags.length > 0) {
      setTimeout(() => {
        scrollTagIntoView(tags[0])
      }, 5)
    }
  }

  // 监听 hashchange 事件并更新 selectedTags
  function handleHashChange() {
    console.log('locationchanged', location.href, location.hash)
    if (location.hash && location.hash.length > 1) {
      try {
        const tag = decodeURIComponent(location.hash.slice(1))
        console.log(tag)
        setTimeout(() => {
          resetFilterWith('', [tag])
        }, 5)
      } catch (e) {
        console.error(e)
      }
    }
  }
  if (!globalThis.locationchange) {
    globalThis.locationchange = true
    extendHistoryApi()

    addEventListener(globalThis, 'locationchange', handleHashChange)
    if (location.hash) {
      handleHashChange()
    }
  }

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

<aside class="sidebar" out:fade={{ duration: 1000 }}>
  <div class="mb-4 flex flex-col gap-2">
    <button
      class="reset-filter rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200"
      onclick={() => {
        resetFilterWith()
      }}>
      重置筛选
    </button>
    <div class="relative w-full" style="padding-right: 1px;">
      <input
        type="text"
        placeholder="搜索 URL/标题/标签..."
        class="w-full rounded-md border border-gray-300 bg-transparent py-1.5 pr-8 pl-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        bind:value={searchKeyword} />
      {#if searchKeyword}
        <button
          class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-gray-100 p-1 transition-colors hover:bg-gray-200"
          onclick={() => (searchKeyword = '')}
          aria-label="清除搜索关键词">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24">
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
        class="filter-group relative mb-5 max-h-[calc(50vh-32px)] overflow-y-auto">
        <h4
          class="sticky top-0 m-0 border-b border-gray-100 bg-white py-2 text-sm font-medium text-gray-600">
          标签筛选
        </h4>
        {#each Array.from(allTags).sort((a, b) => tagCounts.get(b) - tagCounts.get(a)) as tag}
          <label
            data-tag={tag}
            class="flex items-center gap-2 truncate rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            <input
              type="checkbox"
              class="form-checkbox h-3.5 w-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              checked={selectedTags.has(tag)}
              onchange={() => {
                toggleTag(tag)
                selectedTags = selectedTags
              }} />
            <span class="truncate">{tag}</span>
            <span class="text-xs font-medium text-gray-400"
              >{tagCounts.get(tag) || 0}</span>
          </label>
        {/each}
      </div>
    {/if}

    {#if allDomains && allDomains.size}
      <div
        class="filter-group relative mb-5 max-h-[calc(50vh-32px)] overflow-y-auto">
        <h4
          class="sticky top-0 m-0 border-b border-gray-100 bg-white py-2 text-sm font-medium text-gray-600">
          域名筛选
        </h4>
        {#each Array.from(allDomains).sort((a, b) => domainCounts.get(b) - domainCounts.get(a)) as domain}
          <label
            class="flex items-center gap-2 truncate rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            <input
              type="checkbox"
              class="form-checkbox h-3.5 w-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              checked={selectedDomains.has(domain)}
              onchange={() => {
                toggleDomain(domain)
                selectedDomains = selectedDomains
              }} />
            <span class="truncate">{domain}</span>
            <span class="text-xs font-medium text-gray-400"
              >{domainCounts.get(domain) || 0}</span>
          </label>
        {/each}
      </div>
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    /* background-color: wheat; */
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    border-right: var(--sidebar-border-right);
    border-left: var(--sidebar-border-left);
    padding-left: var(--sidebar-padding-left);
    padding-right: var(--sidebar-padding-right);
    overflow: hidden;
    scroll-snap-align: var(--sidebar-scroll-snap-align);
  }

  .filter-group {
    max-height: calc(50vh - 32px);
    overflow-y: auto;
    position: relative;
    margin-bottom: 20px;
    scroll-padding-bottom: 60%;
  }

  .filter-group h4 {
    position: sticky;
    top: 0;
    background: white;
    padding: 8px 0;
    z-index: 1;
    margin: 0;
  }

  .reset-filter {
    align-self: var(--sidebar-reset-filter-align-self);
  }
</style>
