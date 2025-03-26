# 贡献指南

## 开发环境要求

- Node.js 18+
- npm 9+
- 推荐使用 VS Code

## 代码规范

- 严格遵守项目中的.prettierrc.cjs 格式配置
- 使用 ESLint 进行 TypeScript 校验
- 通过 lint-staged 实现提交前自动格式化

## 提交信息规范

```
<类型>(<作用域>): <主题>

[可选正文]

[可选脚注]
```

有效类型：feat|fix|docs|style|refactor|test|chore

## 测试要求

- 新功能需保持 80%以上测试覆盖率
- 推送代码前执行 `npm test`
- 更新快照使用 `npm test -- -u`

## Issue/PR 流程

1. 使用官方模板提交
2. 关联相关 Issue
3. 仅接受 Squash 合并

## 多语言维护

- 保持 CONTRIBUTING.md 与 CONTRIBUTING.zh-CN.md 内容同步
- 重大变更需同时更新两个版本
- 翻译建议请通过 GitHub Discussions 提出
