import { startTransition, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import academicCapIcon from "../../../assets/innospark-edu-agent-design/icons/academic-cap.svg";
import chatBubblesIcon from "../../../assets/innospark-edu-agent-design/icons/chat-bubbles.svg";
import collectionIcon from "../../../assets/innospark-edu-agent-design/icons/collection.svg";
import documentTextIcon from "../../../assets/innospark-edu-agent-design/icons/document-text.svg";
import folderIcon from "../../../assets/innospark-edu-agent-design/icons/folder.svg";
import informationCircleIcon from "../../../assets/innospark-edu-agent-design/icons/information-circle.svg";
import lightBulbIcon from "../../../assets/innospark-edu-agent-design/icons/light-bulb.svg";
import {
  ChatPanel,
  FileManagerPanel,
  FilePreviewPanel,
  KnowledgeGraphPanel,
  SessionListPanel
} from "../index";

type EditorPage = "catalog" | "layout";
type WidgetKind = "session" | "chat" | "files" | "preview" | "graph";
type WidgetLayout = {
  id: string;
  kind: WidgetKind;
  x: number;
  y: number;
  width: number;
  height: number;
};

type SplitDirection = "row" | "column";
type SplitPlacement = "left" | "right" | "top" | "bottom";
type RootDropHint = SplitPlacement | null;
type DockTarget =
  | {
      paneId: string;
      placement: SplitPlacement;
      scope: "pane";
    }
  | {
      placement: SplitPlacement;
      scope: "root";
    };

type LayoutLeaf = {
  id: string;
  kind: WidgetKind;
  type: "leaf";
};

type LayoutBranch = {
  direction: SplitDirection;
  first: LayoutNode;
  id: string;
  ratio: number;
  second: LayoutNode;
  type: "split";
};

type LayoutNode = LayoutLeaf | LayoutBranch;

const widgetDefinitions = [
  {
    kind: "session" as const,
    label: "SessionListPanel",
    canvasTitle: "最近会话",
    summary: "会话列表控件，适合挂在左侧导航区。",
    hint: "列表 / 入口 / 历史记录",
    iconSrc: collectionIcon,
    iconAlt: "collection"
  },
  {
    kind: "chat" as const,
    label: "ChatPanel",
    canvasTitle: "教学协作对话",
    summary: "对话主面板，适合放在工作台主视区。",
    hint: "聊天 / 多轮对话 / 底部输入",
    iconSrc: chatBubblesIcon,
    iconAlt: "chat"
  },
  {
    kind: "files" as const,
    label: "FileManagerPanel",
    canvasTitle: "资料目录",
    summary: "资料目录与文件操作面板。",
    hint: "目录 / 文件树 / 操作区",
    iconSrc: folderIcon,
    iconAlt: "folder"
  },
  {
    kind: "preview" as const,
    label: "FilePreviewPanel",
    canvasTitle: "文件预览",
    summary: "文件预览与编辑占位面板。",
    hint: "预览 / 文本 / 代码",
    iconSrc: documentTextIcon,
    iconAlt: "document"
  },
  {
    kind: "graph" as const,
    label: "KnowledgeGraphPanel",
    canvasTitle: "知识关系图",
    summary: "知识图谱与结构关系面板。",
    hint: "关系 / 节点 / 摘要",
    iconSrc: academicCapIcon,
    iconAlt: "academic cap"
  }
] as const;

const defaultSizes: Record<WidgetKind, { width: number; height: number }> = {
  session: { width: 360, height: 520 },
  chat: { width: 700, height: 560 },
  files: { width: 400, height: 520 },
  preview: { width: 660, height: 520 },
  graph: { width: 760, height: 560 }
};

function createLeaf(id: string, kind: WidgetKind): LayoutLeaf {
  return {
    id,
    kind,
    type: "leaf"
  };
}

function createDefaultLayoutTree(): LayoutNode {
  return {
    direction: "row",
    first: createLeaf("layout-session", "session"),
    id: "layout-root",
    ratio: 0.28,
    second: createLeaf("layout-chat", "chat"),
    type: "split"
  };
}

function isLayoutLeaf(node: LayoutNode): node is LayoutLeaf {
  return node.type === "leaf";
}

function collectLayoutLeaves(node: LayoutNode): LayoutLeaf[] {
  if (isLayoutLeaf(node)) {
    return [node];
  }

  return [...collectLayoutLeaves(node.first), ...collectLayoutLeaves(node.second)];
}

function findLeafById(node: LayoutNode, id: string): LayoutLeaf | null {
  if (isLayoutLeaf(node)) {
    return node.id === id ? node : null;
  }

  return findLeafById(node.first, id) ?? findLeafById(node.second, id);
}

function findFirstLeafId(node: LayoutNode | null): string {
  if (!node) {
    return "";
  }

  return isLayoutLeaf(node) ? node.id : findFirstLeafId(node.first);
}

function splitLeafNode(
  node: LayoutNode,
  targetId: string,
  newLeaf: LayoutLeaf,
  placement: SplitPlacement,
  splitId: string
): LayoutNode {
  if (isLayoutLeaf(node)) {
    if (node.id !== targetId) {
      return node;
    }

    const direction: SplitDirection = placement === "left" || placement === "right" ? "row" : "column";
    const insertBefore = placement === "left" || placement === "top";

    return {
      direction,
      first: insertBefore ? newLeaf : node,
      id: splitId,
      ratio: 0.5,
      second: insertBefore ? node : newLeaf,
      type: "split"
    };
  }

  return {
    ...node,
    first: splitLeafNode(node.first, targetId, newLeaf, placement, splitId),
    second: splitLeafNode(node.second, targetId, newLeaf, placement, splitId)
  };
}

function removeLeafNode(node: LayoutNode, targetId: string): LayoutNode | null {
  if (isLayoutLeaf(node)) {
    return node.id === targetId ? null : node;
  }

  const nextFirst = removeLeafNode(node.first, targetId);
  const nextSecond = removeLeafNode(node.second, targetId);

  if (!nextFirst && !nextSecond) {
    return null;
  }

  if (!nextFirst) {
    return nextSecond;
  }

  if (!nextSecond) {
    return nextFirst;
  }

  return {
    ...node,
    first: nextFirst,
    second: nextSecond
  };
}

function updateSplitRatio(node: LayoutNode, splitId: string, ratio: number): LayoutNode {
  if (isLayoutLeaf(node)) {
    return node;
  }

  if (node.id === splitId) {
    return {
      ...node,
      ratio
    };
  }

  return {
    ...node,
    first: updateSplitRatio(node.first, splitId, ratio),
    second: updateSplitRatio(node.second, splitId, ratio)
  };
}

function moveLeafNode(
  node: LayoutNode,
  draggedId: string,
  targetId: string,
  placement: SplitPlacement,
  splitId: string
): LayoutNode {
  if (draggedId === targetId) {
    return node;
  }

  const draggedLeaf = findLeafById(node, draggedId);

  if (!draggedLeaf) {
    return node;
  }

  const reducedTree = removeLeafNode(node, draggedId);

  if (!reducedTree) {
    return node;
  }

  return splitLeafNode(reducedTree, targetId, draggedLeaf, placement, splitId);
}

function wrapRootNode(node: LayoutNode, incomingLeaf: LayoutLeaf, placement: SplitPlacement, splitId: string): LayoutNode {
  const direction: SplitDirection = placement === "left" || placement === "right" ? "row" : "column";
  const insertBefore = placement === "left" || placement === "top";

  return {
    direction,
    first: insertBefore ? incomingLeaf : node,
    id: splitId,
    ratio: 0.5,
    second: insertBefore ? node : incomingLeaf,
    type: "split"
  };
}

function moveLeafToRoot(node: LayoutNode, draggedId: string, placement: SplitPlacement, splitId: string): LayoutNode {
  const draggedLeaf = findLeafById(node, draggedId);

  if (!draggedLeaf) {
    return node;
  }

  const reducedTree = removeLeafNode(node, draggedId);

  if (!reducedTree) {
    return node;
  }

  return wrapRootNode(reducedTree, draggedLeaf, placement, splitId);
}

function getDropPlacement(clientX: number, clientY: number, rect: DOMRect): SplitPlacement {
  const leftDistance = clientX - rect.left;
  const rightDistance = rect.right - clientX;
  const topDistance = clientY - rect.top;
  const bottomDistance = rect.bottom - clientY;
  const nearest = Math.min(leftDistance, rightDistance, topDistance, bottomDistance);

  if (nearest === leftDistance) {
    return "left";
  }

  if (nearest === rightDistance) {
    return "right";
  }

  return nearest === topDistance ? "top" : "bottom";
}

const sampleSessions = [
  {
    id: "sess-physics",
    title: "高二物理 · 动量守恒复盘",
    description: "围绕例题拆解、错因归纳与课后练习编排展开。",
    meta: "今天 09:18 · 12 条消息",
    badge: "进行中"
  },
  {
    id: "sess-reading",
    title: "初中英语 · 阅读任务包",
    description: "已生成词汇清单、导学问题和课堂小测建议。",
    meta: "昨天 18:42 · 已归档",
    badge: "已整理"
  },
  {
    id: "sess-history",
    title: "高中历史 · 概念图谱梳理",
    description: "等待补充资料链接后继续生成关联节点。",
    meta: "4 月 8 日 · 等待资料",
    badge: "待补充"
  }
];

const sampleMessages = [
  {
    id: "msg-0",
    role: "system" as const,
    content: "已同步课程模板、讲义资料与课堂观察记录"
  },
  {
    id: "msg-1",
    role: "user" as const,
    content: "请把“动量守恒”这节课拆成导入、核心讲解、例题训练和课后延伸四段。",
    meta: "09:21"
  },
  {
    id: "msg-2",
    role: "assistant" as const,
    content:
      "已按四段结构整理完成。\n\n1. 导入：用碰撞场景引出概念。\n2. 核心讲解：梳理封闭系统与守恒条件。\n3. 例题训练：从一维碰撞过渡到图像题。\n4. 课后延伸：安排生活化建模题与追问。",
    meta: "09:21 · lesson-outline-v3",
    status: "streaming" as const
  },
  {
    id: "msg-3",
    role: "tool" as const,
    title: "检索结果",
    content: "知识库已引用《动量守恒专题讲义》与《实验课堂观察记录》。",
    meta: "09:22 · knowledge.lookup"
  }
];

const sampleFiles = [
  {
    id: "dir-lesson",
    path: "lesson-pack",
    name: "lesson-pack",
    kind: "directory" as const,
    description: "课程资料包目录",
    meta: "8 个文件 · 刚刚同步",
    badge: "推荐"
  },
  {
    id: "file-outline",
    path: "lesson-pack/outline.md",
    name: "outline.md",
    kind: "file" as const,
    description: "课程结构说明",
    meta: "2.1 KB · 1 分钟前"
  },
  {
    id: "file-graph",
    path: "lesson-pack/graph.json",
    name: "graph.json",
    kind: "file" as const,
    description: "图谱节点配置",
    meta: "1.6 KB · 5 分钟前",
    badge: "只读"
  }
];

const samplePreview = `{
  "lesson": "动量守恒复盘",
  "goal": [
    "理解封闭系统的定义",
    "能根据题干判断守恒条件",
    "会把知识点映射到练习安排"
  ],
  "graphFocus": {
    "核心概念": "动量守恒",
    "训练路径": "情境引入 -> 条件判断 -> 例题迁移"
  }
}`;

const sampleGraphNodes = [
  {
    id: "node-goal",
    label: "课程目标",
    category: "教学设计",
    description: "统一本节课的能力目标与产出要求",
    meta: "关联 2 个练习任务",
    badge: "主节点"
  },
  {
    id: "node-core",
    label: "动量守恒",
    category: "核心概念",
    description: "对应课堂讲解与板书主线",
    meta: "关联 3 条前置知识",
    badge: "重点"
  },
  {
    id: "node-task",
    label: "碰撞例题训练",
    category: "练习任务",
    description: "承接概念判断与数量关系建模",
    meta: "建议课上完成 15 分钟"
  }
];

const sampleGraphEdges = [
  {
    id: "edge-1",
    source: "课程目标",
    target: "动量守恒",
    label: "定义目标",
    description: "用目标限定核心概念的教学边界",
    badge: "强关联"
  },
  {
    id: "edge-2",
    source: "动量守恒",
    target: "碰撞例题训练",
    label: "生成练习",
    description: "由概念说明推导到例题训练安排"
  }
];

function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function renderIcon(src: string, alt: string, mode: "chip" | "visual", tone: "accent" | "neutral" = "accent") {
  return (
    <span className={`asset-${mode} tone-${tone}`}>
      <img alt={alt} src={src} />
    </span>
  );
}

function renderWidget(kind: WidgetKind) {
  switch (kind) {
    case "session":
      return (
        <SessionListPanel
          activeItemId="sess-physics"
          hideHeader
          items={sampleSessions}
          titleIcon={renderIcon(collectionIcon, "collection", "chip")}
        />
      );
    case "chat":
      return (
        <ChatPanel
          footer={
            <div className="demo-composer">
              <button className="demo-composer-tool" type="button">
                <span>上下文</span>
              </button>
              <div className="demo-input">
                请继续补充课堂提问语句，并把练习题按难度分成 A/B 两组。
              </div>
              <button className="demo-composer-send" type="button">
                <span>发送</span>
              </button>
            </div>
          }
          headerActions={<span className="demo-pill">teaching-copilot</span>}
          hideHeader
          messages={sampleMessages}
          status="streaming"
          statusBanner="当前会话已接入 3 类教学上下文"
          titleIcon={renderIcon(chatBubblesIcon, "chat", "chip")}
        />
      );
    case "files":
      return (
        <FileManagerPanel
          currentPath="lesson-pack"
          headerActions={
            <div className="demo-stack-actions">
              <button className="demo-button subtle">上传资料</button>
              <button className="demo-button">刷新目录</button>
            </div>
          }
          hideHeader
          nodes={sampleFiles}
          onNavigate={() => undefined}
          onOpenFile={() => undefined}
          onSelectNode={() => undefined}
          renderNodeActions={() => (
            <>
              <button className="mini-action">移动</button>
              <button className="mini-action danger">删除</button>
            </>
          )}
          selectedPath="lesson-pack/outline.md"
          titleIcon={renderIcon(folderIcon, "folder", "chip")}
        />
      );
    case "preview":
      return (
        <FilePreviewPanel
          content={<textarea className="preview-editor" readOnly value={samplePreview} />}
          fileName="lesson-pack/graph.json"
          headerActions={
            <div className="demo-footer-actions">
              <button className="demo-button subtle">重新载入</button>
              <button className="demo-button primary">保存草稿</button>
            </div>
          }
          hideHeader
          language="application/json"
          titleIcon={renderIcon(documentTextIcon, "document", "chip")}
        />
      );
    case "graph":
      return (
        <KnowledgeGraphPanel
          activeNodeId="node-core"
          edges={sampleGraphEdges}
          headerActions={<span className="demo-pill secondary">graph-v2</span>}
          hideHeader
          nodes={sampleGraphNodes}
          onSelectNode={() => undefined}
          summary="图谱面板适合承接课程目标、知识点与练习任务之间的结构化关系，也支持统一的空态、加载态和错误态。"
          titleIcon={renderIcon(academicCapIcon, "academic cap", "chip")}
        />
      );
  }
}

type CanvasWidgetProps = {
  definition: (typeof widgetDefinitions)[number];
  layout: WidgetLayout;
  selected: boolean;
  boundsRef: React.RefObject<HTMLDivElement | null>;
  onChange: (nextLayout: WidgetLayout) => void;
  onSelect: () => void;
  onRemove?: () => void;
};

function CanvasWidget({
  definition,
  layout,
  selected,
  boundsRef,
  onChange,
  onSelect,
  onRemove
}: CanvasWidgetProps) {
  function beginInteraction(event: ReactPointerEvent<HTMLDivElement | HTMLButtonElement>, mode: "drag" | "resize") {
    event.preventDefault();
    event.stopPropagation();
    onSelect();

    const bounds = boundsRef.current;

    if (!bounds) {
      return;
    }

    const rect = bounds.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLayout = layout;

    function handlePointerMove(moveEvent: PointerEvent) {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (mode === "drag") {
        const nextX = clamp(startLayout.x + deltaX, 0, rect.width - startLayout.width);
        const nextY = clamp(startLayout.y + deltaY, 0, rect.height - startLayout.height);
        onChange({ ...startLayout, x: nextX, y: nextY });
        return;
      }

      const nextWidth = clamp(startLayout.width + deltaX, 280, rect.width - startLayout.x);
      const nextHeight = clamp(startLayout.height + deltaY, 240, rect.height - startLayout.y);

      onChange({
        ...startLayout,
        width: nextWidth,
        height: nextHeight
      });
    }

    function handlePointerUp() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  return (
    <div
      className={`canvas-widget${selected ? " is-selected" : ""}`}
      onPointerDown={onSelect}
      style={{
        height: layout.height,
        left: layout.x,
        top: layout.y,
        width: layout.width
      }}
    >
      <div className="canvas-widget-toolbar" onPointerDown={(event) => beginInteraction(event, "drag")}>
        <div className="canvas-widget-leading">
          <div className="canvas-widget-handle" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          {renderIcon(definition.iconSrc, definition.iconAlt, "chip", selected ? "accent" : "neutral")}
          <strong className="canvas-widget-title">{definition.canvasTitle}</strong>
        </div>
        <div className="canvas-widget-actions">
          <span className="canvas-widget-badge">{definition.label}</span>
          {onRemove ? (
            <button
              aria-label={`移除 ${definition.canvasTitle}`}
              className="canvas-widget-remove"
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              type="button"
            >
              ×
            </button>
          ) : null}
        </div>
      </div>
      <div className="canvas-widget-body">{renderWidget(layout.kind)}</div>
      <button
        aria-label={`Resize ${definition.label}`}
        className="canvas-widget-resize"
        onPointerDown={(event) => beginInteraction(event, "resize")}
        type="button"
      />
    </div>
  );
}

type LayoutPaneProps = {
  clearRootDropHint: () => void;
  definition: (typeof widgetDefinitions)[number];
  dragging: boolean;
  isDragActive: boolean;
  onBeginPaneDrag: (paneId: string, event: ReactPointerEvent<HTMLDivElement>) => void;
  onDragPane: (paneId: string | null) => void;
  onDropWidget: (kind: WidgetKind, placement: SplitPlacement) => void;
  onMovePane: (draggedId: string, placement: SplitPlacement) => void;
  onRemove: () => void;
  onSelect: () => void;
  pane: LayoutLeaf;
  selected: boolean;
  dropHint: SplitPlacement | null;
  draggingPaneId: string | null;
  draggingWidgetKind: WidgetKind | null;
  setDropHint: (placement: SplitPlacement | null) => void;
};

type DockGuideProps = {
  activePlacement: SplitPlacement | null;
  scope: "pane" | "root";
};

type DockTargetZonesProps = {
  activePlacement: SplitPlacement | null;
  onPlacementEnter: (placement: SplitPlacement) => void;
  onPlacementLeave: () => void;
  onPlacementDrop: (placement: SplitPlacement) => void;
  scope: "pane" | "root";
  targetId?: string;
};

function DockGuide({ activePlacement, scope }: DockGuideProps) {
  const placements: SplitPlacement[] = ["top", "right", "bottom", "left"];

  if (scope === "pane") {
    return (
      <div className="dock-guide is-pane">
        <div className="dock-guide-compass">
          {placements.map((placement) => (
            <div
              key={placement}
              className={`dock-guide-zone is-${placement}${activePlacement === placement ? " is-active" : ""}`}
            >
              <span className="dock-guide-preview" aria-hidden="true" />
            </div>
          ))}
          <div className="dock-guide-core" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div className={`dock-guide is-${scope}`}>
      {placements.map((placement) => (
        <div
          key={placement}
          className={`dock-guide-zone is-${placement}${activePlacement === placement ? " is-active" : ""}`}
        >
          <span className="dock-guide-preview" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

function DockTargetZones({
  activePlacement,
  onPlacementEnter,
  onPlacementLeave,
  onPlacementDrop,
  scope,
  targetId
}: DockTargetZonesProps) {
  const placements: SplitPlacement[] = ["top", "right", "bottom", "left"];

  return (
    <div className={`dock-targets is-${scope}`}>
      {placements.map((placement) => (
        <div
          key={placement}
          className={`dock-target-zone is-${scope} is-${placement}${activePlacement === placement ? " is-active" : ""}`}
          data-dock-placement={placement}
          data-dock-scope={scope}
          data-pane-id={scope === "pane" ? targetId : undefined}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              onPlacementLeave();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = event.dataTransfer.getData("text/layout-pane-id") ? "move" : "copy";
            onPlacementEnter(placement);
          }}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onPlacementDrop(placement);
            onPlacementLeave();
          }}
        />
      ))}
    </div>
  );
}

function LayoutPane({
  clearRootDropHint,
  definition,
  dragging,
  isDragActive,
  onBeginPaneDrag,
  onDragPane,
  onDropWidget,
  onMovePane,
  onRemove,
  onSelect,
  pane,
  selected,
  dropHint,
  draggingPaneId,
  draggingWidgetKind,
  setDropHint
}: LayoutPaneProps) {
  return (
    <div
      className={`layout-pane${selected ? " is-selected" : ""}${dragging ? " is-dragging" : ""}${dropHint ? " is-drop-target" : ""}`}
      onClick={onSelect}
    >
      <div
        className="layout-pane-toolbar"
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;

          if (event.button !== 0 || target.closest("button")) {
            return;
          }

          onSelect();
          onBeginPaneDrag(pane.id, event);
        }}
      >
        <div className="canvas-widget-leading">
          {renderIcon(definition.iconSrc, definition.iconAlt, "chip", selected ? "accent" : "neutral")}
          <strong className="canvas-widget-title">{definition.canvasTitle}</strong>
        </div>
        <div className="canvas-widget-actions">
          <span className="canvas-widget-badge">{definition.label}</span>
          <button
            aria-label={`移除 ${definition.canvasTitle}`}
            className="canvas-widget-remove"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            type="button"
          >
            ×
          </button>
        </div>
      </div>
      <div className="layout-pane-body">{renderWidget(pane.kind)}</div>
      {dropHint ? <div className={`layout-pane-drop is-${dropHint}`} /> : null}
      {isDragActive && !dragging ? (
        <>
          <DockGuide activePlacement={dropHint} scope="pane" />
          <DockTargetZones
            activePlacement={dropHint}
            onPlacementDrop={(placement) => {
              if (draggingPaneId && draggingPaneId !== pane.id) {
                onMovePane(draggingPaneId, placement);
                return;
              }

              if (draggingWidgetKind) {
                onDropWidget(draggingWidgetKind, placement);
              }
            }}
            onPlacementEnter={(placement) => {
              clearRootDropHint();
              setDropHint(placement);
            }}
            onPlacementLeave={() => setDropHint(null)}
            scope="pane"
            targetId={pane.id}
          />
        </>
      ) : null}
    </div>
  );
}

type SplitWorkspaceProps = {
  dropHint: { placement: SplitPlacement; targetId: string } | null;
  draggingPaneId: string | null;
  draggingWidgetKind: WidgetKind | null;
  dragPointer: { kind: WidgetKind; label: string; x: number; y: number } | null;
  onBeginPaneDrag: (paneId: string, event: ReactPointerEvent<HTMLDivElement>) => void;
  rootDropHint: RootDropHint;
  onDragPane: (paneId: string | null) => void;
  onDropAtRoot: (placement: SplitPlacement) => void;
  onDropWidget: (targetId: string, kind: WidgetKind, placement: SplitPlacement) => void;
  onMovePane: (draggedId: string, targetId: string, placement: SplitPlacement) => void;
  onRemovePane: (paneId: string) => void;
  onResizeSplit: (splitId: string, direction: SplitDirection, nextRatio: number) => void;
  onSelectPane: (paneId: string) => void;
  root: LayoutNode;
  selectedId: string;
  setRootDropHint: (placement: RootDropHint) => void;
  setDropHint: (hint: { placement: SplitPlacement; targetId: string } | null) => void;
};

function SplitWorkspace({
  dropHint,
  draggingPaneId,
  draggingWidgetKind,
  dragPointer,
  onBeginPaneDrag,
  rootDropHint,
  onDragPane,
  onDropAtRoot,
  onDropWidget,
  onMovePane,
  onRemovePane,
  onResizeSplit,
  onSelectPane,
  root,
  selectedId,
  setRootDropHint,
  setDropHint
}: SplitWorkspaceProps) {
  const isDragActive = draggingPaneId !== null || draggingWidgetKind !== null;

  function renderNode(node: LayoutNode): React.ReactNode {
    if (isLayoutLeaf(node)) {
      const definition = widgetDefinitions.find((item) => item.kind === node.kind) ?? widgetDefinitions[0];
      const activeDrop = dropHint?.targetId === node.id ? dropHint.placement : null;

      return (
        <LayoutPane
          clearRootDropHint={() => setRootDropHint(null)}
          definition={definition}
          dragging={draggingPaneId === node.id}
          isDragActive={isDragActive}
          onBeginPaneDrag={onBeginPaneDrag}
          dropHint={activeDrop}
          draggingPaneId={draggingPaneId}
          draggingWidgetKind={draggingWidgetKind}
          onDragPane={onDragPane}
          onDropWidget={(kind, placement) => onDropWidget(node.id, kind, placement)}
          onMovePane={(draggedId, placement) => onMovePane(draggedId, node.id, placement)}
          onRemove={() => onRemovePane(node.id)}
          onSelect={() => onSelectPane(node.id)}
          pane={node}
          selected={node.id === selectedId}
          setDropHint={(placement) =>
            setDropHint(placement ? { placement, targetId: node.id } : null)
          }
        />
      );
    }

    const splitNode = node;

    return (
      <div
        className={`layout-split is-${splitNode.direction}`}
        style={
          splitNode.direction === "row"
            ? { gridTemplateColumns: `minmax(0, ${splitNode.ratio}fr) 8px minmax(0, ${1 - splitNode.ratio}fr)` }
            : { gridTemplateRows: `minmax(0, ${splitNode.ratio}fr) 8px minmax(0, ${1 - splitNode.ratio}fr)` }
        }
      >
        <div className="layout-split-slot">{renderNode(splitNode.first)}</div>
        <div
          className={`layout-split-divider is-${splitNode.direction}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();

            const parent = event.currentTarget.parentElement;

            if (!parent) {
              return;
            }

            const rect = parent.getBoundingClientRect();

            function handlePointerMove(moveEvent: PointerEvent) {
              const rawRatio =
                splitNode.direction === "row"
                  ? (moveEvent.clientX - rect.left) / rect.width
                  : (moveEvent.clientY - rect.top) / rect.height;

              onResizeSplit(splitNode.id, splitNode.direction, clamp(rawRatio, 0.2, 0.8));
            }

            function handlePointerUp() {
              window.removeEventListener("pointermove", handlePointerMove);
              window.removeEventListener("pointerup", handlePointerUp);
            }

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
          }}
        >
          <span />
        </div>
        <div className="layout-split-slot">{renderNode(splitNode.second)}</div>
      </div>
    );
  }

  return (
    <div className={`layout-split-root${isDragActive ? " is-drag-active" : ""}${rootDropHint ? " has-root-drop" : ""}`}>
      {renderNode(root)}
      {isDragActive ? (
        <>
          {rootDropHint ? <div className={`layout-root-drop is-${rootDropHint}`} /> : null}
          <DockGuide activePlacement={rootDropHint} scope="root" />
          <DockTargetZones
            activePlacement={rootDropHint}
            onPlacementDrop={onDropAtRoot}
            onPlacementEnter={(placement) => {
              setDropHint(null);
              setRootDropHint(placement);
            }}
            onPlacementLeave={() => setRootDropHint(null)}
            scope="root"
          />
        </>
      ) : null}
      {dragPointer ? (
        <div
          className="layout-drag-ghost"
          style={{
            left: dragPointer.x + 14,
            top: dragPointer.y + 14
          }}
        >
          {renderIcon(
            widgetDefinitions.find((item) => item.kind === dragPointer.kind)?.iconSrc ?? informationCircleIcon,
            dragPointer.label,
            "chip",
            "accent"
          )}
          <span>{dragPointer.label}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function ShowcaseApp() {
  const [activePage, setActivePage] = useState<EditorPage>("catalog");
  const [activeCatalogKind, setActiveCatalogKind] = useState<WidgetKind>("chat");
  const [catalogPreview, setCatalogPreview] = useState<WidgetLayout>({
    id: "catalog-preview",
    kind: "chat",
    x: 56,
    y: 56,
    width: defaultSizes.chat.width,
    height: defaultSizes.chat.height
  });
  const [layoutRoot, setLayoutRoot] = useState<LayoutNode | null>(createDefaultLayoutTree);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>("layout-chat");
  const [insertPlacement, setInsertPlacement] = useState<Extract<SplitPlacement, "right" | "bottom">>("right");
  const [dropHint, setDropHint] = useState<{ placement: SplitPlacement; targetId: string } | null>(null);
  const [draggingPaneId, setDraggingPaneId] = useState<string | null>(null);
  const [draggingWidgetKind, setDraggingWidgetKind] = useState<WidgetKind | null>(null);
  const [dragPointer, setDragPointer] = useState<{ kind: WidgetKind; label: string; x: number; y: number } | null>(null);
  const [rootDropHint, setRootDropHint] = useState<RootDropHint>(null);

  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(3);
  const activeDockTargetRef = useRef<DockTarget | null>(null);

  const selectedDefinition =
    widgetDefinitions.find((definition) => definition.kind === activeCatalogKind) ?? widgetDefinitions[0];
  const selectedLayoutWidget = layoutRoot ? findLeafById(layoutRoot, selectedLayoutId) : null;
  const selectedLayoutDefinition =
    widgetDefinitions.find((item) => item.kind === selectedLayoutWidget?.kind) ?? null;
  const layoutLeafCount = layoutRoot ? collectLayoutLeaves(layoutRoot).length : 0;

  function updateCatalogKind(kind: WidgetKind) {
    startTransition(() => {
      setActiveCatalogKind(kind);
      setCatalogPreview((current) => ({
        ...current,
        kind,
        width: defaultSizes[kind].width,
        height: defaultSizes[kind].height
      }));
    });
  }

  function addLayoutWidget(kind: WidgetKind, placement: Extract<SplitPlacement, "right" | "bottom"> = insertPlacement) {
    const nextLeaf = createLeaf(`layout-${nextIdRef.current++}`, kind);

    if (!layoutRoot) {
      setLayoutRoot(nextLeaf);
      setSelectedLayoutId(nextLeaf.id);
      return;
    }

    const targetId = selectedLayoutId || findFirstLeafId(layoutRoot);
    setLayoutRoot(splitLeafNode(layoutRoot, targetId, nextLeaf, placement, `split-${nextIdRef.current++}`));
    setSelectedLayoutId(nextLeaf.id);
  }

  function dropLayoutWidget(targetId: string, kind: WidgetKind, placement: SplitPlacement) {
    const nextLeaf = createLeaf(`layout-${nextIdRef.current++}`, kind);

    setLayoutRoot((current) => {
      if (!current) {
        return nextLeaf;
      }

      return splitLeafNode(current, targetId, nextLeaf, placement, `split-${nextIdRef.current++}`);
    });
    setSelectedLayoutId(nextLeaf.id);
    setDraggingWidgetKind(null);
    setDropHint(null);
    setRootDropHint(null);
  }

  function moveLayoutPane(draggedId: string, targetId: string, placement: SplitPlacement) {
    if (draggedId === targetId) {
      return;
    }

    setLayoutRoot((current) =>
      current ? moveLeafNode(current, draggedId, targetId, placement, `split-${nextIdRef.current++}`) : current
    );
    setSelectedLayoutId(draggedId);
    setDraggingPaneId(null);
    setDragPointer(null);
    setDropHint(null);
    setRootDropHint(null);
    document.body.classList.remove("is-layout-dragging");
  }

  function moveLayoutPaneToRoot(draggedId: string, placement: SplitPlacement) {
    setLayoutRoot((current) =>
      current ? moveLeafToRoot(current, draggedId, placement, `split-${nextIdRef.current++}`) : current
    );
    setSelectedLayoutId(draggedId);
    setDraggingPaneId(null);
    setDragPointer(null);
    setDropHint(null);
    setRootDropHint(null);
    document.body.classList.remove("is-layout-dragging");
  }

  function dropAtRoot(placement: SplitPlacement) {
    if (draggingPaneId && layoutRoot) {
      setLayoutRoot(moveLeafToRoot(layoutRoot, draggingPaneId, placement, `split-${nextIdRef.current++}`));
      setSelectedLayoutId(draggingPaneId);
      setDraggingPaneId(null);
      setDropHint(null);
      setRootDropHint(null);
      return;
    }

    if (draggingWidgetKind) {
      const nextLeaf = createLeaf(`layout-${nextIdRef.current++}`, draggingWidgetKind);
      setLayoutRoot((current) => (current ? wrapRootNode(current, nextLeaf, placement, `split-${nextIdRef.current++}`) : nextLeaf));
      setSelectedLayoutId(nextLeaf.id);
      setDraggingWidgetKind(null);
      setDropHint(null);
      setRootDropHint(null);
    }
  }

  function removeLayoutWidget(id: string) {
    setLayoutRoot((current) => {
      if (!current) {
        return current;
      }

      const nextRoot = removeLeafNode(current, id);
      const nextSelectedId = findFirstLeafId(nextRoot);
      setSelectedLayoutId(nextSelectedId);
      return nextRoot;
    });
  }

  function resizeSplit(splitId: string, _direction: SplitDirection, nextRatio: number) {
    setLayoutRoot((current) => (current ? updateSplitRatio(current, splitId, nextRatio) : current));
  }

  function resetLayout() {
    startTransition(() => {
      setLayoutRoot(createDefaultLayoutTree());
      setSelectedLayoutId("layout-chat");
      setDropHint(null);
      setDraggingPaneId(null);
      setDraggingWidgetKind(null);
      setDragPointer(null);
      setRootDropHint(null);
      document.body.classList.remove("is-layout-dragging");
      nextIdRef.current = 3;
    });
  }

  function clearDragIndicators() {
    activeDockTargetRef.current = null;
    setDropHint(null);
    setRootDropHint(null);
    setDraggingPaneId(null);
    setDragPointer(null);
    document.body.classList.remove("is-layout-dragging");
  }

  function resolveDockTarget(clientX: number, clientY: number, draggedId: string): DockTarget | null {
    const elements = document.elementsFromPoint(clientX, clientY) as HTMLElement[];

    for (const element of elements) {
      const placement = element.dataset.dockPlacement as SplitPlacement | undefined;
      const scope = element.dataset.dockScope as "pane" | "root" | undefined;

      if (!placement || !scope) {
        continue;
      }

      if (scope === "pane") {
        const paneId = element.dataset.paneId;

        if (!paneId || paneId === draggedId) {
          continue;
        }

        return { paneId, placement, scope };
      }

      return { placement, scope };
    }

    return null;
  }

  function beginPaneDrag(paneId: string, event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();

    const pane = layoutRoot ? findLeafById(layoutRoot, paneId) : null;

    if (!pane) {
      return;
    }

    const definition = widgetDefinitions.find((item) => item.kind === pane.kind) ?? widgetDefinitions[0];
    const paneKind = pane.kind;

    setDraggingPaneId(paneId);
    setDraggingWidgetKind(null);
    setDragPointer({
      kind: paneKind,
      label: definition.canvasTitle,
      x: event.clientX,
      y: event.clientY
    });
    document.body.classList.add("is-layout-dragging");

    function handlePointerMove(moveEvent: PointerEvent) {
      const nextTarget = resolveDockTarget(moveEvent.clientX, moveEvent.clientY, paneId);
      activeDockTargetRef.current = nextTarget;
      setDragPointer({
        kind: paneKind,
        label: definition.canvasTitle,
        x: moveEvent.clientX,
        y: moveEvent.clientY
      });

      if (nextTarget?.scope === "pane") {
        setDropHint({ placement: nextTarget.placement, targetId: nextTarget.paneId });
        setRootDropHint(null);
        return;
      }

      if (nextTarget?.scope === "root") {
        setDropHint(null);
        setRootDropHint(nextTarget.placement);
        return;
      }

      setDropHint(null);
      setRootDropHint(null);
    }

    function handlePointerUp() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      const nextTarget = activeDockTargetRef.current;

      if (nextTarget?.scope === "pane") {
        moveLayoutPane(paneId, nextTarget.paneId, nextTarget.placement);
      } else if (nextTarget?.scope === "root") {
        moveLayoutPaneToRoot(paneId, nextTarget.placement);
      } else {
        clearDragIndicators();
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  }

  return (
    <main className={`showcase-shell is-${activePage}-page`}>
      <section className="showcase-hero">
        <div className="hero-top">
          <div className="hero-title-block">
            <p className="hero-kicker">InnoSpark / AIWebComponent</p>
            <h1>组件工作台</h1>
          </div>
          <div className="hero-actions">
            <button
              className={`hero-tab${activePage === "catalog" ? " is-active" : ""}`}
              onClick={() => {
                startTransition(() => {
                  setActivePage("catalog");
                });
              }}
              type="button"
            >
              控件预览
            </button>
            <button
              className={`hero-tab${activePage === "layout" ? " is-active" : ""}`}
              onClick={() => {
                startTransition(() => {
                  setActivePage("layout");
                });
              }}
              type="button"
            >
              布局编辑
            </button>
          </div>
        </div>
        <p className="hero-summary">当前工作区支持控件预览与分栏布局编辑，布局模式会像 tmux 一样先占满空间，再通过分割窗格继续扩展。</p>
        <div className="hero-meta">
          <span>已沉淀控件 {widgetDefinitions.length}</span>
          <span>支持拖拽预览 / 分栏排布 / 比例调节</span>
        </div>
      </section>

      {activePage === "catalog" ? (
        <section className="editor-layout">
          <aside className="editor-sidebar">
            <div className="editor-sidebar-head">
              <p>Catalog</p>
              <h3>控件列表</h3>
            </div>
            <div className="editor-sidebar-list">
              {widgetDefinitions.map((definition) => {
                const isActive = definition.kind === activeCatalogKind;

                return (
                  <button
                    key={definition.kind}
                    className={`editor-palette-item${isActive ? " is-active" : ""}`}
                    onClick={() => updateCatalogKind(definition.kind)}
                    type="button"
                  >
                    <div className="editor-palette-row">
                      <div className="editor-palette-entry">
                        {renderIcon(definition.iconSrc, definition.iconAlt, "chip", isActive ? "accent" : "neutral")}
                        <div className="editor-palette-copy">
                          <strong>{definition.canvasTitle}</strong>
                          <span>{definition.label}</span>
                        </div>
                      </div>
                      <span className="editor-palette-hint">{definition.hint}</span>
                    </div>
                    <p>{definition.summary}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="editor-main">
            <div className="editor-main-head">
              <div>
                <p>Preview</p>
                <h3>{selectedDefinition.canvasTitle}</h3>
              </div>
              <div className="editor-meta-pills">
                <span>拖动移动</span>
                <span>右下角缩放</span>
              </div>
            </div>
            <div className="editor-canvas" ref={previewCanvasRef}>
              <CanvasWidget
                boundsRef={previewCanvasRef}
                definition={selectedDefinition}
                layout={catalogPreview}
                onChange={setCatalogPreview}
                onSelect={() => undefined}
                selected
              />
            </div>
          </section>
        </section>
      ) : (
        <section className="layout-workbench">
          <aside className="editor-sidebar">
            <div className="editor-sidebar-head">
              <p>Palette</p>
              <h3>组件列表</h3>
            </div>
            <div className="editor-sidebar-list">
              {widgetDefinitions.map((definition) => (
                <div
                  key={definition.kind}
                  className="editor-palette-item"
                  draggable
                  onDragEnd={() => {
                    setDraggingWidgetKind(null);
                    setDropHint(null);
                    setRootDropHint(null);
                  }}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/widget-kind", definition.kind);
                    event.dataTransfer.effectAllowed = "copy";
                    setDraggingWidgetKind(definition.kind);
                  }}
                >
                  <div className="editor-palette-row">
                    <div className="editor-palette-entry">
                      {renderIcon(definition.iconSrc, definition.iconAlt, "chip")}
                      <div className="editor-palette-copy">
                        <strong>{definition.canvasTitle}</strong>
                        <span>{definition.label}</span>
                      </div>
                    </div>
                    <div className="editor-palette-actions">
                      <button
                        className="mini-action"
                        onClick={() => addLayoutWidget(definition.kind, "right")}
                        type="button"
                      >
                        右分栏
                      </button>
                      <button
                        className="mini-action"
                        onClick={() => addLayoutWidget(definition.kind, "bottom")}
                        type="button"
                      >
                        下分栏
                      </button>
                    </div>
                  </div>
                  <p>{definition.summary}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="layout-canvas-shell">
            <div className="editor-main-head">
              <div>
                <p>Canvas</p>
                <h3>布局画布</h3>
              </div>
              <div className="editor-actions">
                <button
                  className={`demo-button subtle${insertPlacement === "right" ? " is-active" : ""}`}
                  onClick={() => setInsertPlacement("right")}
                  type="button"
                >
                  默认向右分栏
                </button>
                <button
                  className={`demo-button subtle${insertPlacement === "bottom" ? " is-active" : ""}`}
                  onClick={() => setInsertPlacement("bottom")}
                  type="button"
                >
                  默认向下分栏
                </button>
                <button className="demo-button subtle" onClick={resetLayout} type="button">
                  重置布局
                </button>
                <button className="demo-button" onClick={() => addLayoutWidget("graph")} type="button">
                  快速插入图谱
                </button>
              </div>
            </div>

            <div
              className="editor-canvas layout-canvas"
              onDragOver={(event) => {
                if (!layoutRoot) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                }
              }}
              onDrop={(event) => {
                if (!layoutRoot) {
                  event.preventDefault();

                  const draggedPaneId = event.dataTransfer.getData("text/layout-pane-id");
                  const kind = event.dataTransfer.getData("text/widget-kind") as WidgetKind;

                  if (draggedPaneId) {
                    setDraggingPaneId(null);
                    return;
                  }

                  if (kind) {
                    addLayoutWidget(kind);
                  }
                }
              }}
            >
              {!layoutRoot ? (
                <div className="editor-empty-state layout-empty-state">
                  {renderIcon(informationCircleIcon, "info", "visual", "neutral")}
                  <strong>先放入第一个控件</strong>
                  <p>第一个控件会自动占满整个空间。后续继续拖入或点击“右分栏 / 下分栏”时，会基于当前窗格继续切分。</p>
                </div>
              ) : (
                <SplitWorkspace
                  dropHint={dropHint}
                  dragPointer={dragPointer}
                  draggingPaneId={draggingPaneId}
                  draggingWidgetKind={draggingWidgetKind}
                  onBeginPaneDrag={beginPaneDrag}
                  onDragPane={setDraggingPaneId}
                  onDropAtRoot={dropAtRoot}
                  onDropWidget={dropLayoutWidget}
                  onMovePane={moveLayoutPane}
                  onRemovePane={removeLayoutWidget}
                  onResizeSplit={resizeSplit}
                  onSelectPane={setSelectedLayoutId}
                  rootDropHint={rootDropHint}
                  root={layoutRoot}
                  selectedId={selectedLayoutId}
                  setRootDropHint={setRootDropHint}
                  setDropHint={setDropHint}
                />
              )}
            </div>
          </section>

          <aside className="inspector-panel">
            <div className="editor-sidebar-head">
              <p>Inspector</p>
              <h3>当前控件</h3>
            </div>
            {selectedLayoutWidget ? (
              <div className="inspector-card">
                <div className="inspector-title">
                  {renderIcon(
                    selectedLayoutDefinition?.iconSrc ?? lightBulbIcon,
                    "selected widget",
                    "chip"
                  )}
                  <div className="inspector-copy">
                    <strong>{selectedLayoutDefinition?.canvasTitle ?? selectedLayoutWidget.kind}</strong>
                    <span>{selectedLayoutDefinition?.label ?? selectedLayoutWidget.kind}</span>
                  </div>
                </div>
                <div className="inspector-grid">
                  <div>
                    <span>Pane</span>
                    <strong>{selectedLayoutDefinition?.label ?? selectedLayoutWidget.kind}</strong>
                  </div>
                  <div>
                    <span>Count</span>
                    <strong>{layoutLeafCount}</strong>
                  </div>
                  <div>
                    <span>Insert</span>
                    <strong>{insertPlacement === "right" ? "Right" : "Bottom"}</strong>
                  </div>
                  <div>
                    <span>Mode</span>
                    <strong>Split</strong>
                  </div>
                </div>
                <p>当前布局会始终铺满整个工作区。新增控件时会从选中窗格继续切分，拖动分割条可调节区域比例。</p>
              </div>
            ) : (
              <div className="inspector-card is-empty">
                {renderIcon(informationCircleIcon, "info", "visual", "neutral")}
                <strong>还没有布局内容</strong>
                <p>先把一个控件放进画布，它会自动占满。之后再继续分栏扩展。</p>
              </div>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}
