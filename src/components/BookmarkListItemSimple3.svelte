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
    <a {href} target="_blank" rel="noopener">{href}</a>
  </div>
  <div class="description mt-1 flex flex-wrap items-baseline gap-1 truncate">
    <span class="tags flex flex-wrap gap-1 text-sm">
      {#each tags as tag, i}
        {#if i > 0}
          <span class="sep"> / </span>
        {/if}
        <a href="#{encodeURIComponent(tag)}" class="tag">{tag}</a>
      {/each}
    </span>
    <span class="datetime text-gray-500" title={dateTitleText}
      >{formatedUpdated}</span>
    <span class="action">edit</span>
    <span class="action">delete</span>
  </div>
</div>

<style>
  .title {
    position: relative;
  }
  .title a {
    color: #000;
    display: block;
    font-weight: 500;
    overflow: hidden;
    width: fit-content;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.7;
    transition: 0.2s all ease-out;
  }
  .title a:hover {
    opacity: 1;
  }
  .url-path {
    opacity: 0.6;
    color: #000;
    transition: 0.2s all ease-out;
  }
  .url-path:hover {
    opacity: 1;
  }
  .tag {
    opacity: 0.6;
    font-weight: inherit;
    text-decoration: none;
    border-bottom: 1px solid rgba(125, 125, 125, 0.3);
    transition: border 0.2s ease-in-out;
  }
  .tag:hover {
    border-bottom: 1px solid #555;
  }

  .sep {
    opacity: 0.25;
  }

  .datetime,
  .action {
    color: #6b7280;
    font-size: 13px;
  }
</style>
