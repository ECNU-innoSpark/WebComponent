---
name: innospark-edu-agent-design
description: Use this skill when creating, extending, or reviewing Web frontend design for IAIE and InnoSpark, especially educational agent demos, multimodal teaching tools, teaching analytics dashboards, classroom evaluation pages, knowledge-source interfaces, and related admin or content pages. Applies when the work must follow the IAIE purple-blue brand, tokenized frontend design system, education-friendly interaction patterns, evidence-oriented AI presentation, and reusable demo-shell patterns for rapidly expanding new education scenarios inside InnoSpark.
---

# InnoSpark Edu Agent Design Skill

Use this skill when the task is to design, refine, review, or extend IAIE or InnoSpark Web frontend experiences.

This skill is optimized for:

- IAIE 官网、专题页、内容页
- InnoSpark agent 广场与单 agent demo
- 多代理工作流页面
- 多模态教学 Studio
- 教学评测、课堂观察、数据分析工作台
- 将设计规范转为 token、组件、页面模板或前端实现约束

## Default assumptions

- 优先保持 IAIE 的“教育可信 + 智能科技 + 人文温度”平衡。
- 默认采用浅色主题；大屏、工作台和夜间使用场景可切换深色主题。
- 默认优先复用 token 和模板，而不是为单页临时发明视觉规则。
- 对 AI 输出、教学评测和数据结果，必须同时考虑“结论、证据、来源、下一步操作”。

## Core workflow

1. 判断页面类型。
   选一类：`官网 / 内容页 / 后台 / 数据工作台 / agent 广场 / 单 agent demo / 多代理工作流 / 多模态 Studio / 教学评测报告`
2. 判断用户与目标。
   先明确主要用户是学生、教师、研究人员、管理者还是外部访客，以及用户此页的主任务。
3. 选择主题与密度。
   主题优先 `light`，深色仅在大屏、工作台、沉浸式 AI 场景使用。密度优先 `default`，高信息页可用 `compact`。
4. 读取必要参考。
   只读当前任务所需的 reference 文件，不要全部加载。若用户明确要“快速起 demo 骨架”，优先直接运行 `scripts/generate_demo_scaffold.py`。
5. 产出结果。
   输出应尽量包含：页面结构、组件选择、关键 token、状态规则、数据与证据表达方式。
6. 做最后校验。
   检查品牌一致性、结构清晰度、证据可追溯性、可访问性、前端可实现性。

## Which reference to read

- 需要颜色、字体、主题、栅格、圆角、阴影时，读 [references/foundation.md](references/foundation.md)
- 需要页面结构、模板、布局选择时，读 [references/page-templates.md](references/page-templates.md)
- 需要 agent demo、多代理、多模态教学、AI 结果与来源组件时，读 [references/agent-and-multimodal.md](references/agent-and-multimodal.md)
- 需要教学分析、数据工作台、图表、评测报告时，读 [references/data-viz-and-reporting.md](references/data-viz-and-reporting.md)
- 需要 token 落地、组件目录、前端脚手架、快速搭 demo 方式时，读 [references/frontend-implementation.md](references/frontend-implementation.md)

## Scripts and assets

### Script

- 需要快速生成可复用 demo 骨架时，运行 [scripts/generate_demo_scaffold.py](scripts/generate_demo_scaffold.py)

支持类型：

- `agent-demo`
- `workflow`
- `multimodal-studio`
- `teaching-report`

推荐用法：

```bash
python scripts/generate_demo_scaffold.py \
  --type agent-demo \
  --title "高中数学知识点讲解 Agent" \
  --audience 教师 \
  --goal "帮助教师快速演示知识点讲解与练习生成能力"
```

### Assets

如果需要直接参考模板母版，可读取：

- [assets/demo-templates/agent-demo-template.md](assets/demo-templates/agent-demo-template.md)
- [assets/demo-templates/workflow-template.md](assets/demo-templates/workflow-template.md)
- [assets/demo-templates/multimodal-studio-template.md](assets/demo-templates/multimodal-studio-template.md)
- [assets/demo-templates/teaching-report-template.md](assets/demo-templates/teaching-report-template.md)

## Non-negotiables

- 不要把 IAIE 产品做成“泛 AI 聊天产品”视觉。
- 不要只给图表不给解释；所有重要图表都要有口径、结论或证据说明。
- 不要只给 AI 结论不给来源；必须有来源块、证据块或依据面板。
- 不要在一个页面里同时滥用多种高饱和色、强渐变和厚阴影。
- 不要为了 demo 速度牺牲结构统一；优先复用统一的 demo shell。

## Output patterns

### If asked for a page design

至少给出：

- 页面类型
- 用户与主任务
- 布局结构
- 关键组件
- 推荐主题与密度
- 关键 token 或视觉原则

### If asked for an agent demo

默认使用 6 块结构：

1. 场景标题与适用对象
2. 输入方式与资源来源
3. 核心输出
4. 证据与依据
5. 可继续操作
6. 风险提示或适用边界

如果用户明确要“先给我一个可复用骨架”或“快速出一版 demo 结构”，优先调用脚本生成脚手架，再基于 references 做细化。

### If asked for a multimodal or analytics page

默认要求：

- 资源或数据源入口
- 主可视区
- 证据或样本区
- 结论摘要区
- 可导出或继续操作区

## Final check

在提交设计建议前，再问自己 5 个问题：

- 这是否仍然像 IAIE，而不是像其他品牌？
- 用户能否一眼看懂这个页面要做什么？
- 证据、来源、状态和下一步是否清楚？
- 页面能否在 InnoSpark 内快速复用为另一个教育场景 demo？
- 前端是否能直接按 token、组件和模板落地？
