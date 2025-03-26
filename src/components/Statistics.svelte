<script>
  let {
    totalBookmarks = 0,
    selectedTagsCount = 0,
    selectedDomainsCount = 0,
  } = $props()
</script>

<div class="flex gap-4 px-4 py-3">
  <div class="flex items-center gap-2">
    <span class="flex items-center text-lg text-blue-500">🔖</span>
    <div class="flex flex-col justify-center">
      <span class="text-xs font-medium text-gray-500 dark:text-gray-300"
        >书签总数</span>
      <span class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {totalBookmarks}</span>
    </div>
  </div>
  <div class="my-auto h-full w-px self-stretch bg-gray-200 dark:bg-gray-700">
  </div>
  <div class="flex items-center gap-2">
    <span class="flex items-center text-lg text-green-500">🏷️</span>
    <div class="flex flex-col justify-center">
      <span class="text-xs font-medium text-gray-500 dark:text-gray-300"
        >使用标签</span>
      <span class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {selectedTagsCount}</span>
    </div>
  </div>
  <div class="my-auto h-full w-px self-stretch bg-gray-200 dark:bg-gray-700">
  </div>
  <div class="flex items-center gap-2">
    <span class="flex items-center text-lg text-purple-500">🌐</span>
    <div class="flex flex-col justify-center">
      <span class="text-xs font-medium text-gray-500 dark:text-gray-300"
        >来源域名</span>
      <span class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {selectedDomainsCount}</span>
    </div>
  </div>
</div>
