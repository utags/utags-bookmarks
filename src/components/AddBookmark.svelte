<script>
  import { persisted } from 'svelte-persisted-store'
  export let show = false

  let url = ''
  let title = ''
  let tags = ''
  const bookmarks = persisted('utags', { data: {} })

  function addBookmark() {
    if (!url || !tags) return

    const newEntry = {
      tags: tags.split(',').map((t) => t.trim()),
      meta: {
        title,
        updated: Date.now(),
        created: Date.now(),
      },
    }

    $bookmarks.data[url] = newEntry
    bookmarks.set($bookmarks)

    // 重置表单
    url = title = tags = ''
    show = false
  }
</script>

{#if show}
  <div class="modal">
    <div class="modal-content">
      <h3>添加新书签</h3>
      <div class="form-group">
        <label for="url-input">URL：</label>
        <input
          id="url-input"
          type="text"
          bind:value={url}
          placeholder="https://example.com" />
      </div>
      <div class="form-group">
        <label for="title-input">标题：</label>
        <input id="title-input" type="text" bind:value={title} />
      </div>
      <div class="form-group">
        <label for="tags-input">标签（逗号分隔）：</label>
        <input
          id="tags-input"
          type="text"
          bind:value={tags}
          placeholder="工作,技术,重要" />
      </div>
      <div class="form-actions">
        <button class="primary" on:click={addBookmark}>保存</button>
        <button on:click={() => (show = false)}>取消</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 400px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .form-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
</style>
