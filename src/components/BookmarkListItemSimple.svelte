<script>
  import Favicon from './Favicon.svelte'

  let { href, tags, title, formatedUpdated, dateTitleText } = $props()
</script>

<div class="list-simple group relative mx-[12px] p-2">
  <div class="title flex items-center gap-2 truncate">
    <Favicon {href} classNames="h-4 w-4 flex-none" />
    <a {href} {title} target="_blank" rel="noopener">
      <span>{title}</span>
    </a>
  </div>
  <div class="url-path mt-1 truncate text-xs">
    <a {href} target="_blank" rel="noopener"><span>{href}</span></a>
  </div>
  <div class="description mt-1 flex flex-wrap items-baseline gap-1 truncate">
    <span class="tags flex flex-wrap gap-1">
      {#each tags as tag}
        <a href="#{encodeURIComponent(tag)}" class="tag"><span>{tag}</span></a>
      {/each}
    </span>
    <span class="datetime text-gray-500" title={dateTitleText}
      >{formatedUpdated}</span>
    <span class="action">edit</span>
    <span class="action">delete</span>
  </div>
</div>

<style>
  .list-simple {
    --bookmark-title-color: #4644d5;
    --secondary-link-color: #4240d4cc;
    --alternative-color: #048f8d;
    --bookmark-actions-color: #6b7280;
    --bookmark-actions-hover-color: #374151;
  }
  :root.dark .list-simple {
    --bookmark-title-color: #adabf7;
    --secondary-link-color: #adabf7cc;
    --alternative-color: #5ec9c8;
    --bookmark-actions-color: #9ca3af;
    --bookmark-actions-hover-color: #d1d5db;
  }
  .list-simple {
    flex: 1 1 0;
  }
  .list-simple .title {
    position: relative;
  }
  .list-simple .title a {
    color: var(--bookmark-title-color);
    display: block;
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    width: fit-content;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .list-simple .url-path {
    color: var(--secondary-link-color);
  }
  .list-simple .tags .tag {
    color: var(--alternative-color);
    font-size: 14px;
  }

  .list-simple .title a:hover,
  .list-simple .url-path a:hover,
  .list-simple .tags .tag:hover {
    text-decoration: underline;
  }
  .list-simple .tag::before {
    content: '#';
  }
  .list-simple .datetime,
  .list-simple .action {
    color: var(--bookmark-actions-color);
    font-size: 13px;
  }
  .list-simple .action:hover {
    color: var(--bookmark-actions-hover-color);
  }
  .list-simple .description span:not(:first-of-type):not(.tag)::before {
    content: '|';
    margin-right: calc(var(--spacing) * 1);
  }
</style>
