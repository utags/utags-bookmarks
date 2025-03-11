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

    alert('Comming soon...')
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
</script>

<div style="order: 1;" class="saved-filters">
  <div class="mb-4 space-y-3">
    <button
      class="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg
             shadow-sm hover:bg-indigo-700 transition-all duration-200
             text-lg font-medium flex items-center justify-center"
      onclick={saveFilter}
      disabled={!filterName}>
      保存当前筛选条件
    </button>
    <div class="flex gap-3 hidden">
      <input
        type="text"
        bind:value={filterName}
        placeholder="输入筛选条件名称"
        class="flex-1 px-4 py-2.5 border-2 border-indigo-100 rounded-xl
             focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
             outline-none shadow-sm transition-all"
        onkeydown={(e) => e.key === 'Enter' && saveFilter()} />
      <button
        onclick={saveFilter}
        class="px-6 py-2.5 bg-indigo-500 text-white rounded-xl
             hover:bg-indigo-600 transition-all duration-200
             shadow-sm disabled:opacity-50 flex items-center"
        disabled={!filterName}>
        保存
      </button>
    </div>
  </div>

  <ul class="space-y-2 overflow-y-auto max-h-[calc(100%-76px)]">
    <li
      class="flex justify-between items-center group px-2 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
      <button
        onclick={() => applyFilter()}
        class="text-gray-700 hover:text-indigo-800 truncate">
        示例：AI 学习资源
      </button>
      <button
        onclick={() => deleteFilter()}
        class="text-red-500 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50">
        ×
      </button>
    </li>
    <li
      class="flex justify-between items-center group px-2 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
      <button
        onclick={() => applyFilter()}
        class="text-gray-700 hover:text-indigo-800 truncate">
        示例：搞笑视频
      </button>
      <button
        onclick={() => deleteFilter()}
        class="text-red-500 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50">
        ×
      </button>
    </li>
    <li
      class="flex justify-between items-center group px-2 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
      <button
        onclick={() => applyFilter()}
        class="text-gray-700 hover:text-indigo-800 truncate">
        友情提示：此功能即将到来
      </button>
      <button
        onclick={() => deleteFilter()}
        class="text-red-500 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50">
        ×
      </button>
    </li>
    {#each $filters as filter}
      <li
        class="flex justify-between items-center group px-2 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
        <button
          onclick={() => applyFilter(filter)}
          class="text-gray-700 hover:text-indigo-800 truncate">
          {filter.name}
        </button>
        <button
          onclick={() => deleteFilter(filter.id)}
          class="text-red-500 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50">
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
