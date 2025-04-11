<script lang="ts">
  import { hasClass } from 'browser-extension-utils'
  import { settings } from '../stores/stores'
  import { appConfig } from '../config/app-config'
  import { viewModes } from '../config/view-modes'
  import { sortOptions } from '../config/sort-options'
  import { themeOptions } from '../config/theme-options'
  import ThemeSwitcher from './ThemeSwitcher.svelte'
  import SettingsSidebar from './SettingsSidebar.svelte'
  import DropdownMenu from './DropdownMenu.svelte'
  import AddIcon from './svg/AddIcon.svelte'
  import SortIcon from './svg/SortIcon.svelte'
  import ViewModeIcon from './svg/ViewModeIcon.svelte'
  import SettingsIcon from './svg/SettingsIcon.svelte'
  import ThemeIcon from './svg/ThemeIcon.svelte'
  import FilterListIcon from './svg/FilterListIcon.svelte'
  import {
    LayoutList,
    PanelLeftOpen,
    PanelLeftClose,
    ListTodo,
    ArrowDown01,
    ArrowDown10,
    ArrowDownAZ,
    ArrowDownZA,
  } from 'lucide-svelte'

  let { collapsed = false, showAddModal = $bindable() } = $props()

  let showSettings = $state(false)
  let viewModeOpen = $state(false)
  let sortByOpen = $state(false)
  let addMenuOpen = $state(false)
  let themeOpen = $state(false)
</script>

<div
  class="header z-50 flex h-11.75 flex-none items-center justify-between border-b border-(color:--seperator-line-color) bg-white px-5 shadow-sm dark:bg-black dark:shadow-gray-900/30"
  role="banner"
  ondblclick={(event) => {
    if (hasClass(event.target as HTMLElement, 'header')) {
      window.dispatchEvent(new CustomEvent('ondblclickHeader'))
    }
  }}>
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
    {#if $settings.headerToolbarSettings.addButton}
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
    {/if}

    <!-- 添加导航栏切换按钮 -->
    <button
      class="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="切换导航栏"
      onclick={() => {
        $settings.navigationSidebarCollapsed =
          !$settings.navigationSidebarCollapsed
      }}>
      {#if $settings.navigationSidebarCollapsed}
        <PanelLeftOpen size={22} absoluteStrokeWidth={true} strokeWidth={1.5} />
      {:else}
        <PanelLeftClose
          size={22}
          absoluteStrokeWidth={true}
          strokeWidth={1.5} />
      {/if}
    </button>

    {#if $settings.headerToolbarSettings.sidebarPosition}
      <div
        class="flex gap-2 rounded-lg bg-gray-100 p-1 shadow-inner dark:bg-gray-700/90 dark:shadow-gray-900/30">
        <label class="flex-1">
          <input
            type="radio"
            class="peer absolute h-0 w-0 opacity-0"
            value="left"
            bind:group={$settings.sidebarPosition} />

          <span
            class="block cursor-pointer rounded-md px-4 py-1.5 text-center text-sm transition-colors peer-checked:bg-white peer-checked:text-gray-800 dark:peer-checked:bg-gray-600 dark:peer-checked:text-gray-100">
            左
          </span>
        </label>
        <label class="flex-1">
          <input
            type="radio"
            class="peer absolute h-0 w-0 opacity-0"
            value="right"
            bind:group={$settings.sidebarPosition} />
          <span
            class="block cursor-pointer rounded-md px-4 py-1.5 text-center text-sm transition-colors peer-checked:bg-white peer-checked:text-gray-800 dark:peer-checked:bg-gray-600 dark:peer-checked:text-gray-100">
            右
          </span>
        </label>
      </div>
    {/if}

    {#if $settings.headerToolbarSettings.sortBy}
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
    {/if}

    {#if $settings.headerToolbarSettings.viewMode}
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
          <LayoutList size={20} />
        </button>

        <DropdownMenu
          bind:open={viewModeOpen}
          items={viewModes}
          selectedValue={$settings.viewMode}
          onSelect={(value) => ($settings.viewMode = value)} />
      </div>
    {/if}

    {#if $settings.headerToolbarSettings.skin}
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
    {/if}

    <div class="flex" class:hidden={!$settings.headerToolbarSettings.theme}>
      <ThemeSwitcher type="button" />
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
</div>

<style>
  @media (max-width: 768px) {
    .hamburger {
      font-size: 1.5rem;
      line-height: 1;
    }
  }
</style>
