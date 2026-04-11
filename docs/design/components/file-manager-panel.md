# FileManagerPanel Design Spec

## 1. 组件定位

`FileManagerPanel` 是工作台中的资料目录与文件操作面板。

它的视觉角色介于“导航侧栏”和“操作列表”之间：

- 比纯导航更信息化
- 比资源管理器更轻
- 能嵌入多窗格工作区，不显得过重

参考来源：

- `navigation.svg`
- `menus-and-dropdowns.svg`
- `badge.svg`
- [FileManagerPanel.tsx](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/components/FileManagerPanel.tsx)

## 2. 结构

组件由 3 段组成：

1. 可选头部
2. 面包屑导航
3. 文件/目录列表

每个节点项包含：

- 名称
- 类型标识（目录/文件）
- 描述
- meta
- badge
- 可选节点操作

## 3. 头部

### 3.1 内容

- 标题
- 副标题
- 项目数 badge
- 右上 actions
- 下方单独一行面包屑

### 3.2 排布

头部整体建议用纵向布局：

- 第一行：标题主块 + actions
- 第二行：面包屑

两行之间的垂直间距建议 `12px`

### 3.3 视觉要求

- 面包屑是一组轻量 ghost button，不是粗导航 tab
- 当前路径按钮背景略深于其他层级

## 4. 面包屑规范

### 4.1 表现形式

- 使用胶囊按钮
- 支持换行
- 当前项与普通项用背景色区分

### 4.2 当前项样式

- 背景：`colorAccentSoft`
- 边框：`colorBorderStrong`

### 4.3 非当前项样式

- 背景：`colorSurfaceMuted`
- 边框：`colorBorder`

### 4.4 交互

- 如果没有 `onNavigate`，则按钮表现为静态状态
- 不应出现明显 hover 主色填充

## 5. 文件列表项

### 5.1 列表项容器

沿用可选卡片规则，并增加：

- 选中时左侧 `2px` 品牌强调线
- 鼠标可点击时显示 `pointer`
- 内部 gap：`6px`
- 内边距：`10px 12px`

### 5.2 标题区

标题区是左右布局：

- 左：名称和类型标签
- 右：badge

### 5.3 类型标签

文件类型标签不是 badge，而是更轻的文字型小标记：

- 字号：`11px`
- 字重：`700`
- 字距：`0.06em`
- 全大写
- 目录用主强调色
- 文件用辅助文本色

### 5.4 描述和 meta

- 描述：`14px`
- meta：`12px`
- 都使用辅助文本色

### 5.5 节点操作

如果存在 `renderNodeActions`：

- 默认放在节点主内容下方
- 与主内容间距推荐 `10px`
- 操作本身建议使用轻量按钮，不要压过节点标题

## 6. 状态区

空态、加载态、错误态都复用 `PanelStateBlock`。

推荐空态语义：

- 当前目录没有文件
- 目录还是空的

## 7. `hideHeader` 模式

在嵌入式模式下：

- 头部隐藏
- 面包屑转移到 body 顶部
- body gap 建议缩到 `8`
- body padding 置零

这样外部容器可以自己承担 pane 标题栏，不出现双层头部。

## 8. 响应式规则

- 面包屑必须支持换行
- 节点标题行在窄宽度时允许 badge 下移
- 长路径不应把整体面板撑宽

## 9. 实现检查清单

- 头部是否拆成信息区和面包屑两层
- 面包屑是否用 ghost button 而不是 tab
- 目录/文件类型是否是轻量文字标签
- 选中态是否清晰但不厚重
- `hideHeader` 下是否仍能完整工作
