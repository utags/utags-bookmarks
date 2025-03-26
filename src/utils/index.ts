import { splitTags, trimTitle } from 'utags-utils'
import Console from 'console-tagger'
import { HASH_DELIMITER, FILTER_DELIMITER } from '../constants.js'

const console = new Console({
  prefix: 'utils',
  color: { line: 'white', background: 'orange' },
})

/**
 * Normalizes and simplifies a URL by:
 * 1. Removing tracking parameters (utm_*, fbclid, etc)
 * 2. Simplifying path segments (keep first 2 or last 1)
 * 3. Removing trailing slashes
 * 4. Decoding special characters
 * 5. Stripping protocol and www prefix
 * @param {string} url - Original URL to process
 * @returns {string} Cleaned and human-readable URL
 */
export function humanizeUrl(url: string) {
  try {
    const parsed = new URL(url)

    // Filter common tracking parameters while preserving valid query parameters
    const allowedParameters = [...parsed.searchParams].filter(
      ([key]) => !/^(utm_|fbclid|gclid|mc_|yclid|_ga|zanpid)/.test(key)
    )

    // Path simplification logic: Keep first and last segments when exceeding 2, otherwise keep original
    const pathSegments = parsed.pathname.split('/').filter(Boolean)
    const simplifiedPath =
      pathSegments.length > 2
        ? `/${pathSegments[0]}/.../${pathSegments.slice(-1).join('')}`
        : parsed.pathname

    // Build new URL object with cleaned parameters and simplified path
    const cleaned = new URL(parsed.origin)
    cleaned.pathname = simplifiedPath
    for (const [k, v] of allowedParameters) {
      cleaned.searchParams.set(k, v)
    }

    // Decode URI components and remove protocol, www prefix, and trailing slash
    return decodeURIComponent(`${cleaned.toString()}${parsed.hash}`)
      .replace(/\/$/, '')
      .replace(/^(https?:\/\/)?(www\.)?/, '')
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split(/[?#]/)[0]
  }
}

export function formatDatetime(date: number, full = false) {
  const locale = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'][1]
  return full
    ? new Date(date).toLocaleString(locale, {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : new Date(date).toLocaleString(locale, {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
}

/**
 * Cleans trailing spaces and slashes from filter string
 * @param {string|undefined} str - Raw string with possible trailing spaces/slashes
 * @returns {string} Cleaned string
 * @example
 * cleanFilterString('a,b,c/a.com/  ') // => 'a,b,c/a.com'
 * cleanFilterString('a,b,c/  /  ')   // => 'a,b,c'
 */
export function cleanFilterString(filterString: string | undefined) {
  if (!filterString) {
    return ''
  }

  return filterString.replace(/[\s/]+$/, '').trim()
}

/**
 * Parses filter string from URL hash
 * @param {string} filterString - Format: `[tags]/[domains]/[keyword]`
 *                                 - tags: URL-encoded comma-separated tags (e.g 'tag1%2Ctag2')
 *                                 - domains: URL-encoded comma-separated domains
 *                                 - keyword: URL-encoded search term
 * @returns {Object|undefined} Object with:
 *                  - searchKeyword: Cleaned search term
 *                  - selectedTags: Set of tags
 *                  - selectedDomains: Set of domains
 *                 Returns undefined on parse failure
 * @example
 * // Input example
 * parseFilterString('tag1%2Ctag2/example.com%2Ctest.com/keyword%20test')
 * // Returns
 * {
 *   searchKeyword: 'keyword test',
 *   selectedTags: new Set(['tag1', 'tag2']),
 *   selectedDomains: new Set(['example.com', 'test.com'])
 * }
 */
export function parseFilterString(filterString: string) {
  try {
    console.info(`current filter string: [${filterString}]`)

    if (filterString) {
      // Split into three parts: tags, domains, keyword [tags/domains/keyword]
      const [tagString = '', domainString = '', keyword = ''] =
        filterString.split(FILTER_DELIMITER, 3)

      // Process tag array (returns empty array if empty string)
      const tags = splitTags(decodeURIComponent(tagString))

      // Process domain array (returns empty array if empty string)
      const domains = splitTags(decodeURIComponent(domainString))

      // Clean and decode search keyword
      const cleanedKeyword = trimTitle(decodeURIComponent(keyword))

      return {
        searchKeyword: cleanedKeyword,
        selectedTags: new Set(tags),
        selectedDomains: new Set(domains),
      }
    }
  } catch (error) {
    console.error('Failed to parse filter string:', {
      error,
      filterString,
    })
  }

  return undefined
}

/**
 * Converts tags, domains, and keywords into a URL-safe filter string
 * @param {Set<string>} tags - Set of tags to encode
 * @param {Set<string>} domains - Set of domains to encode
 * @param {string} keyword - Search keyword to encode
 * @returns {string} Formatted as [encoded_tags]/[encoded_domains]/[encoded_keyword]
 * @example
 * convertToFilterString(new Set(['tag1', 'tag2']), new Set(['example.com', 'test.com']), 'keyword')
 * // Returns 'tag1%2Ctag2/example.com%2Ctest.com/keyword'
 * @example
 * convertToFilterString(new Set(), new Set(), '')
 * // Returns ''
 */
export function convertToFilterString(
  tags: Set<string>,
  domains: Set<string>,
  keyword: string
) {
  const filterString = [
    encodeURIComponent([...tags].join(',')),
    encodeURIComponent([...domains].join(',')),
    encodeURIComponent(keyword.trim()),
  ].join(FILTER_DELIMITER)

  return filterString === '//' ? '' : filterString.replace(/[/#]+$/, '')
}
