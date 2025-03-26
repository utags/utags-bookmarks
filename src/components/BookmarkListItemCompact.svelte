<script>
  import Favicon from './Favicon.svelte'

  let { href, tags, title, formatedUpdated, dateTitleText } = $props()
</script>

<div
  class="list-compact group relative mx-[6px] rounded-md bg-white p-2 transition-colors duration-50 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700">
  <div class="flex items-center justify-between gap-2">
    <div class="flex items-center gap-2 truncate">
      <Favicon {href} classNames="h-3 w-3 flex-none" />
      <h3
        class="flex-none truncate text-xs font-normal text-gray-900 dark:text-gray-300">
        <a {href} {title} target="_blank" rel="noopener">
          {title}
        </a>
      </h3>
      <div class="tags flex flex-nowrap gap-1 overflow-x-auto">
        {#each tags as tag}
          <a
            href="#{encodeURIComponent(tag)}"
            class="tag inline-flex items-center rounded-sm bg-gray-100 px-1 py-0.5 text-[11px] text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
            {tag}
          </a>
        {/each}
      </div>
    </div>
    <span
      class="shrink-0 text-xs text-gray-500 dark:text-gray-500"
      title={dateTitleText}>
      {formatedUpdated}
    </span>
  </div>
</div>

<style>
  .list-compact:hover .tag {
    background-color: var(--color-gray-200);
  }
  :root.dark .list-compact:hover .tag {
    background-color: var(--color-gray-900);
  }
</style>
