export const sortOptions = [
  { value: 'updated', label: '更新时间' },
  { value: 'created', label: '创建时间' },
  { value: 'titleAsc', label: '标题正序' },
  { value: 'titleDesc', label: '标题倒序' },
] as const

export type SortOption = (typeof sortOptions)[number]['value']
