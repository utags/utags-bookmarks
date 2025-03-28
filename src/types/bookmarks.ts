/**
 * The tags and metadata of a bookmark.
 */
export type BookmarkTagsAndMetadata = {
  tags: string[]
  meta: {
    title?: string
    created: number
    updated: number
  }
}

/**
 * The key is the URL of the bookmark.
 */
export type BookmarkKey = string

/**
 * The value is an object containing the tags and metadata of the bookmark.
 */
export type BookmarksData = Record<BookmarkKey, BookmarkTagsAndMetadata>

/**
 * The bookmarks store.
 */
export type BookmarksStore = {
  data: BookmarksData
  meta: {
    databaseVersion: number
    created: number
  }
}
