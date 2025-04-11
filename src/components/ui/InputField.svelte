<script>
  export let id = ''
  export let value = ''
  export let placeholder = ''
  export let disabled = false
  export let error = ''
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
    class="w-full rounded-xl border-2 {error
      ? 'border-red-500 ring-red-200 focus:border-red-500'
      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'} bg-white px-4 py-2.5 transition-all outline-none dark:border-gray-600 dark:bg-gray-700 dark:focus:border-indigo-500 {disabled
      ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700/20'
      : ''}" />

  {#if error}
    <div class="mt-1 text-sm text-red-500 dark:text-red-400">
      {error}
    </div>
  {/if}
</div>
