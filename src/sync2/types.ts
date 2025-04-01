/**
 * 书签的标签和元数据
 */
export type BookmarkTagsAndMetadata = {
  tags: string[]
  meta: {
    title?: string
    description?: string
    created: number
    updated: number
    isDeleted?: boolean
    [key: string]: any // 允许额外元数据
  }
}

/**
 * 书签的URL作为键
 */
export type BookmarkKey = string

/**
 * 书签数据集合
 */
export type BookmarksData = Record<BookmarkKey, BookmarkTagsAndMetadata>

/**
 * 同步选项
 */
export type SyncOption = {
  currentTime: number
  lastSyncTime: number
  updateOverDelete?: boolean
}

/**
 * 设备同步信息
 */
export type SyncInfo = {
  deviceId: string
  deviceName: string
  lastSyncTime: number
}
