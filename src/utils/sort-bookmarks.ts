import type { BookmarkTagsAndMetadata } from '../types/bookmarks'
import type { SortOption } from '../config/sort-options'

type BookmarkItem = [string, BookmarkTagsAndMetadata]

/**
 * Sort an array of bookmarks by specified field
 * @param bookmarks Array of bookmarks in format [[url, entry], ...]
 * @param sortOption Sorting option, supports 'updatedDesc'/'updatedAsc'/'createdDesc'/'createdAsc'/'titleAsc'/'titleDesc'
 * @param language Language/locale for title sorting
 * @returns Sorted array of bookmarks
 */
export function sortBookmarks(
  bookmarks: BookmarkItem[],
  sortOption: SortOption,
  language: 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'fr' = 'zh-CN'
): BookmarkItem[] {
  return [...bookmarks].sort((a, b) => {
    const [urlA, entryA] = a
    const [urlB, entryB] = b

    switch (sortOption) {
      case 'updatedDesc':
        return entryB.meta.updated - entryA.meta.updated
      case 'updatedAsc':
        return entryA.meta.updated - entryB.meta.updated
      case 'createdDesc':
        return entryB.meta.created - entryA.meta.created
      case 'createdAsc':
        return entryA.meta.created - entryB.meta.created
      case 'titleAsc':
        return (entryA.meta.title || urlA).localeCompare(
          entryB.meta.title || urlB,
          language,
          {
            sensitivity: 'base',
            ignorePunctuation: true,
            numeric: true,
          }
        )
      case 'titleDesc':
        return (entryB.meta.title || urlB).localeCompare(
          entryA.meta.title || urlA,
          language,
          {
            sensitivity: 'base',
            ignorePunctuation: true,
            numeric: true,
          }
        )
      default:
        return 0
    }
  })
}
