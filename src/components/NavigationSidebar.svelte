<script>
  import {
    ChevronDown,
    ChevronRight,
    Bookmark,
    Tag,
    List,
    Clock,
    Star,
    Globe,
    Folder,
    PanelLeftOpen,
    PanelLeftClose,
  } from 'lucide-svelte'
  import { settings } from '../stores/stores'
  import SavedFilters from './SavedFilters.svelte'

  // 导航组数据结构
  // 所有书签
  // 常用书签
  // 稍后阅读
  // 工作
  // 学习
  // 生活
  // 娱乐
  // 摸鱼
  // 工具
  // 影视
  // 最近收藏 （7天，30天，1年）
  // 最近更新 （7天，30天，1年）
  // 最近访问 （7天，30天，1年）
  // 已删除
  // 标签页
  // 隐藏的书签
  // 文件夹
  // 自定义文件夹
  let navGroups = $state([
    {
      title: '书签管理',
      icon: 'bookmark',
      items: [
        { name: '所有书签', icon: 'list' },
        { name: '最近添加', icon: 'clock' },
        { name: '常用书签', icon: 'star' },
      ],
      open: true,
    },
    {
      title: '分类管理',
      icon: 'tag',
      items: [
        { name: '标签', icon: 'tag' },
        { name: '域名', icon: 'globe' },
        { name: '分类', icon: 'folder' },
      ],
      open: false,
    },
  ])

  let isCollapsed = $derived($settings.navigationSidebarCollapsed ?? false)

  function toggleGroup(index) {
    navGroups[index].open = !navGroups[index].open
  }

  function toggleSidebar() {
    $settings.navigationSidebarCollapsed = !$settings.navigationSidebarCollapsed
  }
</script>

<aside
  class="navigation-sidebar z-49 h-full w-[var(--sidebar-width)] overflow-x-hidden overflow-y-auto bg-white pt-4 pr-2 pb-10 transition-all duration-200 ease-in-out select-none dark:bg-gray-900"
  class:collapsed={isCollapsed}>
  {#if !isCollapsed}
    <nav class="flex w-[calc(var(--sidebar-width)-11px)] flex-col gap-1">
      {#each navGroups as group, i}
        <div class="group">
          <div
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            onclick={() => toggleGroup(i)}
            onkeydown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && toggleGroup(i)}
            role="button"
            tabindex="0">
            <span class="h-5 w-5">
              {#if group.icon === 'bookmark'}
                <Bookmark size={20} />
              {:else if group.icon === 'tag'}
                <Tag size={20} />
              {/if}
            </span>
            <span class="flex-1 text-left">{group.title}</span>
            {#if group.open}
              <ChevronDown size={16} />
            {:else}
              <ChevronRight size={16} />
            {/if}
          </div>

          {#if group.open}
            <div class="mt-1 ml-3 flex flex-col gap-1">
              {#each group.items as item}
                <a
                  href="#"
                  class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <span class="h-4 w-4">
                    {#if item.icon === 'list'}
                      <List size={16} />
                    {:else if item.icon === 'clock'}
                      <Clock size={16} />
                    {:else if item.icon === 'star'}
                      <Star size={16} />
                    {:else if item.icon === 'globe'}
                      <Globe size={16} />
                    {:else}
                      <Folder size={16} />
                    {/if}
                  </span>
                  <span>{item.name}</span>
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
      <SavedFilters />
    </nav>
  {/if}

  <button
    class="fixed bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-1 text-gray-600 shadow-sm transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
    onclick={toggleSidebar}>
    {#if isCollapsed}
      <PanelLeftOpen size={24} absoluteStrokeWidth={true} strokeWidth={1} />
    {:else}
      <PanelLeftClose size={24} absoluteStrokeWidth={true} strokeWidth={1} />
    {/if}
  </button>
</aside>

<style>
  .navigation-sidebar {
    --sidebar-width: 260px;
    position: relative;
    order: var(--navigation-sidebar-order);
    border-right: var(--seperator-line);
  }

  .navigation-sidebar.collapsed {
    width: 0;
    min-width: 0;
    padding-right: 0;
  }
</style>
