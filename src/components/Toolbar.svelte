<script lang="ts">
  import { type NestedFilterExpression } from '../types/filters'
  import Statistics from './Statistics.svelte'
  import DropdownMenu from './DropdownMenu.svelte'
  import MoreVertIcon from './svg/MoreVertIcon.svelte'

  interface Stats {
    bookmarksCount: number
    tagsCount: number
    domainsCount: number
  }

  let { stats }: { stats: Stats } = $props()
  let menuOpen = $state(false)
  let nestedFilterExpression: NestedFilterExpression = [
    [
      [
        {
          value: 'abcd',
          type: 'keyword',
        },
      ],
      [
        {
          value: '111',
          type: 'tag',
        },
        {
          value: '222',
          type: 'tag',
        },
        {
          value: '111',
          type: 'tag',
        },
        {
          value: '222',
          type: 'tag',
        },
      ],
      [
        {
          value: 'example.com',
          type: 'domain',
        },
        {
          value: 'example2.com',
          type: 'domain',
        },
        {
          value: 'example.com',
          type: 'domain',
        },
        {
          value: 'example2.com',
          type: 'domain',
        },
      ],
    ],
    [
      [
        {
          value: 'abcd',
          type: 'keyword',
        },
      ],
      [
        {
          value: '111',
          type: 'tag',
        },
        {
          value: '222',
          type: 'tag',
        },
      ],
      [
        {
          value: 'example.com',
          type: 'domain',
        },
        {
          value: 'example2.com',
          type: 'domain',
        },
        {
          value: 'example.com',
          type: 'domain',
        },
        {
          value: 'example2.com',
          type: 'domain',
        },
      ],
    ],
    [
      [
        {
          value: 'abcd',
          type: 'keyword',
        },
      ],
      [
        {
          value: '111',
          type: 'tag',
        },
        {
          value: '222',
          type: 'tag',
        },
        {
          value: '222',
          type: 'tag',
        },
        {
          value: '222',
          type: 'tag',
        },
      ],
      [
        {
          value: 'example.com',
          type: 'domain',
        },
        {
          value: 'example2.com',
          type: 'domain',
        },
      ],
    ],
  ]

  // nestedFilterExpression = []
</script>

<div
  class="toolbar z-40 min-h-11 flex flex-none items-center justify-between border-b border-(color:--seperator-line-color) bg-white/95 px-5 shadow-xs backdrop-blur-sm dark:bg-gray-900/95">
  <div
    class="left-tools flex flex-none items-center gap-2 border-r border-(color:--seperator-line-color) py-1">
    <!-- 左侧工具按钮区域 -->
  </div>
  <div
    class="right-tools flex max-w-full flex-none flex-nowrap items-center gap-2 py-1">
    <!-- 右侧工具筛选条件区域 -->
    <div
      class="filters-container flex flex-grow-1 flex-wrap items-center gap-1">
      <ul class="flex flex-wrap items-center gap-1">
        {#each nestedFilterExpression as filterGroup, groupIndex}
          {#each filterGroup as filterSet, filterSetIndex}
            {#each filterSet as filter, filterItemIndex}
              <li
                class="flex flex-shrink-0 items-center gap-1 rounded px-2 py-1 text-xs"
                class:bg-blue-100={filter.type === 'keyword'}
                class:bg-green-100={filter.type === 'tag'}
                class:bg-purple-100={filter.type === 'domain'}
                class:dark:bg-blue-900={filter.type === 'keyword'}
                class:dark:bg-green-900={filter.type === 'tag'}
                class:dark:bg-purple-900={filter.type === 'domain'}>
                <button
                  class="hover:bg-opacity-80 flex items-center gap-1 transition-all duration-200 hover:text-red-500 hover:[&>span]:line-through"
                  onclick={() => {
                    console.log(
                      'clicked: delete',
                      filter,
                      groupIndex,
                      filterSetIndex,
                      filterItemIndex
                    )
                    // nestedFilterExpression = nestedFilterExpression
                    //   .map((g, gi) =>
                    //     gi === groupIndex
                    //       ? g
                    //           .map((f, fi) =>
                    //             fi === filterSetIndex
                    //               ? f.filter((_, fii) => fii !== filterItemIndex)
                    //               : f
                    //           )
                    //           .filter((f) => f.length > 0)
                    //       : g
                    //   )
                    //   .filter((g) => g.length > 0)
                  }}>
                  <span>{filter.value}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 opacity-70 hover:text-red-500 hover:opacity-100"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </li>
            {/each}
          {/each}
          {#if groupIndex < nestedFilterExpression.length - 1}
            <li class="flex-shrink-0 text-gray-400 dark:text-gray-500">•</li>
          {/if}
        {/each}
      </ul>
    </div>

    <!-- 右侧工具按钮区域 -->
    <Statistics
      bookmarksCount={stats.bookmarksCount}
      tagsCount={stats.tagsCount}
      domainsCount={stats.domainsCount} />

    <div class="relative flex-none">
      <button
        class="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        onclick={() => {
          if (!menuOpen) {
            setTimeout(() => {
              menuOpen = true
            })
          }
        }}>
        <MoreVertIcon />
      </button>

      <DropdownMenu
        bind:open={menuOpen}
        items={[
          { value: 'selectMode', label: '选择模式' },
          { value: 'openAll', label: '打开所有书签' },
        ]}
        selectedValue=""
        onSelect={(value) => {
          if (value === 'openAll') {
            // 打开所有书签的逻辑
            window.dispatchEvent(new CustomEvent('openAllBookmarks'))
            alert('Comming soon! 功能还未完成，敬请期待！')
          } else if (value === 'selectMode') {
            // 选择逻辑
            window.dispatchEvent(new CustomEvent('enterSelectionMode'))
            alert('Comming soon! 功能还未完成，敬请期待！')
          }
        }}
        width="w-32" />
    </div>
  </div>
</div>

<style>
  .left-tools {
    width: var(--aside-area-width);
    height: 100%;
  }
  .right-tools {
    width: calc(100% - var(--aside-area-width) - 20px);
    height: 100%;
  }
</style>
