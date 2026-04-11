# KnowledgeGraphPanel Design Spec

## 1. 组件定位

`KnowledgeGraphPanel` 用于表达知识点、任务、文件、关系边的结构化联系。

它既是数据可视化组件，也是工作台分析面板，因此需要在“轻”与“可读”之间平衡。

目标风格：

- 图谱区不做炫技型科技感
- 信息侧栏要像工作台说明面板，不像报告页
- 节点关系清晰，选中态明确

参考来源：

- `general.svg`
- `badge.svg`
- `organization-and-utilization.svg`
- [KnowledgeGraphPanel.tsx](/Users/wumengsong/Code/Innospark_Service/AIWebComponent/src/components/KnowledgeGraphPanel.tsx)

## 2. 结构

1. 可选头部
2. 可选 summary
3. 状态区
4. 主工作区

主工作区分两列：

- 左侧：Graph View
- 右侧：当前节点详情与关联关系

推荐比例：

- 左列：`1.7fr`
- 右列：`0.95fr`

## 3. 头部设计

头部包含：

- 标题
- 副标题
- 三个统计 badge：
  - 节点数
  - 关系数
  - 分组数
- `headerActions`

badge tone 建议：

- 节点数：`accent`
- 关系数：`secondary`
- 分组数：`neutral`

## 4. summary 区块

如果存在 `summary`：

- 放在主工作区前
- 样式比状态块更轻、比普通正文更强

推荐样式：

- 白底
- 常规边框
- 左侧 `3px` 主强调线
- 圆角 `8px`
- padding `14px 16px`
- 行高 `1.6`

## 5. 图谱区容器

图谱区是一个独立表面：

- 背景：白色
- 边框：常规边框
- 圆角：`8px`
- overflow: hidden

顶部需有一条 section label 栏：

- 文案如 `Graph View`
- 底部分隔线
- padding `10px 12px`

## 6. 节点视觉

### 6.1 形状

- 默认圆形
- 固定尺寸：`104 x 104`
- 内边距：`12px`

### 6.2 普通态

- 背景来自分类 tint
- 边框：`2px solid colorBorderStrong`
- 文本颜色：主文本色

### 6.3 激活态

- 背景切换到 `colorAccentSoft`
- 边框切到主强调色
- 可加轻微阴影：`shadowSoft`
- 文本颜色进一步提高对比

### 6.4 文本

- 字号：`12px`
- 字重：`700`
- 行高：`1.35`
- 最大宽度：`60px`
- 居中显示

### 6.5 交互

- 若存在 `onSelectNode`，节点显示 `pointer`
- 不暴露可连接 handle，handle 只作为 ReactFlow 技术实现细节隐藏存在

## 7. 边与画布

### 7.1 关系线

- 使用平滑折线或 smooth step
- 不要使用发光、霓虹、极细浅灰不可读线条
- 激活节点相关的边可以提高对比度

### 7.2 背景网格

如果画布需要背景：

- 只能是非常弱的点阵或网格
- 作用是帮助定位，不是强调科技感

## 8. 右侧详情区

详情区是信息面板，不是第二个图谱区。

建议承载：

- 当前节点标题
- 分类
- 描述
- 元信息
- 相关边列表
- 无法映射的关系提醒

样式原则：

- 分组清晰
- 使用 section label
- 每块之间主要靠留白和轻边框分隔

## 9. 状态设计

### 9.1 空态

当 `nodes` 和 `edges` 都为空时展示空态。

### 9.2 加载态

在生成或整理图谱时展示加载态。

### 9.3 错误态

图谱数据无法解析或获取时展示错误态。

全部统一使用 `PanelStateBlock`。

## 10. `hideHeader` 模式

嵌入式时：

- 头部去掉
- body padding 变紧
- 图谱主工作区和 summary 仍保留自己的内部边界

## 11. 响应式规则

- 宽度不足时，两列允许改为单列堆叠
- 右侧详情区应排到图谱区下方
- 图谱画布最小可视高度要保留，不可压成一条横条

## 12. 实现检查清单

- 图谱区是否比详情区更占视觉主导
- 节点是否为圆形、轻量、可读
- 激活态是否清晰但不花哨
- summary 是否只做轻强调，不变成通知横幅
- 窄屏时是否能切换成单列结构
