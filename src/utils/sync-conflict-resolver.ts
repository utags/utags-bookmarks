type BookmarkData = Record<string, any>

type TimestampValue = {
  updatedAt?: number
}

function getType(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

class SyncConflictResolver {
  /**
   * 基础合并策略
   * @param local 本地数据
   * @param remote 远程数据
   * @param base 基准数据
   * @returns 合并结果
   */
  static threeWayMerge(
    local: BookmarkData,
    remote: BookmarkData,
    base: BookmarkData = {}
  ): BookmarkData {
    const result: BookmarkData = { ...base }

    // 字段级合并
    for (const key of new Set([
      ...Object.keys(local),
      ...Object.keys(remote),
    ])) {
      if (!(key in remote)) {
        result[key] = local[key] // 远程删除则保留本地
        // eslint-disable-next-line unicorn/no-negated-condition
      } else if (!(key in local)) {
        result[key] = remote[key] // 本地删除则保留远程
      } else {
        // 处理带时间戳的对象（新增部分）
        if (
          this.isTimestampObject(local[key]) &&
          this.isTimestampObject(remote[key])
        ) {
          result[key] = this.resolveValueConflict(
            local[key],
            remote[key],
            base[key]
          )
        }
        // 嵌套对象处理
        else if (
          this.isPlainObject(local[key]) &&
          this.isPlainObject(remote[key])
        ) {
          result[key] = this.threeWayMerge(
            local[key],
            remote[key],
            base[key] || {}
          )
        }
        // 数组处理（标签等）
        else if (Array.isArray(local[key]) && Array.isArray(remote[key])) {
          result[key] = this.mergeArrays(local[key], remote[key], base[key])
        }
        // 基本类型处理
        else {
          result[key] = this.resolveValueConflict(
            local[key],
            remote[key],
            base[key]
          )
        }
      }
    }

    return result
  }

  /**
   * 数组合并策略（案例1、2、5）
   */
  static mergeArrays(
    localArray: any[],
    remoteArray: any[],
    baseArray: any[] = []
  ): any[] {
    const baseSet = new Set(baseArray)
    const localAdditions = localArray.filter((x) => !baseSet.has(x))
    const remoteAdditions = remoteArray.filter((x) => !baseSet.has(x))

    // 删除优先（案例2、5）
    const localDeletions = baseArray.filter((x) => !localArray.includes(x))
    const remoteDeletions = baseArray.filter((x) => !remoteArray.includes(x))
    const deletions = new Set(new Set([...localDeletions, ...remoteDeletions]))

    // 合并新增内容（案例1）
    const additions = [
      ...new Set([...baseArray, ...localAdditions, ...remoteAdditions]),
    ]

    return additions.filter((x) => !deletions.has(x))
  }

  /**
   * 值冲突解决（案例3、4、7）
   */
  static resolveValueConflict<T extends TimestampValue>(
    localValue: T,
    remoteValue: T,
    baseValue: T
  ): T {
    console.log(
      '>> resolveValueConflict',
      localValue,
      remoteValue,
      baseValue,
      getType(localValue),
      getType(remoteValue),
      getType(baseValue)
    )
    // 空值冲突处理（案例11）
    if (remoteValue === null || remoteValue === undefined) {
      return localValue
    }

    if (localValue === null || localValue === undefined) {
      return remoteValue
    }

    // 类型冲突处理（案例7）
    if (getType(localValue) !== getType(remoteValue)) {
      return getType(baseValue) === getType(remoteValue)
        ? remoteValue
        : localValue
    }

    // 时间戳比较（案例3）
    const localTimestamp = localValue?.updatedAt || 0
    const remoteTimestamp = remoteValue?.updatedAt || 0
    return remoteTimestamp > localTimestamp ? remoteValue : localValue
  }

  /**
   * 树形结构合并（案例10）
   * -> 书签合并不需要处理重名命冲突
   */
  static mergeTreeStructures(
    local: BookmarkData,
    remote: BookmarkData
  ): BookmarkData {
    // 先处理重命名操作
    const renamed = this.detectRenameOperations(local, remote)
    // 再处理移动操作
    return this.applyMoveOperations(renamed.local, renamed.remote)
  }

  static isPlainObject(object: any): boolean {
    return object && typeof object === 'object' && !Array.isArray(object)
  }

  /**
   * 检测重命名操作（案例10）
   */
  private static detectRenameOperations(
    local: BookmarkData,
    remote: BookmarkData
  ) {
    const renamedKeys = new Map<string, string>()
    const allKeys = new Set([...Object.keys(local), ...Object.keys(remote)])

    // 检测可能的重命名（相同值但不同键）
    for (const key of allKeys) {
      if (local[key] && remote[key]) continue

      for (const otherKey of allKeys) {
        if (key === otherKey) continue

        // 判断是否为重命名操作
        if (JSON.stringify(local[key]) === JSON.stringify(remote[otherKey])) {
          renamedKeys.set(key, otherKey)
          break
        }
      }
    }

    // 应用重命名到本地副本
    const localCopy = { ...local }
    for (const [oldKey, newKey] of renamedKeys) {
      if (localCopy[oldKey]) {
        localCopy[newKey] = localCopy[oldKey]
        delete localCopy[oldKey]
      }
    }

    return {
      local: localCopy,
      remote: { ...remote },
    }
  }

  /**
   * 应用移动操作（案例10）
   */
  private static applyMoveOperations(
    local: BookmarkData,
    remote: BookmarkData
  ): BookmarkData {
    const result: BookmarkData = { ...local }

    // 合并远程的修改
    for (const key of Object.keys(remote)) {
      if (Array.isArray(remote[key])) {
        // 数组类型处理（如标签）
        result[key] = [...new Set([...(result[key] || []), ...remote[key]])]
      } else if (this.isPlainObject(remote[key])) {
        // 嵌套对象处理
        result[key] = this.applyMoveOperations(result[key] || {}, remote[key])
      } else {
        // 基本值处理
        result[key] = remote[key]
      }
    }

    // 移除空数组/对象
    for (const key of Object.keys(result)) {
      if (Array.isArray(result[key]) && result[key].length === 0) {
        delete result[key]
      } else if (
        this.isPlainObject(result[key]) &&
        Object.keys(result[key]).length === 0
      ) {
        delete result[key]
      }
    }

    return result
  }

  // 新增方法：检查是否为带时间戳的对象
  private static isTimestampObject(object: any): boolean {
    return (
      this.isPlainObject(object) &&
      'updatedAt' in object &&
      typeof object.updatedAt === 'number'
    )
  }
}

// 导出合并函数
export const mergeBookmarks = (
  local: BookmarkData,
  remote: BookmarkData,
  base: BookmarkData
) => SyncConflictResolver.threeWayMerge(local, remote, base)

export const mergeTags = (
  localTags: any[],
  remoteTags: any[],
  baseTags: any[]
) => SyncConflictResolver.mergeArrays(localTags, remoteTags, baseTags)

export const resolveValueConflict = <T extends TimestampValue>(
  localValue: T,
  remoteValue: T,
  baseValue: T
) =>
  SyncConflictResolver.resolveValueConflict(localValue, remoteValue, baseValue)

export default SyncConflictResolver
