type SyncRecord = {
  id: string
  version: number
  operation: 'CREATE' | 'UPDATE' | 'DELETE'
  data: any
  timestamp: number
  deviceId: string
  signature: string // 数据完整性校验
}

type SyncState = {
  lastSyncedVersion: number
  pendingChanges: SyncRecord[]
  conflictResolution?: 'SERVER' | 'CLIENT' | 'MANUAL'
}
