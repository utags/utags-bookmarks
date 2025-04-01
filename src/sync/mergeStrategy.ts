import { BookmarkTagsAndMetadata, BookmarksData, SyncOption } from './types'

/**
 * 合并两个设备的数据变更 (无删除标记版)
 * @param localData 本地设备数据
 * @param remoteData 远程设备数据
 * @param options 同步选项
 * @returns 合并后的数据
 */
export function mergeBookmarks(
  localData: BookmarksData,
  remoteData: BookmarksData,
  options: SyncOption
): BookmarksData {
  const { lastSyncTime } = options
  const merged: BookmarksData = {}

  // 收集所有URL（包括可能被删除的）
  const allUrls = new Set([
    ...Object.keys(localData),
    ...Object.keys(remoteData),
  ])

  for (const url of allUrls) {
    const local = localData[url]
    const remote = remoteData[url]

    // TODO
    // use hasBookmark instead of compare with undefined

    // 情况1: 本地已删除(undefined)，远程有数据
    if (local === undefined && remote !== undefined) {
      if (remote.meta.updated > lastSyncTime) {
        merged[url] = remote // 保留远程更新
      } else {
        merged[url] = undefined // 标记为删除
      }
      continue
    }

    // 情况2: 远程已删除(undefined)，本地有数据
    if (remote === undefined && local !== undefined) {
      if (local.meta.updated > lastSyncTime) {
        // merged[url] = undefined // 标记为删除
        merged[url] = local // 保留本地更新
      } else {
        merged[url] = undefined // 标记为删除
      }
      continue
    }

    // 情况3: 双方都有数据
    if (local && remote) {
      merged[url] = mergeBothSources(local, remote, lastSyncTime)
    }
  }

  return merged
}

/**
 * 处理双边数据源合并
 */
function mergeBothSources(
  local: BookmarkTagsAndMetadata,
  remote: BookmarkTagsAndMetadata,
  lastSyncTime: number
): BookmarkTagsAndMetadata | undefined {
  // 忽略双方都过期的更新
  if (
    local.meta.updated <= lastSyncTime &&
    remote.meta.updated <= lastSyncTime
  ) {
    return undefined
  }

  // 合并标签 (去重)
  const mergedTags = Array.from(
    new Set([
      ...(local.meta.updated > lastSyncTime ? local.tags : []),
      ...(remote.meta.updated > lastSyncTime ? remote.tags : []),
    ])
  )

  // 合并元数据
  const mergedMeta = { ...local.meta, ...remote.meta }
  mergedMeta.updated = Math.max(local.meta.updated, remote.meta.updated)

  // 处理相同时间戳冲突
  if (local.meta.updated === remote.meta.updated) {
    mergedMeta.updated += 1 // 时间戳+1解决冲突
  }

  return {
    tags: mergedTags,
    meta: mergedMeta,
  }
}
