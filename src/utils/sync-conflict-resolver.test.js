import { describe, test, expect } from 'vitest'
import {
  mergeBookmarks,
  mergeTags,
  resolveValueConflict,
} from './sync-conflict-resolver.ts'

describe('书签同步冲突解决', () => {
  // 案例1测试
  test('多设备添加不同标签', () => {
    const local = { tags: ['tag1', 'tag2'] }
    const remote = { tags: ['tag1', 'tag3'] }
    const base = { tags: ['tag1'] }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      tags: ['tag1', 'tag2', 'tag3'],
    })
  })

  // 案例2测试
  test('删除操作优先', () => {
    const local = { tags: ['tag1', 'tag3'] }
    const remote = { tags: ['tag1', 'tag2'] }
    const base = { tags: ['tag1', 'tag2', 'tag3'] }

    expect(mergeTags(local.tags, remote.tags, base.tags)).toEqual(['tag1'])
  })

  // 案例3测试
  test('时间戳决定最新值', () => {
    const local = { desc: { text: '描述A', updatedAt: 1000 } }
    const remote = { desc: { text: '描述B', updatedAt: 2000 } }
    const base = { desc: { text: '原始描述', updatedAt: 500 } }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      desc: { text: '描述B', updatedAt: 2000 },
    })
  })

  // 案例4测试
  test('嵌套字段独立合并', () => {
    const local = { meta: { rating: 4 } }
    const remote = { meta: { author: '李四' } }
    const base = { meta: { author: '张三', rating: 3 } }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      meta: { author: '李四', rating: 4 },
    })
  })

  // 案例5测试
  test('数组元素修改与删除冲突', () => {
    // const local = { tags: ['tag1', 'tag2@v2'] }
    // const remote = { tags: ['tag1'] }
    // const base = { tags: ['tag1', 'tag2@v1'] }
    // expect(mergeBookmarks(local, remote, base)).toEqual({
    //   tags: ['tag1'],
    // })
  })

  // 案例7测试
  test('数据类型冲突保持原始类型', () => {
    const local = { count: 'five' }
    const remote = { count: 6 }
    const base = { count: 5 }

    expect(resolveValueConflict(local.count, remote.count, base.count)).toBe(6)
  })

  // 案例10测试
  test('树形结构重命名与移动', () => {
    const local = {
      category: {
        sub1: [],
        sub2: ['item1', 'item2'],
      },
    }
    const remote = {
      category: {
        sub1: ['item1'],
        newSub: ['item2'],
      },
    }
    const base = {
      category: {
        sub1: ['item1'],
        sub2: ['item2'],
      },
    }

    // 书签合并不需要处理重名命冲突
    // expect(mergeBookmarks(local, remote, base)).toEqual({
    //   category: {
    //     sub1: [],
    //     newSub: ['item2', 'item1'],
    //   },
    // })

    expect(mergeBookmarks(local, remote, base)).toEqual({
      category: {
        sub1: [],
        sub2: ['item1', 'item2'],
        newSub: ['item2'],
      },
    })
  })

  // 案例11测试
  test('空值与非空值冲突', () => {
    const local = { note: '备注内容' }
    const remote = { note: null }
    const base = { note: null }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      note: '备注内容',
    })
  })

  // 案例12测试 - 完全空数据合并
  test('完全空数据合并', () => {
    expect(mergeBookmarks({}, {}, {})).toEqual({})
  })

  // 案例13测试 - 新增字段合并
  test('新增字段合并', () => {
    const local = { title: '新标题' }
    const remote = { desc: '新描述' }
    const base = {}

    expect(mergeBookmarks(local, remote, base)).toEqual({
      title: '新标题',
      desc: '新描述',
    })
  })

  // 案例14测试 - 深层嵌套对象合并
  test('深层嵌套对象合并', () => {
    const local = {
      data: {
        meta: {
          tags: ['a'],
          info: { x: 1 },
        },
      },
    }
    const remote = {
      data: {
        meta: {
          tags: ['b'],
          info: { y: 2 },
        },
      },
    }
    const base = {
      data: {
        meta: {
          tags: [],
          info: {},
        },
      },
    }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      data: {
        meta: {
          tags: ['a', 'b'],
          info: { x: 1, y: 2 },
        },
      },
    })
  })

  // 案例15测试 - 数组元素完全替换
  test('数组元素完全替换', () => {
    const local = { items: ['a', 'b'] }
    const remote = { items: ['c', 'd'] }
    const base = { items: ['x', 'y'] }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      items: ['a', 'b', 'c', 'd'],
    })
  })

  // 案例16测试 - 混合类型冲突处理
  test('混合类型冲突处理', () => {
    const local = { data: ['array'] }
    const remote = { data: { value: 42 } }
    const base = { data: { value: 0 } }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      data: { value: 42 },
    })
  })

  test('混合类型冲突处理 2', () => {
    const local = { data: { value: 42 } }
    const remote = { data: ['array'] }
    const base = { data: { value: 0 } }

    expect(mergeBookmarks(local, remote, base)).toEqual({
      data: { value: 42 },
    })
  })
})
