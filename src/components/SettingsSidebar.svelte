<script>
  import { onMount } from 'svelte'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  import { $ as _$ } from 'browser-extension-utils'
  import { initFocusTrap } from 'focus-trap-lite'
  import { settings } from '../stores.ts'

  let { showSettings = $bindable() } = $props()

  $effect(() => {
    if (showSettings) {
      initFocusTrap(_$('.settings-sidebar'))
    }
  })

  onMount(() => {
    const keydownHandler = (event) => {
      if (showSettings) {
        if (event.key === 'Escape') {
          showSettings = false
        }
      }
    }

    document.addEventListener('keydown', keydownHandler)
    return () => document.removeEventListener('keydown', keydownHandler)
  })

  $effect(() => {
    const position = $settings.sidebarPosition
    setTimeout(() => {
      document.querySelector('.aside-area aside:last-of-type')?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: position === 'right' ? 'start' : 'end',
      })
    }, 10)
  })
</script>

{#if showSettings}
  <div
    class="dimmed-layer fixed inset-0 z-[90] bg-white/50 transition-colors dark:bg-gray-800/50"
    onclick={(e) => {
      if (e.target === e.currentTarget) {
        showSettings = false
      }
    }}
    onkeydown={(event) => {
      if (event.key === 'Escape') {
        showSettings = false
      }
    }}
    tabindex="-1"
    role="button"
    aria-label="关闭设置侧边栏">
    <div
      class="settings-sidebar absolute inset-y-0 right-0 z-[100] w-96 bg-white/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 dark:bg-gray-800/95"
      class:translate-x-0={showSettings}
      class:translate-x-full={!showSettings}>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          设置
        </h2>
        <button
          class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onclick={() => (showSettings = false)}
          aria-label="关闭设置侧边栏">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        class="flex max-h-[calc(100vh-8rem)] flex-col gap-y-10 overflow-y-auto pr-3">
        <div class="setting-group gap-y-6">
          <h3
            class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            界面设置
          </h3>
          <div class="gap-y-4">
            <div class="flex items-center justify-between px-1 py-1.5">
              <span class="text-gray-700 dark:text-gray-300">主题</span>
              <ThemeSwitcher type="button" />
            </div>
          </div>
          <div class="gap-y-4">
            <div class="flex items-center justify-between px-1 py-1.5">
              <span class="text-gray-700 dark:text-gray-300">筛选栏位置</span>
              <div
                class="flex gap-2 rounded-lg bg-gray-100 p-1 shadow-inner dark:bg-gray-700/90 dark:shadow-gray-900/30">
                <label class="flex-1">
                  <input
                    type="radio"
                    class="peer absolute h-0 w-0 opacity-0"
                    value="left"
                    bind:group={$settings.sidebarPosition} />
                  <span
                    class="block cursor-pointer rounded-md px-4 py-2 text-center text-sm transition-colors peer-checked:bg-white peer-checked:text-gray-800 dark:peer-checked:bg-gray-600 dark:peer-checked:text-gray-100">
                    左侧
                  </span>
                </label>
                <label class="flex-1">
                  <input
                    type="radio"
                    class="peer absolute h-0 w-0 opacity-0"
                    value="right"
                    bind:group={$settings.sidebarPosition} />
                  <span
                    class="block cursor-pointer rounded-md px-4 py-2 text-center text-sm transition-colors peer-checked:bg-white peer-checked:text-gray-800 dark:peer-checked:bg-gray-600 dark:peer-checked:text-gray-100">
                    右侧
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 新增数据管理分组 -->
        <div class="setting-group gap-y-6">
          <h3
            class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            数据管理
          </h3>
          <div class="gap-y-4">
            <div class="flex items-center justify-between px-1 py-1.5">
              <button
                class="flex items-center gap-3 text-gray-700 hover:text-blue-600 dark:text-gray-300"
                onclick={importData}>
                <span>📥 导入数据</span>
              </button>
            </div>
            <div class="flex items-center justify-between px-1 py-1.5">
              <button
                class="flex items-center gap-3 text-gray-700 hover:text-blue-600 dark:text-gray-300"
                onclick={exportData}>
                <span>📤 导出数据</span>
              </button>
            </div>
            <div class="flex items-center justify-between px-1 py-1.5">
              <button
                class="flex items-center gap-3 text-red-600 hover:text-red-700 dark:text-red-400"
                onclick={clearAll}>
                <span>🗑️ 清空数据</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 新增关于分组 -->
        <div class="setting-group gap-y-6">
          <h3
            class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            关于
          </h3>
          <div class="gap-y-4">
            <div class="flex items-center justify-between px-1 py-1.5">
              <div
                class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span>版本号</span>
              </div>
              <span class="text-gray-500 dark:text-gray-400"
                >v{__APP_VERSION__}</span>
            </div>
            <div class="flex items-center justify-between px-1 py-1.5">
              <a
                href="https://github.com/utags/utags"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-gray-700 hover:text-blue-600 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M15 22v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 22v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>GitHub 仓库</span>
              </a>
            </div>
            <div class="flex items-center justify-between px-1 py-1.5">
              <a
                href="https://github.com/utags/utags/issues"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-gray-700 hover:text-blue-600 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18h0" />
                </svg>
                <span>报告问题</span>
              </a>
            </div>
            <div class="flex items-center justify-between px-1 py-1.5">
              <a
                href="https://github.com/utags/utags-bookmarks?tab=readme-ov-file#-development-roadmap"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-gray-700 hover:text-blue-600 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <span>开发路线图</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style global>
  .settings-sidebar {
    border-left: 1px solid rgba(0, 0, 0, 0.06);
  }

  :root.dark .settings-sidebar {
    border-left-color: rgba(255, 255, 255, 0.1);
  }
</style>
