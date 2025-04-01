// ... 其他导入 ...
import { SyncManager } from './syncManager';

export class SyncService {
  private syncManager: SyncManager;

  constructor() {
    this.syncManager = new SyncManager('/path/to/workspace');
  }

  async performSync(localData: BookmarksData, remoteData: BookmarksData) {
    // 开始同步时更新状态
    await this.syncManager.updateSyncState({
      syncStatus: 'in_progress',
      lastSyncTime: Date.now()
    });

    try {
      const mergedData = mergeBookmarks(localData, remoteData, {
        lastSyncTime: await this.getLastSyncTime()
      });

      // 记录成功同步的URL
      await this.syncManager.recordSyncedUrls(Object.keys(mergedData));
      
      // 同步完成更新状态
      await this.syncManager.updateSyncState({
        syncStatus: 'completed',
        lastSyncTime: Date.now()
      });

      return mergedData;
    } catch (error) {
      // 同步失败记录错误
      await this.syncManager.updateSyncState({
        syncStatus: 'failed',
        error: {
          code: 'SYNC_FAILED',
          message: error.message
        }
      });
      throw error;
    }
  }

  private async getLastSyncTime(): Promise<number> {
    const state = await this.syncManager.getSyncState();
    return state.lastSyncTime;
  }
}