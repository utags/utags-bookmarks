<script>
  import { onMount } from 'svelte'
  import { initFocusTrap } from 'focus-trap-lite'
  import { $ as _$ } from 'browser-extension-utils'
  let {
    children,
    title = '',
    isOpen = $bindable(false),
    onOpen,
    onClose = () => {},
    onInputEnter = () => {},
    cancelText = '取消',
    confirmText = '保存',
    onConfirm = () => {},
    disableConfirm = false,
  } = $props()
  let modalElement = $state()

  onMount(() => {
    return () => {
      isOpen = false
      if (modalElement) {
        modalElement.remove()
      }
    }
  })

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      isOpen = false
    } else if (event.key === 'Enter') {
      if (typeof onInputEnter === 'function') {
        onInputEnter()
      }
    }
  }

  $effect(() => {
    if (isOpen) {
      // Move modal to end of main element to prevent z-index conflicts
      _$('main').append(modalElement)
      document.addEventListener('keydown', handleKeydown)
      initFocusTrap(modalElement)
      if (typeof onOpen === 'function') {
        onOpen()
      }
    } else {
      if (typeof onClose === 'function') {
        onClose()
      }
    }
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    bind:this={modalElement}
    tabindex="-1">
    <div
      class="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
      <div class="rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200">
            {title}
          </h3>
          <button
            onclick={() => (isOpen = false)}
            class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            aria-label="关闭">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          {@render children?.()}
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/30"
            onclick={() => (isOpen = false)}>
            {cancelText}
          </button>
          <button
            class="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
            onclick={onConfirm}
            disabled={disableConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* 添加过渡动画 */
  div {
    transition: opacity 0.2s ease-in-out;
  }
</style>
