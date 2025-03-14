<script>
  import VirtualList from 'svelte-virtual-list'
  import BookmarkListItem from './BookmarkListItem.svelte'

  let { filteredBookmarks, viewMode, scrollTop } = $props()
  $effect(() => {
    const scrollTopValue = scrollTop
    setTimeout(() => {
      document.querySelector('.bookmark-list > *').scrollTo(0, scrollTopValue)
    })
  })
</script>

{#if filteredBookmarks.length > 500}
  <VirtualList id="test" items={filteredBookmarks} bind:scrollTop let:item>
    <BookmarkListItem {item} {viewMode} />
  </VirtualList>
{:else}
  <ul class="overflow-y-auto">
    {#each filteredBookmarks as item}
      <li>
        <BookmarkListItem {item} {viewMode} />
      </li>
    {/each}
  </ul>
{/if}

<style>
</style>
