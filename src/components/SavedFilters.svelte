<script>
  import {
    ChevronDown,
    ChevronRight,
    Bookmark,
    Tag,
    List,
    Clock,
    Star,
    Globe,
    Folder,
  } from 'lucide-svelte'
  import Modal from './Modal.svelte'
  import { HASH_DELIMITER, FILTER_DELIMITER } from '../constants.js'
  import { filters } from '../stores.js'

  let showModal = $state(false)
  let isEditing = $state(false)
  let validationError = $state(false)
  let filterName = $state('')
  let description = $state('')
  $effect(() => {
    if (showModal) {
      description = isEditing ? description : getSubtitle()
    }
  })
  let currentFilterId = $state(null)
  let activeMenuId = $state(null)

  $effect(() => {
    if (activeMenuId) {
      const handler = (e) => {
        const menu = document.querySelector(`[data-menu-id='${activeMenuId}']`)
        if (!menu?.contains(e.target)) {
          activeMenuId = null
        }
      }
      document.addEventListener('click', handler)
      return () => document.removeEventListener('click', handler)
    }
  })
  let editingFilterId = $state(null)
  let editedName = $state('')

  function getSubtitle() {
    const filterString = location.hash
    const filterParts = filterString.split(HASH_DELIMITER)
    return filterParts
      .map((part) => part.split(FILTER_DELIMITER))
      .flatMap((part) => decodeURIComponent(part).split(','))
      .filter(Boolean)
      .join(', ')
  }

  function saveFilter() {
    filterName = filterName ? filterName.trim() : ''
    if (!filterName) {
      validationError = true
      return
    }

    if (isEditing && currentFilterId) {
      $filters = $filters.map((f) =>
        f.id === currentFilterId ? { ...f, name: filterName, description } : f
      )
    } else {
      $filters = [
        {
          id: crypto.randomUUID(),
          name: filterName,
          description: description || getSubtitle(),
          filterString: location.hash,
        },
        ...$filters,
      ]
    }

    filterName = ''
    showModal = false
    currentFilterId = null
    isEditing = false
  }

  function applyFilter(filter) {
    if (filter) {
      location.hash = filter.filterString || '#'
      const event = new CustomEvent('applyFilter', {
        detail: filter.filterString,
      })
      window.dispatchEvent(event)
    }
  }

  function deleteFilter(id) {
    $filters = $filters.filter((f) => f.id !== id)
  }

  function showAddModal() {
    showModal = false
    setTimeout(() => {
      filterName = ''
      description = ''
      showModal = true
      isEditing = false
      currentFilterId = null
    })
  }

  window.addEventListener('clickShowSaveFilterModal', () => {
    showAddModal()
  })

  if ($filters.length === 0) {
    ;[
      '智能推荐: AI 学习资源',
      '智能推荐: 内容分类',
      '智能推荐: 动态扩展',
    ].forEach((name) => {
      filterName = name
      saveFilter()
    })
  }
  // 在脚本部分添加
  let filtersOpen = $state(true)

  function toggleFilters() {
    filtersOpen = !filtersOpen
  }
</script>

<div class="saved-filters">
  <div class="group">
    <div
      class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
      onclick={() => toggleFilters()}
      onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFilters()}
      role="button"
      tabindex="0">
      <span class="h-5 w-5">
        <Bookmark size={20} />
      </span>
      <span class="flex-1 text-left">筛选器收藏夹</span>
      <div class="relative flex-none">
        <button
          class="absolute top-1/2 right-0 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-indigo-600
                 transition-colors hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-gray-700"
          aria-label="新建筛选条件"
          onclick={(e) => {
            e.stopPropagation()
            showAddModal()
          }}>
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      {#if filtersOpen}
        <ChevronDown size={16} />
      {:else}
        <ChevronRight size={16} />
      {/if}
    </div>
  </div>

  {#if filtersOpen}
    <ul class="space-y-1">
      {#each $filters as filter}
        <li class="group pr-2">
          <div class="ml-3 flex items-center justify-between">
            <button
              onclick={() => applyFilter(filter)}
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <span class="h-4 w-4">
                <Folder size={16} />
              </span>
              <span class="flex-1 truncate text-left">{filter.name}</span>
            </button>

            <div class="relative flex items-center gap-1">
              <button
                class="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                onclick={(e) => {
                  e.stopPropagation()
                  activeMenuId = activeMenuId === filter.id ? null : filter.id
                }}
                aria-label="更多操作">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
              {#if activeMenuId === filter.id}
                <div
                  data-menu-id={filter.id}
                  class="absolute top-full right-0 z-50 w-32 origin-top-right rounded-md border border-gray-200 bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                  onclick={(event) => {
                    event.stopPropagation()
                  }}>
                  <div class="py-1">
                    <button
                      onclick={() => {
                        activeMenuId = null
                        showModal = false
                        filterName = filter.name
                        description = filter.description
                        currentFilterId = filter.id
                        isEditing = true
                        setTimeout(() => (showModal = true))
                      }}
                      class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      编辑
                    </button>
                    <button
                      onclick={() => {
                        if (confirm('确认要删除此筛选器收藏吗？')) {
                          deleteFilter(filter.id)
                        }
                      }}
                      class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700">
                      删除
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          {#if filter.description}
            <div
              class="mt-1 ml-9 truncate text-xs text-gray-400 dark:text-gray-400">
              {filter.description}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<Modal
  title={isEditing ? '编辑筛选器收藏' : '收藏当前筛选器'}
  isOpen={showModal}
  onOpen={() => {
    document.querySelector('.filter-name').focus()
  }}>
  <div class="space-y-4">
    <input
      type="text"
      bind:value={filterName}
      placeholder="输入筛选器名称"
      class="filter-name w-full rounded-xl border-2 ${validationError
        ? 'border-red-500'
        : 'border-gray-200'} bg-white px-4 py-2.5 transition-all outline-none ${validationError
        ? 'focus:border-red-500'
        : 'focus:border-indigo-300'} focus:ring-2 ${validationError
        ? 'ring-red-200'
        : 'focus:ring-indigo-200'} dark:border-gray-600 dark:bg-gray-700 dark:focus:border-indigo-500"
      onkeydown={(e) => e.key === 'Enter' && saveFilter()}
      oninput={() => (validationError = false)} />

    {#if validationError}
      <div class="mt-1 text-sm text-red-500 dark:text-red-400">
        必须填写筛选器名称
      </div>
    {/if}
    <input
      type="text"
      bind:value={description}
      placeholder="输入描述（可选）"
      class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5
              transition-all outline-none focus:border-indigo-300 focus:ring-2
              focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-indigo-500"
      onkeydown={(e) => e.key === 'Enter' && saveFilter()} />
    <div class="flex justify-end gap-3">
      <button
        class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        onclick={() => (showModal = false)}>
        取消
      </button>
      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-900"
        onclick={saveFilter}
        disabled={!filterName}>
        保存
      </button>
    </div>
  </div>
</Modal>

<style>
  /* .saved-filters {
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    border-right: var(--sidebar-border-right);
    border-left: var(--sidebar-border-left);
    padding-left: var(--sidebar-padding-left);
    padding-right: var(--sidebar-padding-right);
    overflow: hidden;
    scroll-snap-align: var(--sidebar-scroll-snap-align);
    padding-top: var(--sidebar-padding-top, 20px);
  } */

  /* .saved-filters {
    padding: 0.5rem 0;
  } */
</style>
