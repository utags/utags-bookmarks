export const sortOptions = [
  { value: 'updatedDesc', label: '更新时间 ↓' },
  { value: 'updatedAsc', label: '更新时间 ↑' },
  { value: 'createdDesc', label: '创建时间 ↓' },
  { value: 'createdAsc', label: '创建时间 ↑' },
  { value: 'titleAsc', label: '标题 (A > Z)' },
  { value: 'titleDesc', label: '标题 (Z > A)' },
] as const

export type SortOption = (typeof sortOptions)[number]['value']
