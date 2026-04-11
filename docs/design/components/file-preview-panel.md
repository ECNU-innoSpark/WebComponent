# FilePreviewPanel Design Spec

## 1. 组件定位

`FilePreviewPanel` 用于展示文件正文或结构化内容。

它不是完整编辑器，而是一个“轻型预览/阅读容器”。

目标风格：

- 安静、稳定、可长时间阅读
- 头部信息清晰，但不抢占主体内容
- 内容区域像工作台里的阅读面板，而不是营销代码框

参考来源：

- `text-styles.svg`
- `general.svg`
- [FilePreviewPanel.tsx](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/components/FilePreviewPanel.tsx)

## 2. 结构

1. 可选头部
2. 状态区
3. 预览容器

头部包含：

- 标题
- 副标题
- 文件名 badge
- 语言 badge
- `headerActions`

## 3. 外层容器

- 默认使用 `panelSurfaceStyle`
- `hideHeader` 时透明化外层
- body 最小高度：`320px`

## 4. 头部设计

### 4.1 标题说明

副标题默认可以是一句能力说明，例如：

- 支持文本、Markdown、JSON 等结构化内容

### 4.2 元信息标签

标签行推荐两个 badge：

- 文件名：有文件时 `accent`，无文件时 `neutral`
- 语言：始终 `secondary`

### 4.3 头部原则

- 元信息比标题弱一级
- 不要把文件名放成主标题
- `headerActions` 尽量控制在 1 至 2 个

## 5. 内容容器

### 5.1 外观

内容容器应明显区别于外层面板，但仍保持轻量：

- 背景：`colorSurfaceRaised`
- 边框：`1px solid colorBorder`
- 圆角：`radiusSmall`
- 内边距：`14px`
- `minHeight: 280`
- `overflow: auto`

### 5.2 原始文本模式

当 `content` 是字符串或数字时：

- 使用 `pre`
- `white-space: pre-wrap`
- 等宽字体
- 字号：`13px`
- 行高：`1.7`
- 边距：`0`

### 5.3 自定义内容模式

当 `content` 是 ReactNode：

- 外层内容框依然保留
- 由业务层渲染真正内容

## 6. 状态设计

仅当没有正文内容时，才显示状态块：

- `error`
- `loading`
- `empty`

如果已经有内容，即使状态字段变化，也优先展示正文。

这是为了避免预览区在轻度刷新时闪回状态页。

## 7. `hideHeader` 模式

嵌入式时：

- 去掉面板壳
- body padding 置零
- 保留正文预览容器本身的边框和背景

这样外层 pane 标题栏和内部预览区域职责清晰。

## 8. 响应式规则

- badge 行允许换行
- 长文件名不应撑爆头部布局
- 内容容器需要内部滚动，而不是撑高整个窗格

## 9. 实现检查清单

- 是否区分原始文本和自定义节点内容
- 是否保证没有内容时才显示状态块
- 是否保留轻量的内容容器边框
- `hideHeader` 时是否避免双层标题结构
