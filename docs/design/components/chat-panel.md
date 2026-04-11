# ChatPanel Design Spec

## 1. 组件定位

`ChatPanel` 是工作台主视区里的对话面板。

样式目标：

- 像一个可长期停留的对话工作区，而不是营销式聊天卡片
- 保持浅底和安静的 chrome
- 重点放在消息内容、上下文状态和底部输入
- 能嵌入多窗格工作台，也能单独放在页面主区域

参考设计方向：

- InnoSpark `general.svg`
- 文本层级 `text-styles.svg`
- 输入类设计板 `input-fields.svg`
- 当前实现：[ChatPanel.tsx](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/components/ChatPanel.tsx)

## 2. 结构拆解

组件由 4 个区块组成：

1. 可选头部
2. 可滚动消息区
3. 可选状态横幅 `statusBanner`
4. 底部输入槽 `footer`

代码结构建议：

```tsx
<section>
  <header />
  <div className="body-scroll">
    <div className="content-column">
      <StatusBanner />
      <StateBlock />
      <MessageList />
    </div>
  </div>
  <footer-slot />
</section>
```

## 3. 外层容器

### 3.1 默认模式

- 使用 `panelSurfaceStyle`
- 根节点必须是纵向 `flex`
- `minHeight: 320`
- `minWidth: 0`
- `overflow: hidden`
- `position: relative`

### 3.2 `hideHeader` 模式

- 容器去掉边框和背景
- 保持 `flex column`
- 内部消息区 padding 改紧

## 4. 头部设计

### 4.1 头部用途

头部只承担 3 个任务：

- 标识当前面板名称
- 提供一行辅助说明
- 承载少量右上角 actions

不要在头部放大量筛选器或工具栏按钮。

### 4.2 头部内容顺序

- 标题行：`titleIcon + title`
- 副标题：可选
- `streaming` 状态下额外显示一个 `accent` tone badge

### 4.3 头部视觉要求

- 分隔线必须轻
- 头部本身不应使用深底
- 标题区图标固定在 `30 x 30` 图标框内
- `headerActions` 尽量保持轻量，不与标题争夺视觉中心

## 5. 状态横幅 `statusBanner`

位置：

- 位于消息流顶部
- 左对齐，不撑满整行

样式：

- 胶囊或圆角条
- 品牌软背景
- 细边框
- 左侧 6px 实心状态点
- 文本字号 `12px`
- 字重 `600`

推荐实现参数：

- 背景：`rgba(85, 90, 255, 0.08)`
- 边框：`rgba(85, 90, 255, 0.16)`
- 圆角：`radiusPill`
- padding：`8px 12px`
- 内部间距：`8px`

## 6. 消息区布局

### 6.1 整体滚动

- 消息区必须内部滚动
- 外层 body 使用：
  - `flex: 1`
  - `overflowY: auto`
  - `overflowX: hidden`
  - `padding: 0`

### 6.2 内容列

- 居中布局
- `maxWidth: 860px`
- `width: 100%`
- `margin: 0 auto`
- 消息块间距：`18px`

### 6.3 底部预留

如果存在 `footer`：

- 内容列底部留白必须明显增大
- 默认底部内边距建议 `120px`

这是为了兼容悬浮输入区，避免最后一条消息被遮挡。

## 7. 消息样式规则

### 7.1 角色分类

支持 4 种角色：

- `system`
- `user`
- `assistant`
- `tool`

### 7.2 宽度规则

建议宽度：

- `system`: `100%`
- `user`: `min(100%, 76%)`
- `assistant`: `min(100%, 92%)`
- `tool`: `min(100%, 92%)`

### 7.3 视觉原则

- 不把所有消息都做成同样的卡片
- 用户消息更聚合、更靠右、更偏实体块
- assistant 和 tool 更像工作流输出，保持更大信息面
- system 更弱、更接近说明条

### 7.4 头像规则

- avatar 维持小尺寸，不做大面积品牌装饰
- assistant 可使用 `AI`
- user 可使用 `我`
- tool 优先使用工具图标而不是字母缩写
- avatar 不应主导视觉层级

### 7.5 消息状态

每条消息可带局部状态：

- `idle`
- `streaming`
- `error`

边界表达建议：

- `streaming`: 用品牌色边框或顶部线条，不要整块高亮
- `error`: 用危险色边框或 badge，不要整块红底

## 8. 空态、加载态、错误态

### 8.1 空态

应更温和、居中、带明显上下留白。

样式：

- 中央对齐
- `padding: 48px 20px`
- 标题字号：`22px`
- 描述字号：`14px`
- 文案上限宽度：`420px`

### 8.2 加载态与错误态

统一走 `PanelStateBlock`。

如果需要视觉元素：

- 默认优先 icon
- 若对话页是首次进入场景，可考虑接入轻量插画

## 9. 底部输入槽 `footer`

### 9.1 责任边界

`ChatPanel` 不强制实现输入框，只提供插槽。

这样业务层可以接：

- 简单输入框
- 多模态输入框
- 带上下文条的悬浮 composer

### 9.2 槽位位置

- 固定在面板底部
- 若使用悬浮输入框，输入框外层背景应尽量透明
- 由内容区底部预留空间配合，不靠额外大 padding 顶开整体面板

## 10. 响应式规则

- 小宽度下消息最大宽度继续遵守角色宽度比例，不改成全宽单栏
- 长 meta 文本允许换行
- 顶部 `headerActions` 在窄宽度下允许换行，不压缩标题

## 11. 实现检查清单

- 根节点是否是 `flex column`
- 消息区是否内部滚动
- `footer` 是否不会遮挡最后一条消息
- `statusBanner` 是否弱强调且不通栏
- 是否区分 `user / assistant / tool / system` 四类视觉
- 是否避免出现重卡片和重复标题栏
- `hideHeader` 模式下是否仍能独立成立
