import { get } from 'svelte/store'
import { persisted, type Persisted } from 'svelte-persisted-store'
import Console from 'console-tagger'
import { initialBookmarks } from './data/initial-bookmarks.js'
import { initialBookmarks as initialBookmarksCN } from './data/initial-bookmarks-zh-CN.js'
import {
  STORAGE_KEY_BOOKMARKS,
  STORAGE_KEY_SETTINGS,
  STORAGE_KEY_FILTERS,
} from './constants.js'
import { type BookmarksStore } from './types/bookmarks.js'

const console = new Console({
  prefix: 'stores',
  color: { line: 'white', background: 'black' },
})

export const settings = persisted(STORAGE_KEY_SETTINGS, {
  theme: 'system',
  sortBy: 'updated',
  sidebarPosition: 'left',
  navigationSidebarCollapsed: false,
  viewMode: 'compact',
  skin: 'skin1',
  isFirstRun: true,
  lang: 'en',
  headerToolbarSettings: {
    theme: false,
    sortBy: true,
    sidebarPosition: false,
    viewMode: true,
    skin: true,
    addButton: true,
  },
})

if (!get(settings).headerToolbarSettings) {
  const $settings = get(settings)
  const headerToolbarSettings = {
    theme: false,
    sortBy: true,
    sidebarPosition: false,
    viewMode: true,
    skin: true,
    addButton: true,
  }
  settings.set({ ...$settings, headerToolbarSettings })
}

export const filters = persisted(STORAGE_KEY_FILTERS, [])

let isBookmarksDataReady = false

export function checkBookmarksDataReady() {
  if (!isBookmarksDataReady) {
    // eslint-disable-next-line no-alert
    alert('Bookmarks data is not ready yet.')
    throw new Error('Bookmarks data is not ready yet.')
  }
}

// 初始化书签存储
// eslint-disable-next-line import/no-mutable-exports
export let bookmarks: Persisted<BookmarksStore> = persisted(
  'temporary_bookmarks',
  {
    data: {},
    meta: {
      databaseVersion: 3,
      created: Date.now(),
    },
  },
  {
    storage: 'session',
    syncTabs: false,
  }
)

// 延迟初始化，避免阻塞主线程
setTimeout(() => {
  console.log('initalizing bookmarks')
  bookmarks = persisted(STORAGE_KEY_BOOKMARKS, {
    data: {},
    meta: {
      databaseVersion: 3,
      created: Date.now(),
    },
  })

  // 首次访问检测并添加示例数据
  const bookmarksRaw = get(bookmarks)
  const $settings = get(settings)
  if (Object.keys(bookmarksRaw.data).length === 0 && $settings.isFirstRun) {
    $settings.isFirstRun = false
    bookmarksRaw.data =
      $settings.lang === 'zh-CN' ? initialBookmarksCN : initialBookmarks
    settings.set($settings)
    bookmarks.set(bookmarksRaw)
  }

  const event = new CustomEvent('bookmarksInitialized')
  globalThis.dispatchEvent(event)
  isBookmarksDataReady = true
}, 2000)

export function exportData() {
  checkBookmarksDataReady()

  const dataString = JSON.stringify(get(bookmarks), null, 2)
  const blob = new Blob([dataString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const now = new Date()
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  a.href = url
  a.download = `utags-backup-${timestamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function clearAll() {
  checkBookmarksDataReady()

  // eslint-disable-next-line no-alert
  if (confirm('请确认是否清空所有书签？此操作不可逆，建议先导出备份数据。')) {
    const bookmarksRaw = get(bookmarks)
    bookmarksRaw.data = {}
    bookmarks.set(bookmarksRaw)
    const event = new CustomEvent('clearAll')
    globalThis.dispatchEvent(event)
  }
}

// 新增导入状态
let importProgress = {
  current: 0,
  total: 0,
  stats: {
    newBookmarks: 0,
    newDomains: new Set(),
    newTags: new Set(),
  },
}

export async function importData() {
  checkBookmarksDataReady()

  const bookmarksRaw = get(bookmarks)
  const bookmarksData = bookmarksRaw.data
  // 收集所有标签和域名，用于统计新的标签和域名数量
  const allTags = new Set(
    Object.values(bookmarksData).flatMap((entry) => entry.tags)
  )
  const allDomains = new Set(
    Object.keys(bookmarksData).map((url) => new URL(url).hostname)
  )

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'

  input.addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement
    const file = target.files ? target.files[0] : null
    if (!file) return

    try {
      const content = await file.text()
      const data: BookmarksStore = JSON.parse(content) as BookmarksStore

      // 初始化进度
      importProgress = {
        current: 0,
        total: Object.keys(data.data).length,
        stats: {
          newBookmarks: 0,
          newDomains: new Set(),
          newTags: new Set(),
        },
      }

      // 分批处理避免阻塞
      const batchSize = 50
      const entries = Object.entries(data.data)

      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize)
        for (const [url, entry] of batch) {
          if (!bookmarksData[url]) {
            importProgress.stats.newBookmarks++

            // 统计新域名
            const domain = new URL(url).hostname
            if (!allDomains.has(domain)) {
              importProgress.stats.newDomains.add(domain)
            }

            // 统计新标签
            for (const tag of entry.tags) {
              if (!allTags.has(tag)) {
                importProgress.stats.newTags.add(tag)
              }
            }
          }

          bookmarksData[url] = entry
          importProgress.current++
        }

        // 直接更新 localStorage，防止触发响应式更新
        localStorage.setItem(
          STORAGE_KEY_BOOKMARKS,
          JSON.stringify(bookmarksRaw)
        )

        const event = new CustomEvent('importProgressUpdated', {
          detail: importProgress,
        })
        globalThis.dispatchEvent(event)

        // 等待下一次事件循环
        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      const event = new CustomEvent('importFinished', {
        detail: importProgress,
      })
      globalThis.dispatchEvent(event)

      // 重置进度
      importProgress = {
        current: 0,
        total: 0,
        stats: {
          newBookmarks: 0,
          newDomains: new Set(),
          newTags: new Set(),
        },
      }

      // 触发响应式更新
      bookmarks.set(bookmarksRaw)
    } catch {
      // eslint-disable-next-line no-alert
      alert('文件导入失败，请检查文件格式')
    }
  })

  input.click()
}
