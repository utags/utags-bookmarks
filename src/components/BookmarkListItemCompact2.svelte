<script>
  import Favicon from './Favicon.svelte'

  let { href, tags, title, formatedUpdated, dateTitleText } = $props()
</script>

<div
  class="list-compact group relative mx-[6px] rounded-md p-2 transition-colors duration-50">
  <div class="flex items-center justify-between gap-2">
    <div class="flex items-center gap-2 truncate">
      <Favicon {href} classNames="h-4 w-4 flex-none" />
      <h3
        class="flex-none truncate text-sm font-normal text-gray-900 underline dark:text-gray-300">
        <a {href} {title} target="_blank" rel="noopener">
          {title}
        </a>
      </h3>
      <div class="tags flex flex-nowrap gap-2 overflow-x-auto">
        {#each tags as tag}
          <a
            href="#{encodeURIComponent(tag)}"
            class="tag border border-gray-200 p-1 pr-2 font-mono text-xs dark:border-gray-600">
            {tag}
          </a>
        {/each}
      </div>
    </div>
    <span
      class="text-text-muted pt-1 font-mono text-sm dark:text-gray-500"
      title={dateTitleText}>
      {formatedUpdated}
    </span>
  </div>
</div>

<style>
  .tag {
    --color-text-link: 51 154 240;
    background-position: 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 1.5px;
    background-image: linear-gradient(
      to right,
      rgb(var(--color-text-link)),
      rgb(var(--color-text-link))
    );
    text-decoration: none;
  }
  .tag:hover {
    color: rgb(var(--color-text-link));
  }
  h3 {
    order: 1;
  }
</style>
