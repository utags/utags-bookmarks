import { mergeBookmarks } from '../utils/sync-conflict-resolver.ts'

class SyncService {
  async syncBookmarks(userId, deviceData) {
    const serverData = await this.getServerData(userId)
    const lastSynced = await this.getLastSyncedVersion(userId)

    // 三向合并
    const merged = mergeBookmarks(
      deviceData,
      serverData.current,
      lastSynced // 作为基准版本
    )

    // 保存合并结果
    await this.saveMergedData(userId, merged)
    return merged
  }
}
