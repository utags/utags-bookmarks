# UTags 书签管理器

[![开源协议](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![构建状态](https://img.shields.io/github/actions/workflow/status/utags/utags-bookmarks/ci.yml?branch=main)](https://github.com/utags/utags-bookmarks/actions)
[![UTags 官方网站](https://img.shields.io/badge/UTags-官方站点-brightgreen)](https://utags.link)

## 🚀 项目概览

**UTags 书签管理器**是一个现代化的书签管理工具，旨在帮助开发者和资深用户摆脱书签杂乱无章的困扰。它不同于传统的书签管理方式，采用了**灵活的标签系统**和**强大的筛选功能**，让用户能够更高效地管理和查找网络资源。

欢迎访问[官方网站 (https://utags.link)](https://utags.link/) 探索完整功能。

## ✨ 核心功能

- **多维标签管理系统** ：支持为书签添加多个标签，实现多维度分类
- **层级标签支持** ：支持层级标签结构，如 `标签/子标签/孙标签`，便于组织复杂标签体系
- **高级筛选系统** ：支持 AND/OR/NOT 逻辑组合的复合筛选
- **正则表达式匹配** ：支持使用正则表达式进行精确匹配
- **渐进式筛选** : 支持在筛选结果里再次筛选，逐步缩小范围，实时显示匹配结果
- **本地数据持久化** ：基于 LocalStorage 实现数据本地存储
- **PWA 支持** ：实现渐进式 Web 应用特性，包括离线访问、添加到主屏幕等
- **与 UTags 扩展/脚本集成** ：与[小鱼标签 (UTags) 浏览器扩展和用户脚本](https://github.com/utags/utags)无缝配合

### 更多功能与特点

- 完全开源免费使用
- 便捷的自托管部署
- 筛选条件预设保存
- 创建智能收藏集
- 数据导入/导出功能
- 多设备同步功能（待实现）（付费服务）
- 渐进式 Web 应用特性：
  - 添加到主屏幕 (A2HS)
  - 通过 Service Worker 缓存的离线模式
  - 通过 Web App Manifest 实现类原生应用体验
- 可视化数据统计看板
- 明暗主题支持
- 响应式布局多视图模式
- 跨浏览器兼容性支持
- 浏览器书签导入（Chrome/Edge/Firefox/Safari）

## ⚡ 快速入门

1. **安装浏览器扩展（可选）**
   安装 [UTags 扩展](https://github.com/utags/utags) 实现沉浸式收藏

2. **访问管理界面**
   打开 [UTags Web 界面](https://utags.link) 管理书签

3. **基础操作**
   - 添加书签：点击扩展图标或手动录入
   - 筛选书签：使用复合筛选条件
   - 导入书签：支持导入 Chrome/Edge/Firefox/Safari 的书签 HTML 文件

## 使用指南

### 书签添加流程

1. **管理界面添加**: 通过书签管理界面直接录入
2. **浏览器扩展采集**: 安装 [UTags 浏览器扩展/用户脚本](https://github.com/utags/utags), 在浏览网页时沉浸式收藏书签
3. **自定义插件开发**: 通过开放 API 实现自己的浏览器扩展或油猴脚本

### 筛选器使用规范

- 通过关键词、标签、域名和其他元数据进行筛选
- 多级筛选系统支持 AND/OR/NOT 逻辑组合
- 正则表达式匹配
- 保存筛选预设以便快速访问

## 🛣 开发路线图

- V1.0 TODO

  - [x] 批量添加标签
  - [x] 批量删除标签
  - [x] 批量删除书签
  - [x] 国际化
  - 导入书签时合并处理
  - 与 UTags 扩展/脚本集成

- V1.1 TODO

  - 批量修改标签名
  - 批量打开所有书签

- **书签管理增强**

  - 批量修改标签名
  - 批量打开所有书签
  - 全局搜索功能。在任意网站通过快捷键，启动搜索功能，搜索所有书签、标签和备注

- **书签收集解决方案**

  - 通过 [UTags 扩展/用户脚本](https://github.com/utags/utags) 添加书签
  - 自动获取标题，网页简介
  - AI 智能推荐标签

- **界面风格**

  - 自定义样式选项
  - 导航网站风格视图
  - 卡片视图
  - 备注/笔记查看视图
  - 备注/笔记高级编辑/查看界面

- **数据互操作性**

  - Gist/GitHub 导入/导出支持
  - WebDAV 导入/导出支持
  - 多设备同步解决方案
  - 云同步功能
  - 书签导出/导入增强
  - 当书签量极大时使用 IndexedDB 存储

## 🛠 开发

Wiki: [开发指南](https://deepwiki.com/utags/utags-bookmarks)

## 📦 安装与使用

### 开发环境

```bash
npm install
npm run dev
```

在 `http://localhost:5173` 访问应用

## 🤝 贡献

通过以下方式贡献：

- 🐛 [GitHub Issues](https://github.com/utags/utags-bookmarks/issues) - 报告问题
- 💡 [Pull Requests](https://github.com/utags/utags-bookmarks/pulls) - 添加功能
- 💬 [GitHub Discussions](https://github.com/orgs/utags/discussions) - 获取帮助和分享技巧

请遵循我们的[贡献指南](CONTRIBUTING.zh-CN.md)。

## Instances

- [https://utags.link](https://utags.link/)
- [https://utags.top](https://utags.top/)
- [https://utags-bookmarks.pages.dev](https://utags-bookmarks.pages.dev/)
- [https://utags.github.io](https://utags.github.io/)

## 📄 许可证

版权所有 (c) 2025 [Pipecraft](https://www.pipecraft.net)。基于 [MIT 许可证](LICENSE) 授权。

---

[![Pipecraft](https://img.shields.io/badge/Pipecraft-项目-2EAADC)](https://www.pipecraft.net)
[![UTags 官方网站](https://img.shields.io/badge/UTags-官方站点-brightgreen)](https://utags.link)
