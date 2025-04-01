import { BookmarkTagsAndMetadata, BookmarksData, SyncOption } from './types.js'

/**
 * 合并两个设备的数据变更
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
  const { lastSyncTime, updateOverDelete = false } = options
  const merged: BookmarksData = {}

  // 收集所有需要处理的URL
  const allUrls = new Set([
    ...Object.keys(localData),
    ...Object.keys(remoteData),
  ])

  for (const url of allUrls) {
    const local = localData[url]
    const remote = remoteData[url]

    // 情况1: 只有本地有数据
    if (!remote) {
      merged[url] = handleSingleSource(local, lastSyncTime)
      continue
    }

    // 情况2: 只有远程有数据
    if (!local) {
      merged[url] = handleSingleSource(remote, lastSyncTime)
      continue
    }

    // 情况3: 双方都有数据
    merged[url] = mergeBothSources(
      local,
      remote,
      lastSyncTime,
      updateOverDelete
    )
  }

  return merged
}

/**
 * 处理单边数据源的情况
 */
function handleSingleSource(
  data: BookmarkTagsAndMetadata,
  lastSyncTime: number
): BookmarkTagsAndMetadata | undefined {
  // 忽略过期更新
  if (data.meta.updated <= lastSyncTime) {
    return undefined
  }

  // 如果是删除操作且未过期
  if (data.meta.isDeleted) {
    return data
  }

  // 返回有效更新
  return data
}

/**
 * 处理双边数据源合并
 */
function mergeBothSources(
  local: BookmarkTagsAndMetadata,
  remote: BookmarkTagsAndMetadata,
  lastSyncTime: number,
  updateOverDelete: boolean
): BookmarkTagsAndMetadata | undefined {
  // 忽略双方都过期的更新
  if (
    local.meta.updated <= lastSyncTime &&
    remote.meta.updated <= lastSyncTime
  ) {
    return undefined
  }

  // 处理删除冲突
  if (local.meta.isDeleted || remote.meta.isDeleted) {
    return handleDeleteConflict(local, remote, lastSyncTime, updateOverDelete)
  }

  // 合并双方更新
  return mergeUpdates(local, remote, lastSyncTime)
}

/**
 * 处理删除冲突
 */
function handleDeleteConflict(
  local: BookmarkTagsAndMetadata,
  remote: BookmarkTagsAndMetadata,
  lastSyncTime: number,
  updateOverDelete: boolean
): BookmarkTagsAndMetadata | undefined {
  const { isDeleted: localDeleted, updated: localUpdated, created } = local.meta
  const { isDeleted: remoteDeleted, updated: remoteUpdated } = remote.meta

  // 情况1: 双方都删除
  if (localDeleted && remoteDeleted) {
    return {
      tags: [],
      meta: {
        created,
        updated: Math.max(localUpdated, remoteUpdated),
        isDeleted: true,
      },
    }
  }

  // 情况2: 本地删除，远程更新
  if (localDeleted && !remoteDeleted) {
    return handleDeleteVsUpdate(local, remote, lastSyncTime, updateOverDelete)
  }

  // 情况3: 远程删除，本地更新
  if (!localDeleted && remoteDeleted) {
    return handleDeleteVsUpdate(remote, local, lastSyncTime, updateOverDelete)
  }

  // 默认情况: 合并更新
  return mergeUpdates(local, remote, lastSyncTime)
}

/**
 * 处理删除与更新的冲突
 */
function handleDeleteVsUpdate(
  deleteData: BookmarkTagsAndMetadata,
  updateData: BookmarkTagsAndMetadata,
  lastSyncTime: number,
  updateOverDelete: boolean
): BookmarkTagsAndMetadata | undefined {
  // 忽略过期更新
  if (updateData.meta.updated <= lastSyncTime) {
    return deleteData
  }

  // 如果配置为优先保留更新
  if (updateOverDelete) {
    return updateData
  }

  // 默认行为: 删除时间戳更大则执行删除
  if (deleteData.meta.updated > updateData.meta.updated) {
    return deleteData
  }

  return updateData
}

/**
 * 合并双方更新
 */
function mergeUpdates(
  local: BookmarkTagsAndMetadata,
  remote: BookmarkTagsAndMetadata,
  lastSyncTime: number
): BookmarkTagsAndMetadata {
  // 忽略过期更新
  const localValid = local.meta.updated > lastSyncTime
  const remoteValid = remote.meta.updated > lastSyncTime

  // 合并标签 (去重)
  const mergedTags = Array.from(
    new Set([
      ...(localValid ? local.tags : []),
      ...(remoteValid ? remote.tags : []),
    ])
  )

  // 合并元数据
  const mergedMeta = { ...local.meta, ...remote.meta }
  mergedMeta.updated = Math.max(local.meta.updated, remote.meta.updated)

  return {
    tags: mergedTags,
    meta: mergedMeta,
  }
}
