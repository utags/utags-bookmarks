import { describe, it, expect } from 'vitest'
import { HASH_DELIMITER, FILTER_DELIMITER } from '../config/constants.js'
import {
  humanizeUrl,
  cleanFilterString,
  parseFilterString,
  convertToFilterString,
} from './index.js'

describe('humanizeUrl', () => {
  it('should correctly handle URLs with tracking parameters', () => {
    const url =
      'https://www.example.com/path1/path2/path3?utm_source=test&valid=1#section'
    expect(humanizeUrl(url)).toBe('example.com/path1/.../path3?valid=1#section')
  })

  it('should preserve valid query parameters', () => {
    const url = 'http://example.com?foo=bar&gclid=123&valid=true'
    expect(humanizeUrl(url)).toBe('example.com/?foo=bar&valid=true')
  })

  it('should simplify long paths keeping first and last segments', () => {
    const url = 'https://example.com/a/b/c/d/e'
    expect(humanizeUrl(url)).toBe('example.com/a/.../e')
  })

  it('should preserve hash fragments', () => {
    const url = 'https://example.com#anchor'
    expect(humanizeUrl(url)).toBe('example.com/#anchor')
  })

  it('should return original value for invalid URLs', () => {
    const url = 'invalid-url'
    expect(humanizeUrl(url)).toBe('invalid-url')
  })

  it('should remove trailing slashes', () => {
    const url = 'https://example.com/path/'
    expect(humanizeUrl(url)).toBe('example.com/path')
  })
})

describe('cleanFilterString', () => {
  it('should trim trailing spaces and slashes', () => {
    expect(cleanFilterString('a,b,c/a.com/  ')).toBe('a,b,c/a.com')
  })

  it('should clean pure space endings', () => {
    expect(cleanFilterString('test/   ')).toBe('test')
  })

  it('should handle empty input returning empty string', () => {
    expect(cleanFilterString(undefined)).toBe('')
    expect(cleanFilterString('')).toBe('')
  })

  it('should preserve valid path slashes', () => {
    expect(cleanFilterString('a/b/c')).toBe('a/b/c')
  })

  it('should clean mixed ending delimiters', () => {
    expect(cleanFilterString('  x, y, z  /  /  ')).toBe('x, y, z')
    expect(cleanFilterString('  /  /  ')).toBe('')
  })
})

describe('parseFilterString', () => {
  it('should correctly parse complete parameters', () => {
    const result = parseFilterString(
      'tag1%2Ctag2/example.com%2Ctest.com/keyword%20test'
    )
    expect(result).toEqual({
      searchKeyword: 'keyword test',
      selectedTags: new Set(['tag1', 'tag2']),
      selectedDomains: new Set(['example.com', 'test.com']),
    })
  })

  it('should handle missing tag section', () => {
    const result = parseFilterString('/domain.com/ keyword   test ')
    expect(result).toEqual({
      searchKeyword: 'keyword test',
      selectedTags: new Set([]),
      selectedDomains: new Set(['domain.com']),
    })
  })

  it('should handle missing domain section', () => {
    const result = parseFilterString('tagA%2CtagB//domain.com')
    expect(result).toEqual({
      searchKeyword: 'domain.com',
      selectedTags: new Set(['tagA', 'tagB']),
      selectedDomains: new Set([]),
    })
  })

  it('should handle missing keyword section', () => {
    const result = parseFilterString('tagA%2CtagB/domain.com/')
    expect(result?.searchKeyword).toBe('')
  })

  it('should handle empty string input', () => {
    expect(parseFilterString('')).toBeUndefined()
  })

  it('should decode special characters', () => {
    const result = parseFilterString(
      '%E4%B8%AD%E6%96%87%20tag%2F%ED%95%9C%EA%B5%AD%EC%96%B4%20tag/%E4%B8%AD%E6%96%87.com/key'
    )
    expect(result).toEqual({
      searchKeyword: 'key',
      selectedTags: new Set(['中文 tag/한국어 tag']),
      selectedDomains: new Set(['中文.com']),
    })
  })

  it('should handle invalid URI encoding', () => {
    expect(parseFilterString('invalid%2/example.com/key')).toBeUndefined()
  })

  it('should return undefined when parsing fails', () => {
    expect(parseFilterString('invalid//@#$%^&*()')).toBeUndefined()
  })
})

describe('convertToFilterString', () => {
  it('should handle empty sets and empty keyword', () => {
    expect(convertToFilterString(new Set(), new Set(), '')).toBe('')
  })

  it('should handle tags only', () => {
    expect(
      convertToFilterString(new Set(['tag1', 'tag2']), new Set(), '')
    ).toBe(
      `tag1%2Ctag2${FILTER_DELIMITER}${FILTER_DELIMITER}`.replace(/[/#]+$/, '')
    )
  })

  it('should handle combination of tags and domains', () => {
    expect(
      convertToFilterString(
        new Set(['前端', 'bug']),
        new Set(['example.com', 'test.com']),
        ''
      )
    ).toBe(`%E5%89%8D%E7%AB%AF%2Cbug${FILTER_DELIMITER}example.com%2Ctest.com`)
  })

  it('should handle complete parameters with special characters', () => {
    // Normally tags shouldn't contain ',' or '/' characters
    expect(
      convertToFilterString(
        new Set(['tag,1', 'tag/2']),
        new Set(['domain.com', 'sub.domain']),
        'search keyword'
      )
    ).toBe(
      `tag%2C1%2Ctag%2F2${FILTER_DELIMITER}domain.com%2Csub.domain${FILTER_DELIMITER}search%20keyword`
    )
  })

  it('should trim trailing delimiters', () => {
    expect(convertToFilterString(new Set(), new Set(), '')).toBe('')
    expect(convertToFilterString(new Set(['tag']), new Set(), '')).toBe(`tag`)
  })

  it('should handle mixed empty parameters', () => {
    expect(
      convertToFilterString(new Set(), new Set(['domain']), 'keyword')
    ).toBe(`${FILTER_DELIMITER}domain${FILTER_DELIMITER}keyword`)
  })
})
