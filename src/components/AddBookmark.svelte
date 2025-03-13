<script>
  import { fade } from 'svelte/transition'
  import { persisted } from 'svelte-persisted-store'
  import { splitTags, trimTitle } from 'utags-utils'
  let { show = $bindable(false) } = $props()

  let url = $state('')
  let title = $state('')
  let tags = $state('')
  let tagsArray = $state([])

  const bookmarks = persisted('utags-bookmarks', { data: {} })
  let error = $state('')
  let tagError = $state('')

  function validateUrl() {
    try {
      new URL(url)
      error = ''
      return true
    } catch {
      error = '请输入有效的URL格式（例如: https://example.com）'
      return false
    }
  }

  function validateTags() {
    if (!tags) {
      tagError = '至少需要输入一个标签'
      return false
    }

    tagsArray = splitTags(tags)
    if (tagsArray.length === 0) {
      tagError = '至少需要输入一个标签，请使用逗号分隔多个标签'
      return false
    }

    tagError = ''
    return true
  }

  function addBookmark() {
    title = trimTitle(title)
    if (!validateUrl() || !validateTags()) {
      return
    }

    const newEntry = {
      tags: tagsArray,
      meta: {
        updated: Date.now(),
        created: Date.now(),
      },
    }

    if (title) {
      newEntry.meta.title = title
    }

    $bookmarks.data[url] = newEntry
    bookmarks.set($bookmarks)

    close()
  }

  function close() {
    show = false

    // 因为 onblur 事件发生时会校验，所以需要延迟重置表单
    setTimeout(() => {
      // 重置表单
      url = title = tags = error = tagError = ''
    })
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      addBookmark()
    } else if (e.key === 'Escape') {
      close()
    }
  }

  $effect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

{#if show}
  <div
    role="dialog"
    aria-label="添加新书签对话框"
    tabindex="0"
    class="fixed inset-0 z-50 flex h-[100vh] items-center justify-center bg-black/50">
    <div class="w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-2xl">
      <h3>添加新书签</h3>
      <div class="flex flex-col gap-2">
        <label for="url-input">URL: </label>
        <input
          id="url-input"
          type="text"
          bind:value={url}
          onblur={validateUrl}
          placeholder="https://example.com"
          class="rounded border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none {error
            ? 'border-red-500 ring-red-500'
            : ''}" />
        {#if error}
          <div out:fade={{ duration: 200 }} class="mt-1 text-sm text-red-500">
            {error}
          </div>
        {/if}
      </div>
      <div class="flex flex-col gap-2">
        <label for="title-input">标题: </label>
        <input
          id="title-input"
          type="text"
          bind:value={title}
          class="rounded border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="tags-input">标签（逗号分隔）: </label>
        <input
          id="tags-input"
          type="text"
          bind:value={tags}
          onblur={validateTags}
          placeholder="工作,技术,重要"
          class="rounded border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none {tagError
            ? 'border-red-500 ring-red-500'
            : ''}" />
        {#if tagError}
          <div out:fade={{ duration: 200 }} class="mt-1 text-sm text-red-500">
            {tagError}
          </div>
        {/if}
      </div>
      <div class="form-actions">
        <button
          class="rounded bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white transition-all hover:from-blue-600 hover:to-blue-700"
          onclick={addBookmark}>保存</button>
        <button
          class="rounded border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
          onclick={close}>取消</button>
      </div>
    </div>
  </div>
{/if}
