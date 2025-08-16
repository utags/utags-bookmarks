# UTags 书签管理器

[![开源协议](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![构建状态](https://img.shields.io/github/actions/workflow/status/utags/utags-bookmarks/ci.yml?branch=main)](https://github.com/utags/utags-bookmarks/actions)
[![UTags 官方网站](https://img.shields.io/badge/UTags-官方站点-brightgreen)](https://utags.link)

## 🚀 项目概览

**UTags 书签管理器**是一个现代化的书签管理工具，专为开发者和资深用户打造。告别传统书签管理的混乱，通过**灵活的标签系统**和**强大的筛选引擎**，让您的网络资源管理变得井然有序、高效便捷。

🌐 [立即体验官方网站](https://utags.link/) | 🔗 [与 UTags 浏览器扩展无缝集成](https://github.com/utags/utags)

## ✨ 核心特性

### 🏷️ 智能标签管理

- **多维标签系统**：为书签添加多个标签，实现多维度精准分类
- **层级标签结构**：支持 `父标签/子标签/孙标签` 的树形组织方式
- **标签自动补全**：智能建议和快速输入，提升标记效率（Comming soon）

### 🔍 强大筛选引擎

- **复合逻辑筛选**：支持 AND/OR/NOT 逻辑组合的高级筛选
- **正则表达式匹配**：精确匹配复杂搜索模式
- **渐进式筛选**：在筛选结果中再次筛选，逐步精确定位
- **实时搜索反馈**：即时显示匹配结果和统计信息
- **筛选条件预设保存**：保存常用筛选条件，一键快速应用
- **智能收藏集**：基于筛选条件创建动态收藏集，自动更新匹配内容

### 🔄 数据同步与备份

- **多平台同步**：通过 GitHub 和 WebDAV 实现跨设备数据同步
- **自动云端备份**：定时备份，数据安全有保障
- **数据导入导出**：支持主流浏览器书签格式（Chrome/Edge/Firefox/Safari）

### 📱 现代化体验

- **PWA 应用**：支持离线访问、添加到主屏幕等原生应用体验
- **响应式设计**：完美适配桌面端和移动端
- **明暗主题**：护眼模式，适应不同使用场景
- **多视图模式**：列表、卡片、紧凑等多种展示方式

## 🎯 产品优势

- ✅ **完全开源免费**：MIT 开源协议，无需注册，永久免费使用
- ✅ **没有广告**：纯净体验，专注于书签管理本身
- ✅ **没有书签保存个数限制**：无限制保存您的所有书签
- ✅ **隐私安全**：本地数据存储，用户完全掌控
- ✅ **轻松部署**：支持自托管，一键部署到个人服务器
- ✅ **数据可视化**：直观的统计看板，了解使用习惯
- ✅ **跨浏览器兼容**：支持所有现代浏览器

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
  - [x] 与 UTags 扩展/脚本集成
  - 导入书签时合并处理

- V1.1 TODO

  - 批量修改标签名
  - 批量打开所有书签
  - 层级标签移动到筛选器里
  - 输入标签时，显示自动完成功能，推荐列表功能

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
  - 官方云同步功能
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

### 生产环境部署

#### 方法 1：从源码构建部署

```bash
# 克隆仓库
git clone https://github.com/utags/utags-bookmarks.git
cd utags-bookmarks

# 安装依赖
npm install

# 构建生产版本
npm run build

# 选项1：将 dist 文件夹部署到你的 Web 服务器
# 构建文件将位于 'dist' 目录中

# 选项2：启动本地预览服务器
npm run preview
# 这将在 http://localhost:4173 提供构建文件的服务
```

#### 方法 2：部署预构建版本

```bash
# 克隆 gh-pages 分支（包含预构建文件）
git clone -b gh-pages --single-branch https://github.com/utags/utags-bookmarks.git utags-bookmarks-dist
cd utags-bookmarks-dist

# 将文件部署到你的 Web 服务器
# 此目录中的所有文件都已准备好部署
```

**更新到最新版本：**

```bash
cd utags-bookmarks-dist

# 获取并重置到最新版本
# 注意：gh-pages 分支的历史记录会在每次更新时被覆盖
git fetch origin gh-pages
git reset --hard origin/gh-pages

# 重新部署更新后的文件到你的 Web 服务器
```

> **注意**：对于生产环境部署，请确保你的 Web 服务器配置为提供静态文件服务，并处理单页应用的客户端路由。

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
