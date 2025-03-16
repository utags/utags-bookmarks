<script>
  import { formatDatetime } from '../utils'
  import BookmarkListItemList from './BookmarkListItemList.svelte'
  import BookmarkListItemCompact from './BookmarkListItemCompact.svelte'
  import BookmarkListItemSimple from './BookmarkListItemSimple.svelte'
  import BookmarkListItemLobsters from './BookmarkListItemLobsters.svelte'

  let { item, viewMode } = $props()

  const href = $derived(item[0])
  const tags = $derived(item[1].tags)
  const meta = $derived(item[1].meta)
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
{:else if viewMode === 'simple'}
  <BookmarkListItemSimple
    {href}
    {tags}
    {title}
    {formatedUpdated}
    {dateTitleText} />
{:else if viewMode === 'simple2'}
  <BookmarkListItemLobsters
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
