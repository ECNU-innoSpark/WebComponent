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

## 设计文档

样式设计文档位于：

- [docs/design/README.md](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/docs/design/README.md)

当前已覆盖：

- 通用样式基础
- `ChatPanel`
- `SessionListPanel`
- `FileManagerPanel`
- `FilePreviewPanel`
- `KnowledgeGraphPanel`

这些文档的目标不是展示效果，而是让开发者仅根据文档就能还原同风格、同结构的完整组件代码。

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

## 源码安装

现在仓库内置了一个轻量版源码安装 CLI，思路接近 `shadcn`：

- 不强制把组件作为黑盒 npm 依赖引入
- 直接把组件源码复制到你的项目里
- 自动补齐内部共享样式文件与所需外部依赖

初始化配置：

```bash
pnpm dlx @innospark/ai-web-component init
```

安装单个组件：

```bash
pnpm dlx @innospark/ai-web-component add chat-panel
```

一次安装多个组件：

```bash
pnpm dlx @innospark/ai-web-component add session-list-panel file-manager-panel
```

查看可安装组件：

```bash
pnpm dlx @innospark/ai-web-component view
pnpm dlx @innospark/ai-web-component view chat-panel
```

默认会把组件源码放到 `src/components/aiwc/`，并生成：

```text
src/components/aiwc/
├── ChatPanel.tsx
├── shared/
├── styles/
└── index.ts
```

如果当前还没发布到 npm，也可以直接在仓库内本地测试：

```bash
pnpm aiwc view
pnpm aiwc add chat-panel --cwd /path/to/your-app
```

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
