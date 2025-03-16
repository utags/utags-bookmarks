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
  class="group relative mr-[10px] ml-[10px] rounded-md bg-white p-2 transition-colors duration-50 hover:bg-gray-100">
  <div class="flex items-center gap-3">
    <div class="min-w-0 flex-1 space-y-0.5">
      <div class="flex items-center gap-2 truncate">
        <h3
          class="truncate text-sm text-gray-900"
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
          class="truncate pt-0.5 text-xs text-gray-800 hover:text-gray-800">
          {humanizeUrl(href)}
        </a>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        {#each tags as tag}
          <span
            class="inline-flex items-center gap-1 rounded-sm border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs text-gray-700">
            <span class="font-normal tracking-tight">{tag}</span>
          </span>
        {/each}
      </div>
    </div>
    <div class="top-3 right-3 text-right">
      <span
        class="font-mono text-xs tracking-tight text-gray-500"
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
