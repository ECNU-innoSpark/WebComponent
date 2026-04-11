# AIWebComponent Style Foundation

## 1. 文档目的

本文件定义 AIWebComponent 的通用样式基础。

阅读本文件后，开发者应能独立实现：

- 面板类容器
- 面板头部
- 状态卡片
- 语义标签
- 轻量按钮
- 列表选中态
- 图标框

所有高层业务面板都应在这个基础上派生，不得各自重新发明视觉语言。

## 2. 视觉定位

参考 `general.svg`、`text-styles.svg`、`badge.svg`、`input-fields.svg`，整体风格必须满足：

- 浅底、轻量、高信任感
- 面向教育场景，不做企业后台式重压边框
- 留白优先，减少不必要的分割线
- 主强调使用品牌蓝紫，不把每个区域都做成高对比重点
- 能在工作台、多窗格、嵌入式预览等场景中稳定表现

避免：

- 深色大面积底板
- 大量阴影堆叠
- 重卡片化、过多嵌套容器
- 装饰型渐变滥用
- 纯黑文本和过强对比边框

## 3. 样式 Token

基础 token 以 [tokens.ts](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/styles/tokens.ts) 为准。

### 3.1 色彩

- 页面底色：`#f7f7f8`
- 主表面：`#ffffff`
- 弱表面：`#f3f4f6`
- 提升表面：`#f8fafc`
- 常规边框：`#e5e7eb`
- 强边框：`#d1d5db`
- 主文本：`#111827`
- 次文本：`#4b5563`
- 辅助文本：`#6b7280`
- 主强调：当前代码中为深墨色 `#111827`
- 品牌软强调：`#f3f4f6`
- 成功：`#1eb478`
- 警告：`#f4a403`
- 危险：`#e25578`

### 3.2 圆角

- 主面板圆角：`14`
- 子卡片圆角：`10`
- 胶囊标签圆角：`999`

### 3.3 阴影

当前系统以无阴影或极弱阴影为主：

- 默认面板：无阴影
- 激活图谱节点：`shadowSoft`
- 拖拽和 showcase 层可以单独定义更强视觉反馈，但不写入业务面板基础规范

## 4. 排版层级

参考 `text-styles.svg`。

### 4.1 面板标题

- 字号：`16px`
- 字重：`700`
- 字色：主文本色
- 字距：`-0.01em`
- 使用场景：面板主标题

### 4.2 面板副标题

- 字号：`13px`
- 行高：`1.5`
- 字色：辅助文本色
- 使用场景：标题下的一句说明

### 4.3 区段标签

- 字号：`11px`
- 字重：`800`
- 字距：`0.12em`
- 全大写
- 使用场景：图谱侧栏中的 section label，或工作台中的轻量区块标题

### 4.4 正文

- 主正文：`14px` 到 `15px`
- 辅助正文：`12px` 到 `13px`
- 行高：`1.5` 到 `1.7`

### 4.5 等宽内容

- 字号：`13px`
- 字体族：`ui-monospace`, `SF Mono`, `Menlo`, `Consolas`, `Liberation Mono`, `monospace`
- 行高：`1.7`
- 使用场景：文件预览、代码、结构化 JSON

## 5. 面板原语

### 5.1 外层面板 `panelSurfaceStyle`

必备属性：

- 背景：主表面
- 边框：`1px solid colorBorder`
- 圆角：`radius`
- 溢出：`hidden`

适用场景：

- `ChatPanel`
- `SessionListPanel`
- `FileManagerPanel`
- `FilePreviewPanel`
- `KnowledgeGraphPanel`

### 5.2 隐藏头部模式 `hideHeader`

很多面板支持 `hideHeader`，用于嵌入式工作台。

隐藏规则：

- 外层表面背景设为 `transparent`
- 去掉边框
- 圆角置零
- 内容区域 padding 比默认更紧
- 头部责任移交给外部容器

### 5.3 面板头部 `panelHeaderStyle`

结构：

- 左侧：标题主块
- 右侧：`headerActions`

样式：

- 底部分隔线：`1px solid colorBorder`
- 内边距：`14px 16px`
- 元素间距：`16px`
- 默认对齐：顶部对齐

### 5.4 标题主块 `panelHeaderMainStyle`

结构为纵向 `grid`。

- 行间距：`4px`
- 顺序：
  - 标题行
  - 副标题
  - 元信息 / 标签行

### 5.5 标题行 `panelTitleRowStyle`

- 水平排列
- 垂直居中
- 间距：`12px`

可包含：

- `titleIcon`
- 标题文本

## 6. 图标框

图标框对应 [panelStyles.ts](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/styles/panelStyles.ts) 中的 `createIconFrameStyle`。

规范：

- 尺寸：`30 x 30`
- 圆角：`radiusSmall`
- 背景与边框颜色由 tone 决定
- 图标本身不应超过 16 至 18 像素

用途：

- 面板标题图标
- 状态区图标容器

不要用于：

- 复杂多色插画
- 大面积品牌展示

## 7. 语义标签 Tone Badge

对应 `createToneBadgeStyle`。

统一样式：

- 高度由内边距自然决定
- 字号：`11px`
- 字重：`700`
- 胶囊圆角
- 内边距：`4px 9px`

tone 使用建议：

- `neutral`：数量、默认信息、普通状态
- `accent`：主强调、当前激活、流式、当前文件
- `secondary`：次要分类信息
- `success`：成功或健康状态
- `warning`：提醒
- `danger`：错误或风险

## 8. 状态块 PanelStateBlock

对应共享内部组件 [PanelStateBlock.tsx](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/components/shared/PanelStateBlock.tsx)。

### 8.1 使用场景

适用于：

- 空态
- 加载态
- 错误态

### 8.2 结构

自上而下：

- `visual`
- `title`
- `description`
- `action`

### 8.3 样式

- 容器背景和边框由 tone 决定
- 子卡片圆角：`radiusSmall`
- 内边距：`16px`
- 垂直间距：`6px`

### 8.4 文案语气

- 支持性表达，不带命令口吻
- 标题简洁直接
- 描述说明下一步或当前原因
- 如果有 action，应是一条明确的恢复路径

## 9. 可选中卡片

对应 `createSelectableCardStyle`。

基础规则：

- 非激活时：白底、常规边框
- 激活时：弱表面底、强边框
- 默认无阴影
- 可以额外叠加左侧 `2px` 强调线作为选中标识

适用场景：

- 会话列表项
- 文件列表项
- 可切换的轻量工作项卡片

## 10. Ghost Button

对应 `createGhostButtonStyle`。

规范：

- 白底或弱表面底
- 细边框
- 胶囊圆角
- 字号 `12px`
- 字重 `700`
- 内边距 `7px 11px`

主要用于：

- 面包屑
- 轻量过滤器
- 次要操作

不得用于：

- 页面主 CTA
- 高风险确认按钮

## 11. 栅格与间距

统一采用 4px 基线。

推荐间距：

- 面板 body gap：`14px`
- 面板常规 padding：`16px`
- 标题副标题间距：`4px`
- 标签组间距：`8px`
- 列表卡片内边距：`10px 12px`
- 图谱 summary：`14px 16px`

## 12. 响应式和嵌入规则

### 12.1 最低要求

组件必须能在以下两类容器内正常工作：

- 独立页面卡片
- IDE / 工作台窗格

### 12.2 通用策略

- 组件根节点必须支持 `min-width: 0`
- 长文本默认允许换行，但标题和标签可以截断
- 面板 body 尽量内部滚动，不把外层工作区撑高
- `hideHeader` 模式下必须去掉多余边框，避免双层容器感

## 13. 实现检查清单

实现新面板前，先对照以下条目：

- 是否复用了 `panelSurfaceStyle`
- 是否支持 `hideHeader`
- 标题是否使用 `panelTitleRowStyle`
- 是否有统一的 `headerActions` 插槽
- 空/载入/错误是否统一走 `PanelStateBlock`
- 标签是否复用 tone badge，而不是自定义颜色块
- 列表类元素的激活态是否使用统一的可选卡片规则
- 是否避免过重阴影与过深底色
- 是否保证在工作台嵌入时不撑破外层布局
