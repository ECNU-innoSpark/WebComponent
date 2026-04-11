# SessionListPanel Design Spec

## 1. 组件定位

`SessionListPanel` 用于承载会话入口、历史记录和最近工作流列表。

它常出现在：

- 工作台左侧导航
- 会话抽屉
- 任务历史侧栏

目标风格：

- 比主面板更克制
- 强调可扫描性
- 选中态明确但不过度抢眼

参考来源：

- `navigation.svg`
- `badge.svg`
- [SessionListPanel.tsx](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/components/SessionListPanel.tsx)

## 2. 结构

1. 可选头部
2. 状态区块
3. 会话列表项序列

每个列表项结构：

- 标题
- 可选 badge
- 描述
- meta
- 可选操作区

## 3. 外层容器

- 默认使用 `panelSurfaceStyle`
- `hideHeader` 模式去掉背景和边框
- 内容区默认使用 `panelBodyStyle`
- `hideHeader` 时：
  - gap 从 `10` 缩到 `8`
  - padding 为 `0`

## 4. 头部

### 4.1 头部信息

- 标题
- 副标题
- 数量 badge：`共 N 个会话`
- 可选右上角 actions

### 4.2 头部原则

- 头部说明只提示用途，不写长段说明
- 数量 badge 使用 `neutral`
- 头部应明显轻于主内容

## 5. 列表项样式

### 5.1 项容器

每个列表项是可选中卡片：

- 背景：默认白底
- 边框：常规边框
- 圆角：`radiusSmall`
- 内边距：`10px 12px`
- 内部 gap：`6px`

### 5.2 激活态

激活态需要 3 层变化：

- 背景切到 `colorSurfaceMuted`
- 边框切到 `colorBorderStrong`
- 左侧额外加 `2px` 品牌强调线

不要使用：

- 实心大面积品牌底色
- 重阴影
- 整块深色反白

### 5.3 文本层级

- 标题：`strong`，主文本色
- 描述：`14px`，辅助文本色
- meta：`12px`，辅助文本色

### 5.4 badge 规则

- 有 `badge` 时放在标题行右侧
- 当前激活项用 `accent`
- 其他项用 `neutral`

### 5.5 禁用态

- 整项透明度降低到约 `0.6`
- 光标变默认
- 不做悬停强调

## 6. 交互规则

点击区推荐覆盖整项主内容按钮。

实现建议：

- 外层 `article`
- 内层透明背景 `button`
- `button` 的 `textAlign` 为 `left`
- 不使用浏览器默认 button 外观

如果存在 `renderItemActions`：

- 操作区应放在主信息下方
- 与主信息区间距建议 `10px`

## 7. 状态块

空态、加载态、错误态统一复用 `PanelStateBlock`。

推荐文案语气：

- 空态：像“还没有会话”
- 加载态：像“正在同步会话记录”
- 错误态：像“暂时无法读取会话列表”

## 8. 尺寸和适配

- 面向左侧窄栏时，单项内容必须支持换行
- 标题和 badge 需保持首屏可读，不要因 action 区过多而挤压标题
- 列表整体应允许父容器决定滚动，不主动把外层撑高

## 9. 实现检查清单

- 是否使用统一可选卡片样式
- 是否有明确但轻量的激活态
- 是否把 badge 放在标题行右侧
- 是否保留 `renderItemActions`
- 是否保证窄侧栏中仍可读
