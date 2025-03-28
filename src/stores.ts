import { get } from 'svelte/store'
import { persisted, type Persisted } from 'svelte-persisted-store'
import { STORAGE_KEY_BOOKMARKS, STORAGE_KEY_SETTINGS } from './constants.js'

export type BookmarkTagsAndMetadata = {
  tags: string[]
  meta: {
    title: string
    created: number
    updated: number
  }
}

type Bookmarks = {
  data: Record<string, BookmarkTagsAndMetadata>
  meta: {
    databaseVersion: number
    created: number
  }
}

export const settings = persisted(STORAGE_KEY_SETTINGS, {
  sortBy: 'updated',
  sidebarPosition: 'left',
  viewMode: 'compact',
  isFirstRun: true,
})

// 初始化书签存储
export const bookmarks: Persisted<Bookmarks> = persisted(
  STORAGE_KEY_BOOKMARKS,
  {
    data: {},
    meta: {
      databaseVersion: 3,
      created: Date.now(),
    },
  }
)

export function exportData() {
  const dataString = JSON.stringify(get(bookmarks))
  const blob = new Blob([dataString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const now = new Date()
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  a.href = url
  a.download = `utags-backup-${timestamp}.json`
  a.click()
}

export function clearAll() {
  if (confirm('请确认是否清空所有书签？此操作不可逆，建议先导出备份数据。')) {
    const temporaryBookmarks = get(bookmarks)
    temporaryBookmarks.data = {}
    bookmarks.set(temporaryBookmarks)
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
  const temporaryBookmarks = get(bookmarks)
  const bookmarksData = temporaryBookmarks.data
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

  input.addEventListener('change', async (e) => {
    const target = e.target as HTMLInputElement
    const file = target.files ? target.files[0] : null
    if (!file) return

    try {
      const content = await file.text()
      const data: Bookmarks = JSON.parse(content)

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
          JSON.stringify(temporaryBookmarks)
        )

        const event = new CustomEvent('importProgressUpdated', {
          detail: importProgress,
        })
        globalThis.dispatchEvent(event)

        // 等待下一次事件循环
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
      bookmarks.set(temporaryBookmarks)
    } catch {
      alert('文件导入失败，请检查文件格式')
    }
  })

  input.click()
}
