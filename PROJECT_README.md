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
