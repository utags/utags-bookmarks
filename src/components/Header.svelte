<script lang="ts">
  import { settings } from '../stores'
  import { appConfig } from '../config/appConfig'
  import { viewModes } from '../config/viewModes'
  import { sortOptions } from '../config/sortOptions'
  import { themeOptions } from '../config/themeOptions'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  import SettingsSidebar from './SettingsSidebar.svelte'
  import DropdownMenu from './DropdownMenu.svelte'
  import AddIcon from './svg/AddIcon.svelte'
  import SortIcon from './svg/SortIcon.svelte'
  import ViewModeIcon from './svg/ViewModeIcon.svelte'
  import SettingsIcon from './svg/SettingsIcon.svelte'
  import ThemeIcon from './svg/ThemeIcon.svelte'

  let { collapsed = false, showAddModal = $bindable() } = $props()

  let showSettings = $state(false)
  let viewModeOpen = $state(false)
  let sortByOpen = $state(false)
  let addMenuOpen = $state(false)
  let themeOpen = $state(false)
</script>

<div
  class="header fixed top-0 right-0 left-0 z-50 flex h-12 items-center justify-between border-b border-(color:--seperator-line-color) bg-white px-5 shadow-xs dark:bg-black">
  <!-- 桌面端导航 -->
  <div class="hidden md:flex md:items-center md:gap-6">
    <a href="/" class="flex items-center gap-2 hover:opacity-80">
      <img src="/logo.svg" alt="UTags Logo" class="h-8 w-8" />
      <span
        class="logo-text text-xl font-bold text-gray-800 dark:text-gray-200">
        {appConfig.title}
      </span>
    </a>
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
        <AddIcon />
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
            window.dispatchEvent(new CustomEvent('clickShowSaveFilterModal'))
          }
          addMenuOpen = false
        }}
        width="w-40" />
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
        <SortIcon />
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
        <ViewModeIcon />
      </button>

      <DropdownMenu
        bind:open={viewModeOpen}
        items={viewModes}
        selectedValue={$settings.viewMode}
        onSelect={(value) => ($settings.viewMode = value)} />
    </div>

    <!-- 主题选择按钮 -->
    <div class="relative">
      <button
        class="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="主题选择"
        onclick={() => {
          if (!themeOpen) {
            setTimeout(() => {
              themeOpen = true
            })
          }
        }}>
        <ThemeIcon />
      </button>

      <DropdownMenu
        bind:open={themeOpen}
        items={themeOptions}
        selectedValue={$settings.skin}
        onSelect={(value) => ($settings.skin = value)}
        width="w-50" />
    </div>
    <!-- 设置按钮 -->
    <button
      class="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="设置"
      onclick={() => {
        showSettings = true
      }}>
      <SettingsIcon />
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
