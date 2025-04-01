import { SyncMetadata, BookmarksData } from './types';
import fs from 'fs';
import path from 'path';

const SYNC_INFO_FILE = '.syncinfo';

class SyncManager {
  private filePath: string;

  constructor(workspacePath: string) {
    this.filePath = path.join(workspacePath, SYNC_INFO_FILE);
  }

  // 创建/更新同步状态
  async updateSyncState(state: Partial<SyncMetadata>): Promise<void> {
    const current = await this.getSyncState();
    const newState = { ...current, ...state };
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(newState, null, 2),
      'utf-8'
    );
  }

  // 获取当前同步状态
  async getSyncState(): Promise<SyncMetadata> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      // 文件不存在时返回默认状态
      return {
        version: '1.0',
        deviceId: '',
        lastSyncTime: 0,
        syncStatus: 'completed',
        conflictCount: 0
      };
    }
  }

  // 记录同步成功的URL（增量更新）
  async recordSyncedUrls(urls: string[]): Promise<void> {
    const current = await this.getSyncState();
    const uniqueUrls = Array.from(new Set([...(current.syncedUrls || []), ...urls]));
    await this.updateSyncState({ syncedUrls: uniqueUrls });
  }
}