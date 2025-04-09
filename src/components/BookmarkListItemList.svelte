<script>
  import { humanizeUrl } from '../utils'
  import Favicon from './Favicon.svelte'

  let {
    href,
    tags,
    title,
    created,
    updated,
    formatedCreated,
    formatedUpdated,
    dateTitleText,
  } = $props()
</script>

<div
  class="list-default group relative mr-[12px] ml-[12px] rounded-md bg-white p-2 transition-colors duration-50 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800">
  <div class="flex items-center gap-3">
    <div class="min-w-0 flex-1 space-y-0.5">
      <div class="flex items-center gap-2 truncate">
        <h3
          class="truncate text-sm text-gray-900 dark:text-gray-300"
          style="flex: 0 0 50%; min-width: 0;">
          <a
            {href}
            {title}
            target="_blank"
            rel="noopener"
            class="flex flex-nowrap items-center gap-1"
            style="flex-shrink:0; min-width:0">
            <Favicon {href} classNames="h-4 w-4 flex-none" />
            <span class="truncate" style="min-width:0">
              {title}
            </span>
          </a>
        </h3>

        <a
          {href}
          title={href}
          target="_blank"
          rel="noopener"
          class="truncate pt-0.5 text-xs text-gray-800 hover:text-gray-300 dark:text-gray-400">
          <span>{humanizeUrl(href)}</span>
        </a>
      </div>
      <div class="tags mt-2 flex flex-wrap gap-2">
        {#each tags as tag}
          <a
            href="#{encodeURIComponent(tag)}"
            class="tag inline-flex items-center gap-1 rounded-sm bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <span class="font-normal tracking-tight">{tag}</span>
          </a>
        {/each}
      </div>
    </div>
    <div class="top-3 right-3 text-right">
      <span
        class="font-mono text-xs tracking-tight text-gray-500 dark:text-gray-500"
        title={dateTitleText}>
        {#if created === updated}
          <div class="flex flex-col items-end gap-0.5">
            <span>{formatedUpdated}</span>
          </div>
        {:else}
          <div class="flex flex-col items-end justify-end gap-0.5">
            <span>{formatedUpdated}</span>
            <span>{formatedCreated}</span>
          </div>
        {/if}
      </span>
    </div>
  </div>
</div>

<style>
  .list-default:hover .tag {
    background-color: var(--color-gray-200);
  }
  :root.dark .list-default:hover .tag {
    background-color: var(--color-gray-900);
  }
</style>
