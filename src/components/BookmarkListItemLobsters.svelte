<script>
  import Favicon from './Favicon.svelte'

  let { href, tags, title, formatedUpdated, dateTitleText } = $props()
</script>

<div class="simple group relative mx-[6px] p-2">
  <div class="flex flex-wrap items-center gap-2 truncate">
    <Favicon {href} classNames="h-4 w-4 flex-none" />
    <a class="title flex-none" {href} {title} target="_blank" rel="noopener">
      <span>{title}</span>
    </a>
    <span class="tags flex flex-wrap gap-1">
      {#each tags as tag}
        <span>{tag}</span>
      {/each}
    </span>
    <a class="domain" {href} target="_blank" rel="noopener"
      >{new URL(href).hostname}</a>
  </div>
  <div class="byline mt-1 flex flex-wrap items-center gap-1 truncate">
    <span class="datetime text-gray-500" title={dateTitleText}
      >{formatedUpdated}</span>
    <span>edit</span>
    <span>delete</span>
  </div>
</div>

<style>
  .simple {
    flex: 1 1 0;
    --color-tag-bg: #fffcd7;
    --color-tag-border: #d5d458;
    --base-fg: 51 51 51;
    --opacity-fg-contrast-10: 84%;
    --opacity-fg-contrast-4-5: 59%;
    --color-fg-contrast-10: rgb(var(--base-fg) / var(--opacity-fg-contrast-10));
    --color-fg-contrast-4-5: rgb(
      var(--base-fg) / var(--opacity-fg-contrast-4-5)
    );
  }
  .simple .title {
    color: #1c59d1;
    display: block;
    font-weight: 500;
    overflow: hidden;
    width: fit-content;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .simple .domain {
    color: var(--color-fg-contrast-4-5);
    font-style: italic;
    font-size: 9pt;
    text-decoration: none;
    vertical-align: middle;
  }
  .simple .tags span {
    background-color: var(--color-tag-bg);
    border: 1px solid var(--color-tag-border);
    border-radius: 5px;
    color: var(--color-fg-contrast-10);
    font-size: 11px;
    padding: 0px 0.4em 0px 0.4em;
    text-decoration: none;
    white-space: nowrap;
  }
  .simple .byline span {
    color: var(--color-fg-contrast-4-5);
    font-size: 12px;
  }
  .simple .byline span:not(:first-of-type)::before {
    content: '|';
    margin-right: calc(var(--spacing) * 1);
  }
</style>
