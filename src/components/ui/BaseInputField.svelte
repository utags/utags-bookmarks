<script>
  export let id = ''
  export let value = ''
  export let placeholder = ''
  export let disabled = false
  export let onBlur = () => {}
  export let onInput = () => {}
  export let onKeydown = () => {}
</script>

<div class="flex flex-col gap-2">
  <label for={id} class="text-sm font-medium text-gray-700 dark:text-gray-300">
    <slot />
  </label>
  <input
    {id}
    type="text"
    bind:value
    {placeholder}
    {disabled}
    on:blur={onBlur}
    on:input={onInput}
    on:keydown={onKeydown}
    class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-indigo-500 {disabled
      ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700/20'
      : ''}" />
</div>
