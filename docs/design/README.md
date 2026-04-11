# AIWebComponent Design Docs

这组文档用于从样式设计角度定义 `AIWebComponent` 的组件规范。

目标不是展示设计理念，而是让开发者在不回看现有实现的情况下，也能根据文档直接完成同风格、同结构、同状态能力的组件代码。

## 设计来源

- InnoSpark 教育设计规范 skill：
  [$innospark-edu-agent-design](/Users/wumengsong/Code/Innospark_Service/.agents/skills/innospark-edu-agent-design/SKILL.md)
- 对应设计板类别：
  - `general.svg`
  - `navigation.svg`
  - `input-fields.svg`
  - `badge.svg`
  - `text-styles.svg`
- 当前组件源码与样式原语：
  - [tokens.ts](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/styles/tokens.ts)
  - [panelStyles.ts](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/styles/panelStyles.ts)

## 文档结构

- [foundation.md](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/docs/design/foundation.md)
  通用样式基础、面板原语、状态块和实现规则。
- [chat-panel.md](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/docs/design/components/chat-panel.md)
- [session-list-panel.md](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/docs/design/components/session-list-panel.md)
- [file-manager-panel.md](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/docs/design/components/file-manager-panel.md)
- [file-preview-panel.md](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/docs/design/components/file-preview-panel.md)
- [knowledge-graph-panel.md](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/docs/design/components/knowledge-graph-panel.md)

## 使用原则

1. 先看 `foundation.md`，确认 token、层级、状态、圆角和交互边界。
2. 再看具体组件文档，按其中的结构、尺寸、状态和布局规则实现。
3. 如果组件需要新样式，优先在基础文档中补充规则，而不是在单个组件文档里发散定义。

## 当前覆盖范围

已覆盖 5 个高层业务面板和 1 套通用样式基础。

基础控件如 `ActionButton`、`SegmentedControl`、`TextComposer`、`TextEditor`、`ToneBadge` 暂未分别写独立设计文档，默认受 `foundation.md` 约束。
