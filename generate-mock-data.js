const fs = require('fs')
const domains = ['example.com', 'test.org', 'demo.net', 'sample.co']
const paths = ['article', 'post', 'blog', 'news', 'product']
const genCount = 10000

const generateBookmarks = () => {
  const data = {}
  const now = Date.now()

  for (let i = 0; i < genCount; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const path = paths[Math.floor(Math.random() * paths.length)]
    const url = `https://${domain}/${path}-${Math.random().toString(36).substring(2, 7)}`

    const created = Math.max(now - Math.floor(Math.random() * 31536000000), 0) // 确保不早于1970年
    const maxUpdate = Math.min(
      created + Math.floor(Math.random() * 2592000000),
      now
    ) // 取当前时间和30天后的较小值
    const updated = Math.random() > 0.2 ? maxUpdate : created // 保持20%几率不更新

    // 新增随机标签生成函数
    const generateRandomTag = () => {
      const length = Math.floor(Math.random() * 10) + 1
      let tag = ''
      const chineseChars = [
        '技术',
        '设计',
        '商业',
        '生活',
        '娱乐',
        '教育',
        '健康',
        '旅游',
        '云',
        '端',
        '智能',
        '安全',
        '数据',
        '分析',
        '学习',
      ]
      const englishParts = [
        'AI',
        'Cloud',
        'Data',
        'Tech',
        'Dev',
        'Net',
        'Sys',
        'Web',
        'App',
        'Mobile',
      ]

      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.3) {
          tag += chineseChars[Math.floor(Math.random() * chineseChars.length)]
        } else {
          tag += englishParts[Math.floor(Math.random() * englishParts.length)]
        }
      }
      return tag.substring(0, length)
    }

    // 修改tags生成逻辑
    const tagCount = Math.floor(Math.random() * 5) + 1
    const tags = Array.from({ length: tagCount }, () => generateRandomTag())

    data[url] = {
      tags,
      meta: {
        title: `测试条目 ${i + 1}`,
        created,
        updated: updated,
      },
    }
  }
  return { data }
}

fs.writeFileSync('mock-data.json', JSON.stringify(generateBookmarks(), null, 2))
console.log(`成功生成${genCount}条测试数据到 mock-data.json`)
