export const viewModes = [
  { value: 'list', label: '列表' },
  { value: 'compact', label: '紧凑 1' },
  { value: 'compact2', label: '紧凑 2' },
  { value: 'simple', label: '极简 1' },
  { value: 'simple2', label: '极简 2' },
  { value: 'simple3', label: '极简 3' },
] as const

export type ViewMode = (typeof viewModes)[number]['value']
