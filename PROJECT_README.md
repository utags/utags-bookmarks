# UTags 书签管理系统 - 技术文档

## 项目概述

UTags 是一个现代化的书签管理工具，专注于：

- 高效的书签组织和检索
- 多维度分类和筛选
- 简洁直观的用户界面
- 跨设备同步支持

## 核心特性

### 筛选功能

- 三重筛选维度：标签(Tags)、域名(Domains)、关键词(Keywords)
- 组合筛选逻辑支持 AND/OR 条件
- 实时筛选结果反馈

### 用户界面

- 响应式布局，适配桌面/移动端
- 暗黑/明亮双主题模式
- 动画过渡效果
- 键盘快捷键支持

## 技术架构

### 前端技术栈

| 技术         | 版本 | 用途                 |
| ------------ | ---- | -------------------- |
| Svelte       | 5.x  | 核心框架(Runes 语法) |
| TypeScript   | 4.9+ | 类型检查             |
| Tailwind CSS | 3.x  | UI 样式系统          |
| Vite         | 4.x  | 构建工具             |
| Lucide       | 最新 | 图标系统             |
| Workbox      | 6.x  | PWA 支持             |

### PWA 支持规范

1. **核心要求**

   - 必须提供完整的 Web App Manifest
   - 必须注册 Service Worker
   - 必须支持 HTTPS 协议
   - 必须实现离线缓存策略

2. **缓存策略**

   - 使用 Workbox 进行资源预缓存
   - 核心应用资源采用"缓存优先"策略
   - API 请求采用"网络优先"策略
   - 静态资源缓存有效期 30 天

3. **开发注意事项**

   - Service Worker 文件必须放在项目根目录
   - 避免在 Service Worker 中缓存过大文件
   - 每次发布新版本需更新缓存版本号
   - 实现适当的缓存清理机制

4. **测试要求**

   - 验证离线状态下核心功能可用性
   - 测试安装到主屏幕流程
   - 检查不同网络条件下的降级处理
   - 验证缓存更新机制

5. **性能优化**
   - 关键资源预加载
   - 使用 Compression 压缩静态资源
   - 实现骨架屏提升感知性能
   - 避免同步的 localStorage 操作

## 扩展说明

### PWA 实现细节

```typescript
// Service Worker 注册示例
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      // 处理更新
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "activated") {
            // 通知用户刷新页面
          }
        });
      });
    });
  });
}
```

### 最佳实践

1. **缓存策略选择**

   - 静态资源: CacheFirst + 版本控制
   - API 数据: NetworkFirst + 回退缓存
   - 用户生成内容: StaleWhileRevalidate

2. **更新处理**

   - 使用 skipWaiting 自动更新
   - 实现版本提示 UI
   - 重大更新强制刷新

3. **离线体验**

   - 提供有意义的离线页面
   - 缓存关键 API 响应
   - 实现后台同步机制

4. **安装提示**
   - 自定义安装引导流程
   - 跟踪安装事件
   - 提供安装后的引导

### 状态管理

- 组件级状态：`$state`
- 应用级状态：`$derived` + 自定义 stores
- URL 持久化：筛选条件自动同步到 URL hash

## 开发约定

1. 组件命名使用 PascalCase
2. 变量命名使用 camelCase
3. 优先使用 Tailwind 类，必要时才写自定义 CSS
4. 暗黑模式样式需显式声明

## 代码规范

### 组件开发

```svelte
<script>
  // Props声明
  let { prop1, prop2 } = $props()

  // 状态管理
  let count = $state(0)
  $derived((double = count * 2))
</script>

<!-- 模板 -->
<div class="container mx-auto p-4">
  <!-- 内容 -->
</div>

<style>
  /* 仅当Tailwind无法满足时才添加 */
  .custom-style {
    /* ... */
  }
</style>
```

```svelte
<script>
  // 事件处理使用onclick而非on:click
  function handleClick() {
    console.log('Button clicked')
  }
</script>

<button onclick={handleClick}> Click me </button>
```

### 样式指南

1. **布局类**：优先使用 Tailwind 的 flex 系统
2. **间距系统**：基于 Tailwind 的 spacing scale(0.25rem 增量)
3. **颜色系统**：
   - 主色：blue-500
   - 辅助色：green-500/purple-500
   - 暗黑模式：dark:前缀

### 图标系统

- **Lucide**：现代化、轻量级的图标库
- 特性：
  - 按需导入，优化打包体积
  - 支持自定义大小和颜色
  - 与 Tailwind 样式系统完美集成
  - 提供丰富的常用图标集合

## 导航项样式规范

1. **标题样式**：

   - 使用 `flex w-full items-center gap-2 rounded-md px-2 py-1.5` 基础布局
   - 文字样式：`text-sm font-medium text-gray-700 dark:text-gray-200`
   - 悬停效果：`hover:bg-gray-100 dark:hover:bg-gray-800`
   - 图标尺寸：主图标 20px，箭头图标 16px

2. **子项样式**：
   - 内边距：`px-2 py-1.5`
   - 文字样式：`text-sm text-gray-600 dark:text-gray-300`
   - 图标尺寸：16px

## 项目结构详解

```
/src
│── /components         # 公共组件
│   ├── filters/        # 筛选相关组件
│   ├── ui/             # 基础UI组件
│   └── ...
│── /lib                # 工具库
│   ├── bookmarks.ts    # 书签操作
│   ├── filters.ts      # 筛选逻辑
│   └── ...
│── /stores             # 状态管理
│   ├── settings.js     # 用户设置
│   └── ...
└── /styles             # 全局样式
    ├── base.css        # 基础样式
    └── transitions.css # 动画样式
```

## 开发工作流

1. **分支策略**：Git Flow
2. **提交规范**：Conventional Commits
3. **代码检查**：ESLint + Prettier
4. **测试策略**：Vitest + Testing Library

## 扩展说明

### 筛选条件数据结构

```typescript
interface FilterCondition {
  type: "tag" | "domain" | "keyword";
  value: string;
  operator?: "AND" | "OR";
}
```

### 性能优化

- 虚拟滚动：长列表渲染
- 防抖处理：搜索输入
- 条件渲染：复杂组件

## 开发中遇到的问题及解决方法

### Svelte 属性值中的特殊字符解析问题

**问题描述**：
当使用 Svelte 的属性绑定语法时，如果属性值包含右括号 `)` 字符，会导致模板解析错误。例如：

```svelte
<a {href}>{href}</a>
```

当 `href` 值为 `http://example.com/?a=(1)` 时，会被错误解析为：

```html
<a href="http://example.com/?a=(1">http://example.com/?a=(1</a>)
```

**问题原因**：
Svelte 的模板编译器会将属性值中的 `)` 误认为是绑定语法的结束符，导致解析中断。

**解决方案**：
通过嵌套 `span` 元素隔离特殊字符，确保正确解析：

```svelte
<a {href}><span>{href}</span></a>
```

**最佳实践建议**：

1. 对于可能包含特殊字符的动态属性值，优先使用子元素包裹
2. 在 URL 处理场景中，考虑先进行 encodeURIComponent 处理
3. 复杂 URL 场景建议使用专门的 URL 处理工具库

## 关于此文档

这个文档详细记录了项目的技术特点和代码规范，可以帮助新成员和任何 AI 助手快速理解项目上下文和开发风格。文档包含了：

1. 技术栈明细
2. 代码结构说明
3. 典型代码模式
4. 开发约定

## 文档维护

此文档应随项目演进定期更新，特别是：

1. 技术栈升级时
2. 架构重大调整时
3. 新增核心功能时
