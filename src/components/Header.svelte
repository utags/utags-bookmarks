<script lang="ts">
  import { settings } from '../stores'
  import { viewModes } from '../config/viewModes'
  import { sortOptions } from '../config/sortOptions'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  import SettingsSidebar from './SettingsSidebar.svelte'
  import DropdownMenu from './DropdownMenu.svelte'

  let {
    collapsed = false,
    showAddModal = $bindable(),
    skin = $bindable(),
  } = $props()

  let showSettings = $state(false)
  let viewModeOpen = $state(false)
  let sortByOpen = $state(false)
  let addMenuOpen = $state(false)
</script>

<div
  class="header fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-(color:--seperator-line-color) bg-white px-4 shadow-sm dark:bg-black">
  <!-- 桌面端导航 -->
  <div class="hidden md:flex md:items-center md:gap-6">
    <span
      class="logo-text bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-xl font-bold text-transparent"
      >UTags</span>
  </div>

  <!-- 移动端汉堡菜单 -->
  <div class="md:hidden">
    <button class="hamburger p-2" onclick={() => (collapsed = !collapsed)}>
      {collapsed ? '☰' : '✕'}
    </button>
  </div>

  <!-- 移动端下拉菜单 -->
  {#if !collapsed}
    <div
      class="absolute top-16 right-0 left-0 z-50 border-b border-(color:--seperator-line-color) bg-white/90 shadow-md md:hidden dark:bg-black/90">
      <div class="flex h-full flex-col gap-2 p-4" style="height: 100vh;">
        手机版还没有优化，暂时无法使用
      </div>
    </div>
  {/if}

  <!-- 右侧工具区 -->
  <div class="flex items-center gap-2">
    <!-- 添加按钮 -->
    <div class="relative">
      <button
        class="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="添加"
        onclick={() => {
          if (!addMenuOpen) {
            setTimeout(() => {
              addMenuOpen = true
            })
          }
        }}>
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
            d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      <DropdownMenu
        bind:open={addMenuOpen}
        items={[
          { value: 'addBookmark', label: '添加书签' },
          { value: 'saveFilter', label: '收藏当前筛选器' },
        ]}
        selectedValue=""
        onSelect={(value) => {
          if (value === 'addBookmark') {
            showAddModal = true
          } else if (value === 'saveFilter') {
            // 这里添加收藏筛选器的逻辑
          }
          addMenuOpen = false
        }}
        width="w-40" />
    </div>

    <div class="hidden items-center gap-2">
      <span class="text-sm text-gray-700 dark:text-gray-200">排序方式: </span>
      <div class="flex gap-1 rounded-md bg-gray-100 p-1 dark:bg-gray-800">
        <label
          class="cursor-pointer rounded-md px-3 py-1.5 transition-colors {$settings.sortBy ===
          'updated'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}">
          <input
            type="radio"
            name="sort-by"
            value="updated"
            checked={$settings.sortBy === 'updated'}
            class="hidden"
            onchange={() => {
              $settings.sortBy = 'updated'
              window.dispatchEvent(new CustomEvent('sortByChanged'))
            }} />
          <span class="text-sm">更新时间</span>
        </label>
        <label
          class="cursor-pointer rounded-md px-3 py-1.5 transition-colors {$settings.sortBy ===
          'created'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}">
          <input
            type="radio"
            name="sort-by"
            value="created"
            checked={$settings.sortBy === 'created'}
            class="hidden"
            onchange={() => {
              $settings.sortBy = 'created'
              window.dispatchEvent(new CustomEvent('sortByChanged'))
            }} />
          <span class="text-sm">创建时间</span>
        </label>
      </div>
    </div>

    <!-- 排序方式按钮 -->
    <div class="relative">
      <button
        class="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="排序方式"
        onclick={() => {
          if (!sortByOpen) {
            setTimeout(() => {
              sortByOpen = true
            })
          }
        }}>
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
            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
      </button>

      <DropdownMenu
        bind:open={sortByOpen}
        items={sortOptions}
        selectedValue={$settings.sortBy}
        onSelect={(value) => {
          $settings.sortBy = value
          window.dispatchEvent(new CustomEvent('sortByChanged'))
        }}
        width="w-32" />
    </div>

    <!-- 视图模式按钮 -->
    <div class="relative">
      <button
        class="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="视图模式"
        onclick={() => {
          if (!viewModeOpen) {
            setTimeout(() => {
              viewModeOpen = true
            })
          }
        }}>
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
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      </button>

      <DropdownMenu
        bind:open={viewModeOpen}
        items={viewModes}
        selectedValue={$settings.viewMode}
        onSelect={(value) => ($settings.viewMode = value)} />
    </div>

    <div class="flex hidden items-center gap-2">
      <span class="text-sm text-gray-700 dark:text-gray-200">主题: </span>
      <select
        class="rounded-md bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        bind:value={skin}>
        <option value="skin1">skin1</option>
        <option value="skin2">skin2</option>
        <option value="skin3">skin3</option>
        <option value="skin4">skin4</option>
      </select>
    </div>
    <button
      class="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="设置"
      onclick={() => {
        showSettings = true
      }}>
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
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    </button>
  </div>
  <SettingsSidebar bind:showSettings />
  <div class="for-init-theme-switcher hidden"><ThemeSwitcher /></div>
</div>

<style>
  @media (max-width: 768px) {
    .hamburger {
      font-size: 1.5rem;
      line-height: 1;
    }
  }
</style>
