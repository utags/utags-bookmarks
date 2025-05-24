<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import {
    $ as _$,
    addClass,
    addEventListener,
    extendHistoryApi,
    removeClass,
    removeEventListener,
  } from 'browser-extension-utils'
  import Console from 'console-tagger'
  import { getLocale } from './paraglide/runtime'
  import {
    cleanFilterString,
    getHostName,
    transformCollectionPathToQueryParams,
    convertCollectionToFilterParams,
  } from './utils/url-utils.js'
  import { sortBookmarks } from './utils/sort-bookmarks.js'
  import { filterBookmarksByUrlParams } from './utils/filter-bookmarks.js'
  import type {
    BookmarkKeyValuePair,
    TagHierarchyItem,
  } from './types/bookmarks.js'
  import {
    getTagCounts,
    getDomainCounts,
    getHierachyTags,
  } from './utils/bookmarks.js'
  import { batchDeleteBookmarks } from './utils/bookmark-actions.js'
  import appConfig from './config/app-config.js'
  import { HASH_DELIMITER } from './config/constants.js'
  import * as m from './paraglide/messages'
  import Header from './components/Header.svelte'
  import NavigationSidebar from './components/NavigationSidebar.svelte'
  import AddBookmark from './components/AddBookmark.svelte'
  import BookmarkList from './components/BookmarkList.svelte'
  import CompositeFilters from './components/CompositeFilters.svelte'
  import BatchTagAddModal from './components/BatchTagAddModal.svelte'
  import BatchTagRemoveModal from './components/BatchTagRemoveModal.svelte'
  import ConfirmModal from './components/ConfirmModal.svelte'

  import Toolbar from './components/Toolbar.svelte'
  import { settings, bookmarks, exportData } from './stores/stores.js'
  import initializeStores from './stores/initialize-stores.js'
  import { BookmarkService } from './services/bookmark-service.js'

  const console = new Console({
    prefix: 'app',
    color: { line: 'white', background: 'red' },
  })

  initializeStores()

  document.documentElement.lang = getLocale()

  const bookmarkService = BookmarkService.getInstance()
  // bookmarkService.setApiBaseUrl('https://utags.link/utags-public-collections')
  bookmarkService.setApiBaseUrl('https://api.utags.link')
  bookmarkService.setApiSuffix('json')

  let store = $state(bookmarkService.getStore())
  let baseFilterSearchParams = $state('')
  let bookmarksArray = $derived(
    $store.data ? Object.entries($store.data) : $store
  ) as BookmarkKeyValuePair[]

  let originalBookmarks: BookmarkKeyValuePair[] = $derived(
    filterBookmarksByUrlParams(bookmarksArray, baseFilterSearchParams)
  )
  let tagHierarchyItems: TagHierarchyItem[] = $derived(
    getHierachyTags(originalBookmarks)
  )
  const bookmarksInitializedHandler = () => {
    // console.log('bookmarks initialized')
    // 触发状态更新
    // $bookmarks = $bookmarks
    // originalBookmarks = filterBookmarksByUrlParams(
    //   Object.entries($bookmarks.data),
    //   location.search
    // )
    // tagHierarchyItems = getHierachyTags(originalBookmarks)
  }

  let showAddBookmarkModal = $state(false)
  let filterComponentsCount = $state(1)
  let filteredBookmarks1 = $state([])
  let filteredBookmarks2 = $state([])
  let filteredBookmarks3 = $state([])
  let useLevel2 = $state(false)
  let showLevel2 = $derived(filterComponentsCount >= 2 || useLevel2)
  let useLevel3 = $state(false)
  let showLevel3 = $derived(filterComponentsCount >= 3 || useLevel3)
  let timeoutId
  let filteredBookmarks = $state([])

  let filterStringLevel1 = $state('')
  let filterStringLevel2 = $state('')
  let filterStringLevel3 = $state('')
  let editBookmarkData = $state(null)
  let sharedStatus = $state({
    isViewingDeleted: false,
    isViewingSharedCollection: false,
    locationSearchString: '',
  })

  setContext('sharedStatus', sharedStatus)

  function locationChangeHandler() {
    console.log(
      '>>>>>> location changed',
      globalThis.lastHash !== location.hash,
      location.href
    )

    let internalSearchString = location.search
    const newUrl = transformCollectionPathToQueryParams(location.href)
    if (newUrl !== location.href) {
      if (appConfig.preferQueryString) {
        console.log('location change, updating url')
        history.replaceState({}, '', newUrl)
        return
      }
      const internalUrl = new URL(newUrl)
      internalSearchString = internalUrl.search
    }

    if (location.search !== sharedStatus.locationSearchString) {
      sharedStatus.locationSearchString = location.search
    }

    const urlParams = new URLSearchParams(internalSearchString)
    const collectionId = urlParams.get('collection') || ''
    const visibility = urlParams.get('v') || undefined // 'shared', 'public', 'private'
    if (
      collectionId !== bookmarkService.getCollectionId() ||
      visibility !== bookmarkService.getVisibility()
    ) {
      console.log(
        'collection changed, updating bookmarks:',
        collectionId,
        visibility
      )
      bookmarkService.initializeStore(collectionId, visibility)
      store = bookmarkService.getStore()
      sharedStatus.isViewingDeleted = collectionId === 'deleted'
      sharedStatus.isViewingSharedCollection = bookmarkService.isShared()
      console.log(
        'collection changed: sharedStatus',
        $state.snapshot(sharedStatus)
      )
    }

    if (internalSearchString) {
      const urlParams = convertCollectionToFilterParams(
        new URLSearchParams(internalSearchString)
      )

      console.log('urlParams', urlParams.toString())
      baseFilterSearchParams = urlParams.toString()
    } else {
      baseFilterSearchParams = ''
    }

    console.log('location.href', location.href)

    if (globalThis.lastHash !== location.hash) {
      console.log(
        'last hash:',
        `[${decodeURIComponent(globalThis.lastHash)}]`,
        '\n       new hash:',
        `[${decodeURIComponent(location.hash)}]`
      )

      const filterStringArr = location.hash.split(HASH_DELIMITER)
      const _filterStringLevel1 = cleanFilterString(filterStringArr[1])
      // Invalid hash, clear it
      if (location.hash && !_filterStringLevel1) {
        history.replaceState({}, '', '#')
        return
      }

      globalThis.lastHash = location.hash

      filterStringLevel1 = _filterStringLevel1
      filterStringLevel2 = cleanFilterString(filterStringArr[2])
      filterStringLevel3 = cleanFilterString(filterStringArr[3])
      console.log(`multi-level filter strings:`, [
        filterStringLevel1,
        filterStringLevel2,
        filterStringLevel3,
      ])
    }
  }

  function updateFilterComponentsCount() {
    const asideAreaWidth = _$('.aside-area').offsetWidth
    const compositeFiltersWidth = _$('.composite-filters').offsetWidth

    filterComponentsCount = Math.round(asideAreaWidth / compositeFiltersWidth)
  }

  function windowResizeHandler() {
    const width = globalThis.innerWidth
    const height = globalThis.innerHeight
    // console.log(`window resized: ${width}x${height}`)

    updateFilterComponentsCount()
  }

  onMount(() => {
    console.log('onMount')
    // 使浏览器支持 locationchange 自定义事件
    if (!globalThis.locationchange) {
      globalThis.locationchange = true
      extendHistoryApi()
    }

    addEventListener(globalThis, 'locationchange', locationChangeHandler)
    addEventListener(globalThis, 'resize', windowResizeHandler)
    addEventListener(globalThis, 'sortByChanged', updateFilteredBookmarks)
    addEventListener(
      globalThis,
      'filterOutputChange',
      filterOutputChangeHandler
    )
    addEventListener(globalThis, 'ondblclickHeader', ondblclickHeaderHandler)
    addEventListener(
      globalThis,
      'bookmarksInitialized',
      bookmarksInitializedHandler
    )
    addEventListener(globalThis, 'bookmarksExport', bookmarksExportHandler)
    addEventListener(globalThis, 'editBookmark', editBookmarkHandler)

    bookmarkService.onUpdate(bookmarksUpdateHandler)

    // 初始化时触发一次
    locationChangeHandler()
    updateFilterComponentsCount()

    return () => {
      console.log('onDestroy - cleaning up')
      // 移除事件监听器
      removeEventListener(globalThis, 'locationchange', locationChangeHandler)
      removeEventListener(globalThis, 'resize', windowResizeHandler)
      removeEventListener(globalThis, 'sortByChanged', updateFilteredBookmarks)
      removeEventListener(
        globalThis,
        'filterOutputChange',
        filterOutputChangeHandler
      )
      removeEventListener(
        globalThis,
        'ondblclickHeader',
        ondblclickHeaderHandler
      )
      removeEventListener(
        globalThis,
        'bookmarksInitialized',
        bookmarksInitializedHandler
      )
      removeEventListener(globalThis, 'bookmarksExport', bookmarksExportHandler)
      removeEventListener(globalThis, 'editBookmark', editBookmarkHandler)

      bookmarkService.offUpdate(bookmarksUpdateHandler)

      // 清除定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      // 其他清理逻辑
      globalThis.lastHash = null
    }
  })

  function bookmarksUpdateHandler(event) {
    console.log('书签数据已更新:', event.detail)
    // 更新UI或执行其他操作
  }

  function updateFilteredBookmarks() {
    console.log('!!! updateFilteredBookmarks')

    let temp = [
      ...(useLevel3
        ? filteredBookmarks3
        : useLevel2
          ? filteredBookmarks2
          : filteredBookmarks1),
    ]

    const sortBy = $settings.sortBy
    if (sortBy) {
      console.log(`sort by:`, sortBy)
      temp = sortBookmarks(temp, sortBy, getLocale())
    }

    filteredBookmarks = temp

    setTimeout(() => {
      console.log(
        'scrollIntoView',
        useLevel2,
        useLevel3,
        document.querySelectorAll('.composite-filters').length
      )
      const selector = useLevel3
        ? '.aside-area .composite-filters-3'
        : useLevel2
          ? '.aside-area .composite-filters-2'
          : '.aside-area .composite-filters-1'
      const lastSidebar = _$(selector)
      console.log(lastSidebar)
      if (lastSidebar) {
        lastSidebar.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: $settings.sidebarPosition === 'right' ? 'start' : 'end',
        })
      }
    }, 10)
  }

  const filterOutputChangeHandler = (e) => {
    console.log('filterOutputChange', e.detail)
    if (timeoutId) {
      // console.log('filterOutputChange clearTimeout')
      clearTimeout(timeoutId)
      timeoutId = null
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      updateFilteredBookmarks()
    }, 1)

    const originalBookmarksLength = originalBookmarks.length
    const filteredBookmarks1Length = filteredBookmarks1.length
    const filteredBookmarks2Length = filteredBookmarks2.length
    const filteredBookmarks3Length = filteredBookmarks3.length

    // console.log(
    //   'filterOutputChange',
    //   originalBookmarksLength,
    //   filteredBookmarks1Length,
    //   filteredBookmarks2Length,
    //   showLevel2,
    //   filteredBookmarks3Length,
    //   showLevel3
    // )

    if (!showLevel2) {
      console.log('clear level 2, level 3')
      filteredBookmarks2 = []
      filteredBookmarks3 = []
    } else if (!showLevel3) {
      console.log('clear level 3')
      filteredBookmarks3 = []
    }
  }

  const stats = $derived({
    bookmarksCount: filteredBookmarks.length,
    tagsCount: new Set(filteredBookmarks.flatMap(([_, entry]) => entry.tags))
      .size,
    domainsCount: new Set(filteredBookmarks.map(([url, _]) => getHostName(url)))
      .size,
  })

  // 新增导入状态
  let importProgress = $state({
    current: 0,
    total: 0,
    stats: {
      newBookmarks: 0,
      newDomains: new Set(),
      newTags: new Set(),
    },
  })

  const bookmarksExportHandler = (event) => {
    const { type } = event.detail
    if (type === 'current') {
      exportData(Object.fromEntries(filteredBookmarks))
    } else if (type === 'all') {
      exportData()
    } else {
      console.error('Invalid export type:', type)
    }
  }

  $effect(() => {
    document.documentElement.dataset.theme = $settings.skin || 'skin1'
  })

  const ondblclickHeaderHandler = (e) => {
    // 自定义双击处理逻辑
    console.log('Header 被双击了，执行自定义操作')
    // add bookmark
    // scroll to top
    // start sync
    // start dino game
    // none
    setTimeout(() => {
      editBookmarkData = null
      showAddBookmarkModal = true
    }, 100)
  }

  const editBookmarkHandler = (e) => {
    console.log('editBookmarkHandler', e.detail)
    editBookmarkData = e.detail
    showAddBookmarkModal = true
  }

  let activeFilterLevel = $state(0) // 当前激活的筛选器级别
  const maxVisibleFilters = $derived(useLevel3 ? 3 : useLevel2 ? 2 : 1) // 最大可见筛选器数量

  function focusFilterLevel(level) {
    activeFilterLevel = level
    // // 确保相关筛选器已启用
    // if (level >= 2) useLevel2 = true
    // if (level >= 3) useLevel3 = true

    // 滚动到对应筛选器
    setTimeout(() => {
      const selector = `.composite-filters-${level}`
      const filterEl = _$(selector)
      if (filterEl) {
        // unset 'scroll-snap-align' while call scrollIntoView to fix Firefox issue
        addClass(_$('main'), 'onscroll')
        filterEl.focus()
        filterEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: $settings.sidebarPosition === 'right' ? 'end' : 'start',
        })
        setTimeout(() => {
          removeClass(_$('main'), 'onscroll')
        }, 200)
      }
    }, 50)
  }

  // Selection mode state
  let selectionMode = $state(false)
  let selectedBookmarkUrls = $state<string[]>([])
  let showBatchTagAddModal = $state(false)
  let showBatchTagRemoveModal = $state(false)
  let showBatchDeleteConfirmModal = $state(false)

  /**
   * Handle selection mode change from toolbar
   */
  function handleSelectionModeChange(event: CustomEvent) {
    console.log('Selection mode changed:', event.detail.selectionMode)
    selectionMode = event.detail.selectionMode
    if (!selectionMode) {
      selectedBookmarkUrls = []
    }
  }

  /**
   * Handle selection change from bookmark list
   */
  function handleSelectionChange(event: CustomEvent) {
    selectedBookmarkUrls = event.detail.selectedBookmarkUrls
  }

  /**
   * Handle batch tag edit request
   */
  function handleBatchTagEdit(event: CustomEvent) {
    // 这里将在后续实现批量标签编辑模态框
    console.log(
      'Batch tag edit requested for:',
      event.detail.selectedBookmarkUrls
    )
    // TODO: 显示批量标签编辑模态框
  }
  /**
   * Handle batch tag add event from BookmarkList
   * @param event - Custom event containing selected bookmark URLs
   */
  function handleBatchAddTag(event: CustomEvent) {
    selectedBookmarkUrls = event.detail.selectedBookmarkUrls
    showBatchTagAddModal = true
  }

  /**
   * Handle batch tag remove event from BookmarkList
   * @param event - Custom event containing selected bookmark URLs
   */
  function handleBatchRemoveTag(event: CustomEvent) {
    selectedBookmarkUrls = event.detail.selectedBookmarkUrls
    showBatchTagRemoveModal = true
  }

  /**
   * Handle batch bookmark delete event from BookmarkList
   * @param event - Custom event containing selected bookmark URLs
   */
  function handleBatchDeleteBookmarks(event: CustomEvent) {
    selectedBookmarkUrls = event.detail.selectedBookmarkUrls
    showBatchDeleteConfirmModal = true
  }

  /**
   * Delete selected bookmarks after confirmation
   */
  function confirmBatchDeleteBookmarks() {
    batchDeleteBookmarks(selectedBookmarkUrls, {
      skipConfirmation: true,
      actionType: 'batch-delete-bookmarks',
      onSuccess: (undoFn, deletedCount) => {
        if (deletedCount > 0) {
          // TODO:  showUndoNotification(`Deleted ${deletedCount} bookmarks`, undoFn);
          alert(m.BOOKMARKS_DELETED_SUCCESS({ count: deletedCount }))
        } else {
          // TODO: showNotification('No bookmarks were deleted');
          alert(m.BOOKMARKS_DELETION_NO_ITEMS())
        }
      },
    })

    // Close modal and reset selection
    showBatchDeleteConfirmModal = false
    selectedBookmarkUrls = []
  }
</script>

<main
  class="{$settings.sidebarPosition}-sidebar flex h-[100vh] flex-col overflow-hidden">
  <Header />
  <div class="container bg-white dark:bg-black">
    <NavigationSidebar {tagHierarchyItems} />
    <div class="filter-container flex flex-col px-5">
      <!-- 添加筛选器切换控制栏 -->
      <div
        class="filter-switcher flex h-11.25 flex-none items-center justify-end border-b border-(color:--seperator-line-color) bg-white/95 px-5 backdrop-blur-sm dark:bg-gray-900/95">
        <div class="flex flex-grow-1 items-center justify-end gap-2">
          {#each [1, 2, 3] as level}
            <button
              class={`rounded-md px-3 py-1 text-sm transition-colors ${
                activeFilterLevel === level && false
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              } ${level > maxVisibleFilters ? 'cursor-not-allowed opacity-50' : ''}`}
              onclick={() => focusFilterLevel(level)}
              disabled={level > maxVisibleFilters}>
              <span>{m.COMPOSITE_FILTERS_TITLE_LEVEL({ level })}</span>
            </button>
          {/each}
        </div>
      </div>
      <div class="aside-area">
        <CompositeFilters
          level={1}
          paused={importProgress.total > 0}
          active={activeFilterLevel === 1}
          filterString={filterStringLevel1}
          input={originalBookmarks}
          bind:output={filteredBookmarks1}
          bind:useNextLevel={useLevel2}
          onfocus={() => (activeFilterLevel = 1)} />

        {#if showLevel2 && importProgress.total === 0}
          <CompositeFilters
            level={2}
            disabled={!useLevel2}
            paused={importProgress.total > 0}
            active={activeFilterLevel === 2}
            filterString={filterStringLevel2}
            input={filteredBookmarks1}
            bind:output={filteredBookmarks2}
            bind:useNextLevel={useLevel3}
            onfocus={() => (activeFilterLevel = 2)} />

          {#if showLevel3}
            <CompositeFilters
              level={3}
              disabled={!useLevel3}
              paused={importProgress.total > 0}
              active={activeFilterLevel === 3}
              filterString={filterStringLevel3}
              input={filteredBookmarks2}
              bind:output={filteredBookmarks3}
              onfocus={() => (activeFilterLevel = 3)} />
          {/if}
        {/if}
      </div>
    </div>
    <div class="vertical-seperator-line"></div>
    <div class="content-area flex flex-col">
      <Toolbar {stats} on:selectionModeChange={handleSelectionModeChange} />
      <BookmarkList
        {filteredBookmarks}
        viewMode={$settings.viewMode}
        {selectionMode}
        on:selectionChange={handleSelectionChange}
        on:batchAddTag={handleBatchAddTag}
        on:batchRemoveTag={handleBatchRemoveTag}
        on:batchTagEdit={handleBatchTagEdit}
        on:batchDeleteBookmarks={handleBatchDeleteBookmarks} />
      <AddBookmark
        bind:show={showAddBookmarkModal}
        initialData={editBookmarkData} />
      <BatchTagAddModal
        {selectedBookmarkUrls}
        bind:isOpen={showBatchTagAddModal} />
      <BatchTagRemoveModal
        {selectedBookmarkUrls}
        bind:isOpen={showBatchTagRemoveModal} />
      <ConfirmModal
        title={m.CONFIRM_MODAL_TITLE_BATCH_DELETE_BOOKMARKS()}
        message={m.CONFIRM_MODAL_MESSAGE_BATCH_DELETE_BOOKMARKS({
          count: selectedBookmarkUrls.length,
        })}
        confirmText={m.DELETE_BUTTON_TEXT()}
        cancelText={m.MODAL_CANCEL_BUTTON()}
        bind:isOpen={showBatchDeleteConfirmModal}
        onConfirm={confirmBatchDeleteBookmarks} />
    </div>
  </div>
</main>

<style>
  :root {
    --seperator-line-color: #f6f3f4;
    --seperator-line: 1px solid var(--seperator-line-color);
    --container-justify-content: flex-start;
    --container-flex-direction: row;
    --navigation-sidebar-order: 0;
    --vertical-seperator-line-order: 0;
    --aside-area-order: 0;
    --aside-area-flex-direction: row;
    --aside-area-margin-left: -21px;
    --aside-area-margin-right: -20px;
    --aside-area-width: calc(var(--sidebar-width) * 2);
    --sidebar-width: max(280px, 12vw);
    --sidebar-border-left: var(--seperator-line);
    --sidebar-border-right: none;
    --sidebar-padding-left: 20px;
    --sidebar-padding-right: 20px;
    --sidebar-reset-filter-align-self: flex-end;
    --sidebar-scroll-snap-align: end;
    --main-background-color: #f6f8fc;
    --shadow-color: white;
    --content-margin-right: -20px;
    --bookmark-list-margin-right: 0;
    --filter-switcher-justify-content: flex-end;
  }

  .right-sidebar {
    --container-justify-content: flex-end;
    --container-flex-direction: row-reverse;
    --navigation-sidebar-order: 1;
    --vertical-seperator-line-order: 1;
    --aside-area-order: 2;
    --aside-area-flex-direction: row-reverse;
    --aside-area-margin-left: -20px;
    --aside-area-margin-right: -21px;
    --sidebar-border-left: none;
    --sidebar-border-right: var(--seperator-line);
    --sidebar-padding-left: 20px;
    --sidebar-padding-right: 20px;
    --sidebar-reset-filter-align-self: flex-start;
    --sidebar-scroll-snap-align: start;
    --content-margin-right: 0px;
    --bookmark-list-margin-right: 20px;
    --filter-switcher-justify-content: flex-end;
  }

  :root.dark {
    --main-background-color: #292a2d;
    --shadow-color: #000;
    --seperator-line-color: #364153;
  }

  .container {
    display: flex;
    flex-direction: var(--container-flex-direction);
    justify-content: var(--container-justify-content);
    /* gap: 20px; */
    /* max-width: min(calc(100vw - 100px), 1842px); */
    max-width: 100%;
    /* height: calc(100vh - 47px); */
    /* height: 100%; */
    margin: 0 auto;
    padding: 0 20px 0;
    position: relative;
    overflow: hidden;
    /* background-color: white; */
  }

  .filter-switcher {
    margin: 0 -20px;
  }

  .filter-switcher > div {
    flex-direction: var(--container-flex-direction);
    justify-content: var(--filter-switcher-justify-content);
  }

  .aside-area {
    /* background-color: #f1f5f9; */
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    flex-direction: var(--aside-area-flex-direction);
    width: var(--aside-area-width);
    min-width: var(--aside-area-width);
    /* gap: 20px; */
    /* order: var(--aside-area-order); */
    margin-left: var(--aside-area-margin-left);
    margin-right: var(--aside-area-margin-right);
    padding-bottom: var(--vertical-seperator-line-padding-bottom, 0px);
    padding-top: var(--vertical-seperator-line-padding-top, 0px);
    scroll-snap-type: x mandatory;
  }

  .vertical-seperator-line {
    width: 0px;
    height: calc(
      100% - var(--vertical-seperator-line-padding-bottom, 0px) -
        var(--vertical-seperator-line-padding-top, 0px)
    );
    border-right: none;
    border-left: var(--seperator-line);
    box-shadow: 0px -15px 15px 15px var(--shadow-color);
    display: block;
    /* z-index: 2; */
    /* order: var(--vertical-seperator-line-order); */
    align-self: var(--vertical-seperator-line-align-self);
  }

  .content-area {
    flex: 1;
    /* width: calc(100% - var(--aside-area-width) - 20px); */
    overflow: hidden;
    /* padding-top: 20px; */
    margin-right: var(--content-margin-right);
  }

  .toolbar {
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    /* border-bottom: 1px solid #f1f5f9; */
  }

  :root[data-theme='skin1'] {
    --sidebar-padding-top: 10px;
  }
  :root[data-theme='skin2'] {
    --vertical-seperator-line-padding-bottom: 20px;
    --vertical-seperator-line-align-self: flex-start;
    --sidebar-padding-top: 20px;
  }
  :root[data-theme='skin3'] {
    --vertical-seperator-line-padding-bottom: 20px;
    --vertical-seperator-line-padding-top: 20px;
    --vertical-seperator-line-align-self: center;
    --sidebar-padding-top: 0px;
  }

  @media (max-width: 1300px) {
    :root {
      --aside-area-width: var(--sidebar-width);
    }

    .filter-switcher button span {
      display: none;
    }
  }
  @media (min-width: 2100px) {
    :root {
      --aside-area-width: calc(var(--sidebar-width) * 3);
    }
  }
</style>
