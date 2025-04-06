# 项目技术文档

## 项目简介

这是一个基于现代Web技术栈的书签管理应用，主要功能包括：

- 书签的增删改查
- 多维度筛选（标签、域名、关键词）
- 响应式界面设计
- 暗黑/明亮模式支持

## 技术栈

### 核心框架

- **Svelte 5**：使用最新版Svelte框架，采用Runes语法
- **TypeScript**：强类型支持

### UI/样式

- **Tailwind CSS**：原子化CSS框架
- **自定义主题**：支持暗黑/明亮模式切换
- **响应式设计**：适配不同屏幕尺寸

### 状态管理

- **Svelte Stores**：本地状态管理
- **URL Hash**：部分状态通过URL持久化

### 构建工具

- **Vite**：项目构建工具
- **PostCSS**：CSS处理

## 代码风格

### 组件结构

- 使用Svelte单文件组件结构
- 组件按功能模块划分
- 采用组合式设计思想

### 样式规范

- 主要使用Tailwind工具类
- 少量自定义CSS通过`<style>`块实现
- 颜色系统遵循Tailwind默认调色板

## 项目结构

```

/src
  /components      # 可复用UI组件
  /lib             # 工具函数和库
  /stores          # 状态管理
  /styles          # 全局样式

```

## 典型代码模式

1. **组件props**：

```svelte
let {(prop1, prop2)} = $props()
```

2. **状态管理**：

```svelte
let count = $state(0)
```

3. **样式类**：

```svelte
class="flex items-center gap-2 bg-white dark:bg-gray-900"
```

## 开发约定

1. 组件命名使用PascalCase
2. 变量命名使用camelCase
3. 优先使用Tailwind类，必要时才写自定义CSS
4. 暗黑模式样式需显式声明

## 关于此文档

这个文档详细记录了项目的技术特点和代码规范，可以帮助任何AI助手快速理解项目上下文和开发风格。文档包含了：

1. 技术栈明细
2. 代码结构说明
3. 典型代码模式
4. 开发约定

当您切换AI模型或开始新对话时，只需提供此文档即可让新的AI助手快速掌握项目情况。
