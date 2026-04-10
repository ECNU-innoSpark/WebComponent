# AIWebComponent

`AIWebComponent` 是独立的 React 组件仓库，专门沉淀 InnoSpark 平台需要的高层 Web UI 组件，并且能够方便地对接 [OpenAgentHarness](https://github.com/fairyshine/OpenAgentHarness)。

当前规划优先围绕以下四类组件建设：

- 对话组件
- 对话列表组件
- 文件管理组件
- 文件预览组件
- 图谱与结构化关系可视化组件

当前已实现的首批组件：

- `ChatPanel`
- `SessionListPanel`
- `FileManagerPanel`
- `FilePreviewPanel`
- `KnowledgeGraphPanel`

## 目录建议

```text
AIWebComponent/
├── docs/
│   └── design/
├── src/
│   ├── components/
│   ├── styles/
│   └── index.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 开发目标

- 保持与业务应用解耦
- 优先提供适合微学习工作台的高层业务组件，而不是零散基础控件
- 统一承接视觉规范、设计 token 来源与组件资产沉淀
- 后续可扩展为私有 npm 包或单独发布仓库

## 当前进度

- 组件外壳、状态卡片、徽标与标题区域已统一到 InnoSpark 浅底蓝紫视觉语言
- `KnowledgeGraphPanel` 已补齐 `loading / empty / error` 等状态能力
- 各面板都支持通过 `titleIcon`、`emptyVisual`、`loadingVisual`、`errorVisual` 以及对应 action 槽位接入更完整的引导内容
- Showcase 已接入官方教育图标资源，用于演示真实接入方式

## 使用方式

```tsx
import {
  ChatPanel,
  FileManagerPanel,
  FilePreviewPanel,
  KnowledgeGraphPanel,
  SessionListPanel
} from "@innospark/ai-web-component";
```

这些组件保持纯 `props` 驱动，不在内部发请求；推荐由业务层负责数据获取、状态管理和动作回调。

## 组件展台

仓库现在提供一个独立的 Web Showcase 页面，用来直接查看各个组件的样式与组合效果。

```bash
pnpm dev
```

开发脚本默认优先使用 `5173` 端口；如果端口已被占用，会自动顺延到下一个可用端口并打印提示。

如果需要继续监听组件库产物构建，使用：

```bash
pnpm run dev:lib
```

类型检查与构建：

```bash
pnpm run typecheck
pnpm run build
```
