<script lang="ts">
  import { onMount } from 'svelte'

  let {
    open = $bindable(false),
    items,
    selectedValue,
    onSelect,
    position = 'right-0',
    width = 'w-40',
  } = $props<{
    open?: boolean
    items:
      | Array<{ value: string; label: string }>
      | readonly { readonly value: string; readonly label: string }[]
    selectedValue: string
    onSelect: (value: string) => void
    position?: string
    width?: string
  }>()

  let menuRef: HTMLDivElement | undefined = $state()

  function handleClickOutside(event: MouseEvent) {
    if (open && menuRef && !menuRef.contains(event.target as Node)) {
      open = false
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      open = false
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  })
</script>

{#if open}
  <div
    bind:this={menuRef}
    class={`absolute ${position} z-50 mt-2 ${width} rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800`}
    role="menu"
    tabindex="0">
    {#each items as item}
      <div
        role="menuitemradio"
        tabindex="0"
        aria-checked={selectedValue === item.value}
        class={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
          selectedValue === item.value
            ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
            : ''
        }`}
        onclick={() => {
          onSelect(item.value)
          open = false
        }}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(item.value)
            open = false
          } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            const next =
              e.currentTarget.nextElementSibling ||
              e.currentTarget.parentElement!.firstElementChild
            ;(next as HTMLElement)?.focus()
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            const prev =
              e.currentTarget.previousElementSibling ||
              e.currentTarget.parentElement!.lastElementChild
            ;(prev as HTMLElement)?.focus()
          }
        }}>
        {item.label}
      </div>
    {/each}
  </div>
{/if}
