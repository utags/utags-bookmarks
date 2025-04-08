<script>
  import { fade } from 'svelte/transition'
  import { splitTags, trimTitle } from 'utags-utils'
  import { initFocusTrap } from 'focus-trap-lite'
  import { bookmarks, checkBookmarksDataReady } from '../stores.ts'

  let { show = $bindable(false) } = $props()
  let modalElement = $state()

  let url = $state('')
  let title = $state('')
  let tags = $state('')
  let tagsArray = $state([])

  let error = $state('')
  let tagError = $state('')
  let lastUrl = undefined

  function validateUrl() {
    try {
      url = new URL(url).href
      error = ''

      const entry = $bookmarks.data[url]
      if (entry && url !== lastUrl) {
        title = entry.meta.title || ''
        tags = entry.tags.join(', ')
      }
      lastUrl = url
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
    checkBookmarksDataReady()
    title = trimTitle(title)
    if (!validateUrl() || !validateTags()) {
      return
    }

    const entry = $bookmarks.data[url]
    if (entry) {
      entry.tags = tagsArray
      if (title) {
        entry.meta.title = title
      } else {
        delete entry.meta.title
      }
      entry.meta.updated = Date.now()
      bookmarks.set($bookmarks)
      close()
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

  function reset() {
    // 重置表单
    url = title = tags = error = tagError = ''
  }

  function close() {
    show = false

    // 因为 onblur 事件发生时会校验，所以需要延迟重置表单
    setTimeout(reset)
    setTimeout(reset, 300)
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
      initFocusTrap(modalElement)
      document.addEventListener('keydown', handleKeydown)
      document.getElementById('url-input').focus()
    } else {
      lastUrl = undefined
      document.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

{#if show}
  <div
    role="dialog"
    aria-label="添加新书签对话框"
    bind:this={modalElement}
    tabindex="0"
    class="fixed inset-0 z-50 flex h-[100vh] items-center justify-center bg-black/50 dark:bg-gray-900/90">
    <div
      class="w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-2xl dark:bg-gray-800">
      <h3>添加新书签</h3>
      <div class="flex flex-col gap-2">
        <label for="url-input">URL: </label>
        <input
          id="url-input"
          type="text"
          bind:value={url}
          onblur={() => setTimeout(validateUrl, 200)}
          placeholder="https://example.com"
          class="rounded border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:focus:border-blue-600 dark:focus:ring-blue-600 {error
            ? 'border-red-500 ring-red-500'
            : ''}" />
        {#if error}
          <div
            out:fade={{ duration: 200 }}
            class="mt-1 text-sm text-red-500 dark:text-red-400">
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
          disabled={!url}
          class="rounded border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:focus:border-blue-600 dark:focus:ring-blue-600 {!url
            ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700/20'
            : ''}" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="tags-input">标签（逗号分隔）: </label>
        <input
          id="tags-input"
          type="text"
          bind:value={tags}
          disabled={!url}
          onblur={validateTags}
          placeholder="工作,技术,重要"
          class="rounded border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:focus:border-blue-600 dark:focus:ring-blue-600 {!url
            ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700/20'
            : ''} {tagError ? 'border-red-500 ring-red-500' : ''}" />
        {#if tagError}
          <div
            out:fade={{ duration: 200 }}
            class="mt-1 text-sm text-red-500 dark:text-red-400">
            {tagError}
          </div>
        {/if}
      </div>
      <div class="form-actions">
        <button
          class="rounded bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white transition-all hover:from-blue-600 hover:to-blue-700 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
          onclick={addBookmark}>保存</button>
        <button
          class="rounded border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/30"
          onclick={close}>取消</button>
      </div>
    </div>
  </div>
{/if}
