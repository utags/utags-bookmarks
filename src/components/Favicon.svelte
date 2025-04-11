<script>
  import { defaultFavicon } from '../constants.js'
  let { href, classNames = '' } = $props()
  // TODO: 获取不到 favicon 时，使用首字母图片作为 favicon。标题或域名首字母
</script>

<img
  src={`https://wsrv.nl/?w=16&h=16&url=www.google.com/s2/favicons?domain=${new URL(href).hostname}&default=${defaultFavicon}`}
  class={classNames}
  loading="lazy"
  alt="favicon" />
