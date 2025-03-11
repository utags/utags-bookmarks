/**
 * 美化URL：
 * 1. 移除跟踪参数（utm_*, fbclid等）
 * 2. 简化路径（保留前2段或最后1段）
 * 3. 移除末尾斜杠
 * 4. 解码特殊字符
 * 5. 移除协议和www前缀
 * @param {string} url - 需要处理的原始URL
 * @returns {string} 处理后的简洁可读URL
 */
export function humanizeUrl(url: string) {
  try {
    const parsed = new URL(url)

    // 过滤常见跟踪参数，保留其他有效查询参数
    const allowedParameters = [...parsed.searchParams].filter(
      ([key]) => !/^(utm_|fbclid|gclid|mc_|yclid|_ga|zanpid)/.test(key)
    )

    // 路径简化逻辑：超过2段时保留首段和末段，否则保持原样
    const pathSegments = parsed.pathname.split('/').filter(Boolean)
    const simplifiedPath =
      pathSegments.length > 2
        ? `/${pathSegments[0]}/.../${pathSegments.slice(-1).join('')}`
        : parsed.pathname

    // 使用清理后的参数和简化路径构建新URL对象
    const cleaned = new URL(parsed.origin)
    cleaned.pathname = simplifiedPath
    for (const [k, v] of allowedParameters) {
      cleaned.searchParams.set(k, v)
    }

    // 解码URI组件并移除协议、www前缀及末尾斜杠
    return decodeURIComponent(`${cleaned.toString()}${parsed.hash}`)
      .replace(/\/$/, '')
      .replace(/^(https?:\/\/)?(www\.)?/, '')
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split(/[?#]/)[0]
  }
}
