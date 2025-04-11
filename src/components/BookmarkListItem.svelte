<script>
  import { formatDatetime } from '../utils'
  import BookmarkListItemList from './BookmarkListItemList.svelte'
  import BookmarkListItemCompact from './BookmarkListItemCompact.svelte'
  import BookmarkListItemCompact2 from './BookmarkListItemCompact2.svelte'
  import BookmarkListItemSimple from './BookmarkListItemSimple.svelte'
  import BookmarkListItemSimple2 from './BookmarkListItemSimple2.svelte'
  import BookmarkListItemSimple3 from './BookmarkListItemSimple3.svelte'

  let { item, viewMode } = $props()

  const href = $derived(item[0])
  const tags = $derived(item[1].tags)
  const meta = $derived(item[1].meta)
  // TODO: 无标题显示 url 地址
  const title = $derived(meta.title || '无标题')
  const created = $derived(meta.created)
  const updated = $derived(meta.updated)
  const formatedCreated = $derived(formatDatetime(created))
  const formatedUpdated = $derived(formatDatetime(updated))
  const dateTitleText = $derived(
    `更新时间: ${formatDatetime(updated, true)} \u000d创建时间: ${formatDatetime(created, true)}`
  )
</script>

{#if viewMode === 'compact'}
  <BookmarkListItemCompact
    {href}
    {tags}
    {title}
    {formatedUpdated}
    {dateTitleText} />
{:else if viewMode === 'compact2'}
  <BookmarkListItemCompact2
    {href}
    {tags}
    {title}
    {formatedUpdated}
    {dateTitleText} />
{:else if viewMode === 'simple'}
  <BookmarkListItemSimple
    {href}
    {tags}
    {title}
    {formatedUpdated}
    {dateTitleText} />
{:else if viewMode === 'simple2'}
  <BookmarkListItemSimple2
    {href}
    {tags}
    {title}
    {formatedUpdated}
    {dateTitleText} />
{:else if viewMode === 'simple3'}
  <BookmarkListItemSimple3
    {href}
    {tags}
    {title}
    {formatedUpdated}
    {dateTitleText} />
{:else}
  <BookmarkListItemList
    {href}
    {tags}
    {title}
    {created}
    {updated}
    {formatedCreated}
    {formatedUpdated}
    {dateTitleText} />
{/if}
