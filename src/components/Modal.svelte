<script>
  import { initFocusTrap } from 'focus-trap-lite'
  let { children, title = '', isOpen = $bindable(false), onOpen } = $props()
  let modalElement = $state()

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      isOpen = false
    }
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown)
      initFocusTrap(modalElement)
      if (typeof onOpen === 'function') {
        onOpen()
      }
    }
    return () => document.removeEventListener('keydown', handleKeydown)
  })
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
    role="dialog"
    aria-modal="true"
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
