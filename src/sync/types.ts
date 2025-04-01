/**
 * 书签的标签和元数据 (无删除标记版)
 */
export type BookmarkTagsAndMetadata = {
  tags: string[]
  meta: {
    title?: string
    description?: string
    created: number
    updated: number
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
export type BookmarksData = Record<
  BookmarkKey,
  BookmarkTagsAndMetadata | undefined
>

/**
 * 同步选项
 */
export type SyncOption = {
  currentTime: number
  lastSyncTime: number
}

/**
 * 设备同步信息
 */
export type SyncInfo = {
  deviceId: string
  deviceName: string
  lastSyncTime: number
}
