<script>
  import { defaultFavicon } from '../constants.js'
  let { href, classNames = '' } = $props()
</script>

<img
  src={`https://wsrv.nl/?w=16&h=16&url=www.google.com/s2/favicons?domain=${new URL(href).hostname}&default=${defaultFavicon}`}
  class={classNames}
  loading="lazy"
  alt="favicon" />
