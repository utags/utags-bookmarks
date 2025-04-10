# UTags 书签管理器

[![开源协议](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![构建状态](https://img.shields.io/github/actions/workflow/status/utags/utags-bookmarks/ci.yml?branch=main)](https://github.com/utags/utags-bookmarks/actions)
[![UTags 官方网站](https://img.shields.io/badge/UTags-官方站点-brightgreen)](https://utags.link)

> [English](README.md) | 中文

## 🚀 项目概览

**UTags 书签管理器**是一款创新的书签管理系统，通过多维标签体系组织网络资源。专为开发者和高级用户设计，提供强大的筛选能力和可视化功能，帮助高效管理海量书签。

欢迎访问[官方网站 (https://utags.link)](https://utags.link/) 探索完整功能。

## ✨ 核心功能

- 多维标签管理系统
- 支持 AND/OR 逻辑的复合筛选系统
- 基于 LocalStorage 的本地数据持久化
- **渐进式 Web 应用 (PWA) 支持**：
  - 可安装到桌面/移动设备
  - 离线访问书签数据
  - 自动后台更新
- 与[小鱼标签 (UTags) 扩展/用户脚本](https://github.com/utags/utags)完美配合

### 更多功能与特点

- 渐进式 Web 应用特性：
  - 添加到主屏幕 (A2HS)
  - 通过 Service Worker 缓存的离线模式
  - 通过 Web App Manifest 实现类原生应用体验
- 完全开源免费使用
- 便捷的自托管部署
- 筛选条件预设保存
- 数据导入/导出功能
- 多设备同步功能（待实现）（付费服务）
- 可视化数据统计看板
- 明暗主题支持
- 响应式布局多视图模式
- 跨浏览器兼容性支持

## 使用指南

### 书签添加流程

1. **管理界面添加**

   - 通过书签管理界面直接录入

2. **浏览器扩展采集**

   - 安装 [UTags 浏览器扩展/用户脚本](https://github.com/utags/utags)
   - 在浏览网页时，沉浸式收藏书签

3. **书签小工具(Bookmarklet)**

   - 拖动小工具到书签栏
   - 在任何页面点击触发采集

4. **自定义插件开发**
   - 通过开放 API 实现自己的浏览器扩展或油猴脚本

### 筛选器使用规范

1. **基础筛选条件**

   - 关键词匹配（标题，链接，标签）
   - 标签单选或多选（逻辑 OR）
   - 域名单选或多选（逻辑 OR）

2. **复合逻辑运算**

   - 支持 AND/OR/NOT 逻辑组合
   - 可嵌套多层条件组合
   - 实时显示匹配结果统计

3. **预设管理**
   - 将常用筛选组合保存为预设方案
   - 可通过侧边栏快速调用收藏的预设筛选器
   - 支持预设方案的导入/导出（待实现）

## 🛣 开发路线

- **书签管理增强**

  - 编辑/删除书签
  - 批量修改/删除标签
  - 批量删除书签
  - 批量添加标签
  - 添加备注功能
  - 备注查看界面
  - 支持使用正则表达式进行筛选
  - 批量打开所有书签
  - 多级标签支持，如：`标签1/标签2/标签3`
  - 全局搜索功能。在任意网站通过快捷键，启动搜索功能，搜索所有书签、标签和备注

- **书签收集方案**

  - 通过 [UTags 扩展/用户脚本](https://github.com/utags/utags) 添加书签
  - 通过 bookmarklet 添加书签
  - 自动获取标题，网页简介
  - AI 智能推荐标签

- **界面风格**

  - 自定义样式选项
  - 导航网站视图
  - 卡片视图

- **数据互通性**

  - Gist or GitHub 导入/导出支持（免费）
  - WebDAV 导入/导出支持（免费）
  - 多设备加密同步方案，增量同步策略，冲突解决机制（付费服务）
  - 浏览器书签导入（Chrome/Edge/Firefox）
  - 书签导出/导入功能增强
    - 选择部分标签导入/导出
    - 选择部分域名单导入/导出
    - 交互式导入/导出
  - 书签数量级超大时使用 IndexedDB  存储
  - 保存书签到 Internet Archive
  - 失效链接检测

## 📦 安装与使用

### 环境要求

- Node.js 18+
- npm 9+

### 开发模式

```bash
npm install
npm run dev
```

访问地址 `http://localhost:5173`

### 生产构建

```bash
npm run build
npm run preview
```

## 🛠 开发指南

### 数据管理

生成开发测试数据：

```bash
node generate-mock-data.js
```

开发数据存储在浏览器本地存储中，重置方法：

1. 进入网站，打开浏览器开发者工具
2. 选择 Application → Local storage → 清除数据

## 🤝 贡献指南

欢迎通过以下方式参与贡献：

- 🐛 GitHub Issues 提交缺陷报告
- 💡 Pull Requests 提交功能改进

请遵循[贡献指南](CONTRIBUTING.zh-CN.md)进行操作。

## 📄 许可协议

Copyright (c) 2025 [Pipecraft](https://www.pipecraft.net)。基于 [MIT 协议](LICENSE) 授权。

---

[![Pipecraft 生态](https://img.shields.io/badge/Pipecraft-技术生态-2EAADC)](https://www.pipecraft.net)
[![UTags 官网](https://img.shields.io/badge/UTags-官方网站-brightgreen)](https://utags.link)
