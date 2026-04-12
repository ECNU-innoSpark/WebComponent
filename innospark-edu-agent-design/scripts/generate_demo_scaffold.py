#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


TEMPLATES = {
    "agent-demo": {
        "sections": [
            "场景标题与适用对象",
            "输入方式与资源来源",
            "核心输出",
            "证据与依据",
            "可继续操作",
            "风险提示或适用边界",
        ],
        "components": [
            "DemoHeader",
            "SceneTags",
            "DemoInputPanel",
            "DemoResultPanel",
            "EvidencePanel",
            "ActionFooter",
            "HelpAside",
        ],
        "layout": "左侧输入与配置，中间主输出，右侧来源与说明。",
    },
    "workflow": {
        "sections": [
            "任务简介",
            "节点流程图区",
            "当前步骤详情",
            "中间产物列表",
            "最终输出与导出",
        ],
        "components": [
            "WorkflowBoard",
            "StepFlow",
            "IntermediateResultList",
            "ResultComparison",
            "ActionFooter",
        ],
        "layout": "顶部任务说明，中部流程图，底部或侧边显示节点详情与产物。",
    },
    "multimodal-studio": {
        "sections": [
            "资源输入区",
            "资源预览区",
            "时间轴或片段导航",
            "AI 摘要与分析区",
            "证据定位区",
            "教学建议区",
        ],
        "components": [
            "MultimodalAssetCard",
            "Timeline",
            "InsightCard",
            "SourcePanel",
            "ActionFooter",
        ],
        "layout": "左侧资源流，中间主预览，右侧分析与证据。",
    },
    "teaching-report": {
        "sections": [
            "报告标题与基本信息",
            "核心结论摘要",
            "指标概览",
            "维度图表",
            "证据片段或样本",
            "改进建议与导出",
        ],
        "components": [
            "MetricCards",
            "RadarChart",
            "BarChart",
            "EvidenceDrawer",
            "RecommendationPanel",
        ],
        "layout": "上方结论与指标，下方图表、样本和建议分区展示。",
    },
}


def build_markdown(
    demo_type: str,
    title: str,
    audience: str,
    primary_goal: str,
    theme: str,
    density: str,
) -> str:
    template = TEMPLATES[demo_type]
    lines = [
        f"# {title}",
        "",
        "## 基本信息",
        "",
        f"- 页面类型：`{demo_type}`",
        f"- 主要用户：`{audience}`",
        f"- 主任务：{primary_goal}",
        f"- 推荐主题：`{theme}`",
        f"- 推荐密度：`{density}`",
        "",
        "## 推荐布局",
        "",
        template["layout"],
        "",
        "## 关键区块",
        "",
    ]
    for i, section in enumerate(template["sections"], start=1):
        lines.extend([f"### {i}. {section}", "", "- 目标：", "- 关键内容：", "- 状态与反馈：", ""])

    lines.extend(["## 推荐组件", ""])
    for comp in template["components"]:
        lines.append(f"- `{comp}`")

    lines.extend(
        [
            "",
            "## 必做检查",
            "",
            "- 是否能一眼看懂该 demo 解决的教育问题",
            "- 是否包含输入、输出、证据、下一步操作",
            "- 是否符合 IAIE/InnoSpark 的紫蓝品牌和教育可信感",
            "- 是否支持后续复用为其他学科或学段场景",
            "",
        ]
    )
    return "\n".join(lines)


def build_json(
    demo_type: str,
    title: str,
    audience: str,
    primary_goal: str,
    theme: str,
    density: str,
) -> str:
    template = TEMPLATES[demo_type]
    payload = {
        "title": title,
        "page_type": demo_type,
        "audience": audience,
        "primary_goal": primary_goal,
        "theme": theme,
        "density": density,
        "layout": template["layout"],
        "sections": template["sections"],
        "components": template["components"],
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a reusable IAIE/InnoSpark demo scaffold."
    )
    parser.add_argument(
        "--type",
        required=True,
        choices=sorted(TEMPLATES.keys()),
        help="Scaffold type to generate.",
    )
    parser.add_argument("--title", required=True, help="Page or demo title.")
    parser.add_argument(
        "--audience",
        default="教师",
        help="Primary target audience, for example 学生 / 教师 / 教研 / 管理者.",
    )
    parser.add_argument(
        "--goal",
        default="帮助用户快速理解场景并完成核心任务。",
        help="Primary page goal.",
    )
    parser.add_argument(
        "--theme",
        default="light",
        choices=["light", "dark", "brand-hero"],
        help="Recommended theme.",
    )
    parser.add_argument(
        "--density",
        default="default",
        choices=["comfortable", "default", "compact"],
        help="Recommended density mode.",
    )
    parser.add_argument(
        "--format",
        default="markdown",
        choices=["markdown", "json"],
        help="Output format.",
    )
    parser.add_argument(
        "--output",
        help="Optional output path. If omitted, print to stdout.",
    )
    args = parser.parse_args()

    if args.format == "markdown":
        content = build_markdown(
            args.type, args.title, args.audience, args.goal, args.theme, args.density
        )
    else:
        content = build_json(
            args.type, args.title, args.audience, args.goal, args.theme, args.density
        )

    if args.output:
        path = Path(args.output)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content + ("\n" if not content.endswith("\n") else ""))
    else:
        print(content)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
