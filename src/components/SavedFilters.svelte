<script>
  import { persisted } from 'svelte-persisted-store'

  const { filters = persisted('utags-filters', []), activeFilters } = $props()

  let filterName = $state('')

  function saveFilter() {
    if (!filterName) return
    console.log(crypto.randomUUID(), { ...activeFilters })
    $filters = [
      ...$filters,
      {
        id: crypto.randomUUID(),
        name: filterName,
        params: { ...activeFilters },
      },
    ]
    filterName = ''
  }

  function applyFilter(filter) {
    if (filter && filter.params) {
      const event = new CustomEvent('applyFilter', {
        detail: filter.params,
      })
      window.dispatchEvent(event)
    }

    alert('Comming soon...')
  }

  function deleteFilter(id) {
    alert('Comming soon...')
    $filters = $filters.filter((f) => f.id !== id)
  }

  if ($filters.length === 0) {
    ;[
      '示例: AI 学习资源',
      '示例: 搞笑视频',
      '友情提示: 此功能即将到来',
    ].forEach((name) => {
      filterName = name
      saveFilter()
    })
  }
</script>

<div style="order: 1;" class="saved-filters">
  <div class="mb-4 space-y-3">
    <button
      class="flex w-full items-center justify-center rounded-lg bg-indigo-600
             px-4 py-2 text-lg font-medium
             text-white shadow-sm transition-all duration-200 hover:bg-indigo-700"
      onclick={saveFilter}
      disabled={!filterName}>
      保存当前筛选条件
    </button>
    <div class="flex hidden gap-3">
      <input
        type="text"
        bind:value={filterName}
        placeholder="输入筛选条件名称"
        class="flex-1 rounded-xl border-2 border-indigo-100 px-4 py-2.5
             shadow-sm transition-all outline-none
             focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        onkeydown={(e) => e.key === 'Enter' && saveFilter()} />
      <button
        onclick={saveFilter}
        class="flex items-center rounded-xl bg-indigo-500 px-6
             py-2.5 text-base text-white shadow-sm
             transition-all duration-200 hover:bg-indigo-600 disabled:opacity-50"
        disabled={!filterName}>
        保存
      </button>
    </div>
  </div>

  <ul class="max-h-[calc(100%-76px)] space-y-2 overflow-y-auto">
    {#each $filters as filter}
      <li
        class="group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-indigo-50">
        <button
          onclick={() => applyFilter(filter)}
          class="truncate text-sm text-gray-700 hover:text-indigo-800">
          {filter.name}
        </button>
        <button
          onclick={() => deleteFilter(filter.id)}
          class="rounded-md px-2 py-1 text-sm text-red-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-700">
          ×
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .saved-filters {
    width: 280px;
    min-width: 280px;
    border-right: var(--sidebar-border-right);
    border-left: var(--sidebar-border-left);
    padding-left: var(--sidebar-padding-left);
    padding-right: var(--sidebar-padding-right);
    margin-bottom: 20px;
    overflow: hidden;
  }
</style>
