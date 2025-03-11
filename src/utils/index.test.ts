import { describe, it, expect } from 'vitest'
import { humanizeUrl } from './index.js'

describe('humanizeUrl', () => {
  it('应正确处理含跟踪参数的URL', () => {
    const url =
      'https://www.example.com/path1/path2/path3?utm_source=test&valid=1#section'
    expect(humanizeUrl(url)).toBe('example.com/path1/path3?valid=1#section')
  })

  it('应保留有效查询参数', () => {
    const url = 'http://example.com?foo=bar&gclid=123&valid=true'
    expect(humanizeUrl(url)).toBe('example.com/?foo=bar&valid=true')
  })

  it('应简化长路径保留首末段', () => {
    const url = 'https://example.com/a/b/c/d/e'
    expect(humanizeUrl(url)).toBe('example.com/a/e')
  })

  it('应保留哈希片段', () => {
    const url = 'https://example.com#anchor'
    expect(humanizeUrl(url)).toBe('example.com/#anchor')
  })

  it('应处理无效URL返回原始值', () => {
    const url = 'invalid-url'
    expect(humanizeUrl(url)).toBe('invalid-url')
  })

  it('应移除末尾斜杠', () => {
    const url = 'https://example.com/path/'
    expect(humanizeUrl(url)).toBe('example.com/path')
  })
})
