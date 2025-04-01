import { mergeBookmarks } from './mergeStrategy'
import { SyncOption } from './types'

// 案例1: 标签合并
const example1 = () => {
  const context: SyncOption = { lastSyncTime: 1000, currentTime: 2500 }

  const deviceA = {
    'https://example.com': {
      tags: ['tag1'],
      meta: { created: 1000, updated: 1500 },
    },
  }

  const deviceB = {
    'https://example.com': {
      tags: ['tag2'],
      meta: { created: 1000, updated: 2000 },
    },
  }

  const merged = mergeBookmarks(deviceA, deviceB, context)
  console.log('合并结果:', merged)
}

// 案例2: 删除与更新冲突
const example2 = () => {
  const context: SyncOption = { lastSyncTime: 1700, currentTime: 2000 }

  const deviceA = {
    'https://example.com': undefined, // 表示删除
  }

  const deviceB = {
    'https://example.com': {
      tags: ['newTag'],
      meta: { created: 1000, updated: 1800 },
    },
  }

  const merged = mergeBookmarks(deviceA, deviceB, context)
  console.log('删除冲突合并结果:', merged)
}

// 运行示例
example1()
example2()
