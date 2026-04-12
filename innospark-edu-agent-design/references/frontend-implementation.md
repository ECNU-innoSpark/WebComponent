## Frontend Implementation

### 1. 组件库策略

默认以 `Arco Design System` 为基础，再覆盖 IAIE token。

| 组件类别 | Arco 对应 |
| --- | --- |
| Button | `Button` |
| Input / TextArea | `Input`, `TextArea` |
| Select / Date | `Select`, `DatePicker` |
| Tabs | `Tabs` |
| Badge | `Badge` |
| Message / Notification | `Message`, `Notification` |
| Modal / Drawer | `Modal`, `Drawer` |
| Table | `Table` |
| Empty | `Empty` |
| Steps | `Steps` |

### 2. Token 使用规则

- 页面不直接写死颜色和圆角
- 优先消费 `semantic` 和 `component` token
- 仅在 token 定义层使用 `reference` token

### 3. 推荐目录

```text
src/
  design-system/
    tokens/
      reference.ts
      semantic.ts
      component.ts
    themes/
      light.css
      dark.css
    components/
      button/
      form/
      feedback/
      data-display/
      ai/
      agent/
      multimodal/
      charts/
    templates/
      agent-demo/
      workflow/
      dashboard/
      multimodal-studio/
```

### 4. 快速 Demo 搭建规范

默认采用 `5+1` 结构：

1. 标题区
2. 输入区
3. 输出区
4. 来源区
5. 行动区
6. 辅助区

各区说明：

- 标题区：场景名、一句话价值、适用对象、标签
- 输入区：文本输入、上传资源、参数选择
- 输出区：主回答、生成结果、分析摘要
- 来源区：知识库、教材、样本、文档、课堂片段
- 行动区：导出、继续提问、重新生成、分享
- 辅助区：能力说明、风险提示、版本信息、示例输入

### 5. 推荐页面脚手架组件

- `DemoHeader`
- `SceneTags`
- `DemoInputPanel`
- `DemoResultPanel`
- `EvidencePanel`
- `ActionFooter`
- `HelpAside`

### 6. 推荐状态模型

通用状态：

- `idle`
- `uploading`
- `parsing`
- `running`
- `partial_success`
- `success`
- `empty`
- `error`

多代理扩展状态：

- `queued`
- `handoff`
- `blocked`
- `skipped`
- `completed_with_warning`

### 7. 主题与密度控制

- 主题切换：`html[data-theme="dark"]`
- 密度切换：`data-density="compact/default/comfortable"`

### 8. 最终实现校验

- 能否映射到 token
- 能否复用基础组件
- 能否复用模板
- 能否快速拼装另一个 InnoSpark 教育场景 demo
