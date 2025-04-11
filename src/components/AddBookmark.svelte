<script>
  import { splitTags, trimTitle } from 'utags-utils'
  import { bookmarks, checkBookmarksDataReady } from '../stores.ts'
  import Modal from './Modal.svelte'
  import InputField from './ui/InputField.svelte'
  import BaseInputField from './ui/BaseInputField.svelte'

  let { show = $bindable(false) } = $props()

  let url = $state('')
  let title = $state('')
  let tags = $state('')
  let tagsArray = $state([])
  let error = $state('')
  let tagError = $state('')
  let lastUrl = undefined

  function validateUrl() {
    if (!url) {
      return false
    }
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
    } else {
      $bookmarks.data[url] = {
        tags: tagsArray,
        meta: {
          updated: Date.now(),
          created: Date.now(),
          ...(title && { title }),
        },
      }
    }

    console.log('addBookmark', $bookmarks.data[url])

    bookmarks.set($bookmarks)
    close()
    // 是否应该显示全部书签？当前筛选结果可能不会显示新添加的书签或修改的书签。如果显示全部书签，当前筛选条件会被重置。
    // location.hash = '#'
  }

  function reset() {
    // 重置表单
    url = title = tags = error = tagError = ''
    lastUrl = undefined
  }

  function close() {
    show = false

    // 因为 onblur 事件发生时会校验，所以需要延迟重置表单
    setTimeout(reset)
    setTimeout(reset, 300)
  }
</script>

<Modal
  title="添加新书签"
  isOpen={show}
  onOpen={() => {
    document.getElementById('url-input')?.focus()
  }}
  onClose={close}
  onInputEnter={addBookmark}
  onConfirm={addBookmark}
  disableConfirm={!url || !tags}
  confirmText="保存">
  <InputField
    id="url-input"
    bind:value={url}
    placeholder="https://example.com"
    {error}
    onBlur={() => setTimeout(validateUrl, 200)}>
    URL:
  </InputField>
  <BaseInputField
    id="title-input"
    bind:value={title}
    disabled={!url}
    placeholder="输入标题（可选）">
    标题:
  </BaseInputField>
  <InputField
    id="tags-input"
    bind:value={tags}
    placeholder="工作,技术,重要"
    disabled={!url}
    error={tagError}
    onInput={() => (tagError = '')}
    onBlur={validateTags}>
    标签（逗号分隔）:
  </InputField>
</Modal>
