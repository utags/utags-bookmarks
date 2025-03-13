<script>
  import VirtualList from 'svelte-virtual-list'
  import { humanizeUrl } from '../utils'

  export let filteredBookmarks
  export let scrollTop
</script>

<VirtualList items={filteredBookmarks} bind:scrollTop let:item>
  <div class="group relative mr-[10px] ml-[10px] rounded-md bg-white p-3 transition-colors duration-50 hover:bg-gray-100">
    <div class="flex items-center gap-3">
      <div class="min-w-0 flex-1 space-y-0.5">
        <div class="flex items-center gap-2 truncate">
          <h3
            class="truncate text-sm text-gray-900"
            style="flex: 0 0 50%; min-width: 0;"
          >
            <a
              href={item[0]}
              title={item[1].meta.title || '无标题'}
              target="_blank"
              class="flex flex-nowrap items-center gap-1"
              style="flex-shrink:0; min-width:0"
            >
              <img
                src={import.meta.env.MODE === 'development'
                  ? '/favicon.ico'
                  : `https://www.google.com/s2/favicons?domain=${new URL(item[0]).hostname}`}
                class="h-4 w-4 flex-none"
                alt="favicon"
              />
              <span class="truncate" style="min-width:0">
                {item[1].meta.title || '无标题'}
              </span>
            </a>
          </h3>

          <a
            href={item[0]}
            title={item[0]}
            target="_blank"
            class="truncate pt-0.5 text-xs text-gray-800 hover:text-gray-800"
          >
            {humanizeUrl(item[0])}
          </a>
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
          {#each item[1].tags as tag}
            <span
              class="inline-flex items-center gap-1 rounded-sm border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-700"
            >
              <span class="font-normal tracking-tight">{tag}</span>
            </span>
          {/each}
        </div>
      </div>
      <div class="top-3 right-3 text-right">
        <span class="font-mono text-xs tracking-tight text-gray-500">
          {#if item[1].meta.created === item[1].meta.updated}
            <div
              title="创建时间 (未更新过)"
              class="flex flex-col items-end gap-0.5"
            >
              <span
                >{new Date(item[1].meta.updated).toLocaleString('zh-CN', {
                  hour12: false,
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}</span
              >
            </div>
          {:else}
            <div
              title="更新时间/创建时间"
              class="flex flex-col items-end justify-end gap-0.5"
            >
              <span
                >{new Date(item[1].meta.updated).toLocaleString('zh-CN', {
                  hour12: false,
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}</span
              >
              <span
                >{new Date(item[1].meta.created).toLocaleString('zh-CN', {
                  hour12: false,
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}</span
              >
            </div>
          {/if}
        </span>
      </div>
    </div>
  </div>
</VirtualList>

<style>
  .bookmark-list {
    height: calc(100vh - 198px);
    overflow-y: auto;
  }
</style>