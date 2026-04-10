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
              <div className="demo-input">请继续补充课堂提问语句，并把练习题按难度分成 A/B 两组。</div>
              <div className="demo-footer-actions">
                <button className="demo-button subtle">刷新上下文</button>
                <button className="demo-button primary">发送</button>
              </div>
            </div>
          }
          headerActions={<span className="demo-pill">assistant-v0.3</span>}
          hideHeader
          messages={sampleMessages}
          status="streaming"
          statusBanner="当前会话已接入资料包、知识图谱和课程模板三类上下文。"
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
  const [layoutWidgets, setLayoutWidgets] = useState<WidgetLayout[]>([
    {
      id: "layout-session",
      kind: "session",
      x: 32,
      y: 40,
      width: 340,
      height: 500
    },
    {
      id: "layout-chat",
      kind: "chat",
      x: 392,
      y: 40,
      width: 700,
      height: 540
    }
  ]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>("layout-chat");

  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const layoutCanvasRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(3);

  const selectedDefinition =
    widgetDefinitions.find((definition) => definition.kind === activeCatalogKind) ?? widgetDefinitions[0];
  const selectedLayoutWidget = layoutWidgets.find((widget) => widget.id === selectedLayoutId) ?? null;

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

  function updateLayoutWidget(id: string, nextLayout: WidgetLayout) {
    setLayoutWidgets((current) => current.map((widget) => (widget.id === id ? nextLayout : widget)));
  }

  function addLayoutWidget(kind: WidgetKind, x = 48, y = 48) {
    const size = defaultSizes[kind];
    const nextWidget = {
      id: `layout-${nextIdRef.current++}`,
      kind,
      x,
      y,
      width: size.width,
      height: size.height
    };

    setLayoutWidgets((current) => [...current, nextWidget]);
    setSelectedLayoutId(nextWidget.id);
  }

  function removeLayoutWidget(id: string) {
    setLayoutWidgets((current) => current.filter((widget) => widget.id !== id));
    setSelectedLayoutId((current) => (current === id ? "" : current));
  }

  function resetLayout() {
    startTransition(() => {
      setLayoutWidgets([
        {
          id: "layout-session",
          kind: "session",
          x: 32,
          y: 40,
          width: 340,
          height: 500
        },
        {
          id: "layout-chat",
          kind: "chat",
          x: 392,
          y: 40,
          width: 700,
          height: 540
        }
      ]);
      setSelectedLayoutId("layout-chat");
      nextIdRef.current = 3;
    });
  }

  return (
    <main className="showcase-shell">
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
              页面 1 · 控件预览
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
              页面 2 · 布局编辑
            </button>
          </div>
        </div>
        <p className="hero-summary">
          当前展示页分成两个页面：页面 1 用于控件预览，页面 2 用于自由布局编辑，整体保持轻量、清晰、接近 IDE 工作区。
        </p>
        <div className="hero-meta">
          <span>已沉淀控件 {widgetDefinitions.length}</span>
          <span>2 个编辑页面</span>
          <span>支持拖拽 / 缩放 / 排布</span>
        </div>
      </section>

      <section className="section-heading">
        <p>{activePage === "catalog" ? "页面 1" : "页面 2"}</p>
        <h2>
          {activePage === "catalog"
            ? "左侧控件列表，右侧主视窗显示并可拖拽缩放"
            : "像 IDE 一样拖拽控件到画布，并自由调节大小与位置"}
        </h2>
      </section>

      {activePage === "catalog" ? (
        <section className="editor-layout">
          <aside className="editor-sidebar">
            <div className="editor-sidebar-head">
              <p>Control List</p>
              <h3>选择要预览的控件</h3>
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
                    <div className="editor-palette-top">
                      {renderIcon(definition.iconSrc, definition.iconAlt, "chip", isActive ? "accent" : "neutral")}
                      <span>{definition.hint}</span>
                    </div>
                    <strong>{definition.label}</strong>
                    <p>{definition.summary}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="editor-main">
            <div className="editor-main-head">
              <div>
                <p>Preview Window</p>
                <h3>{selectedDefinition.label}</h3>
              </div>
              <div className="editor-meta-pills">
                <span>拖动顶部栏移动</span>
                <span>拖动右下角缩放</span>
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
              <p>Widget Palette</p>
              <h3>拖拽到画布或点击添加</h3>
            </div>
            <div className="editor-sidebar-list">
              {widgetDefinitions.map((definition) => (
                <div
                  key={definition.kind}
                  className="editor-palette-item"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/widget-kind", definition.kind);
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                >
                  <div className="editor-palette-top">
                    {renderIcon(definition.iconSrc, definition.iconAlt, "chip")}
                    <span>{definition.hint}</span>
                  </div>
                  <strong>{definition.label}</strong>
                  <p>{definition.summary}</p>
                  <button
                    className="mini-action"
                    onClick={() => addLayoutWidget(definition.kind, 56, 56)}
                    type="button"
                  >
                    添加到画布
                  </button>
                </div>
              ))}
            </div>
          </aside>

          <section className="layout-canvas-shell">
            <div className="editor-main-head">
              <div>
                <p>Layout Canvas</p>
                <h3>工作台布局模式</h3>
              </div>
              <div className="editor-actions">
                <button className="demo-button subtle" onClick={resetLayout} type="button">
                  重置布局
                </button>
                <button className="demo-button" onClick={() => addLayoutWidget("graph", 140, 120)} type="button">
                  快速插入图谱
                </button>
              </div>
            </div>

            <div
              className="editor-canvas layout-canvas"
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(event) => {
                event.preventDefault();

                const kind = event.dataTransfer.getData("text/widget-kind") as WidgetKind;
                const canvas = layoutCanvasRef.current;

                if (!canvas || !kind) {
                  return;
                }

                const rect = canvas.getBoundingClientRect();
                const size = defaultSizes[kind];
                const x = clamp(event.clientX - rect.left - size.width / 2, 0, rect.width - size.width);
                const y = clamp(event.clientY - rect.top - size.height / 2, 0, rect.height - size.height);
                addLayoutWidget(kind, x, y);
              }}
              ref={layoutCanvasRef}
            >
              {layoutWidgets.length === 0 ? (
                <div className="editor-empty-state">
                  {renderIcon(informationCircleIcon, "info", "visual", "neutral")}
                  <strong>把左侧控件拖进这里</strong>
                  <p>你也可以点击“添加到画布”。放入后可继续拖动位置，并从右下角调节尺寸。</p>
                </div>
              ) : null}

              {layoutWidgets.map((widget) => {
                const definition =
                  widgetDefinitions.find((item) => item.kind === widget.kind) ?? widgetDefinitions[0];

                return (
                  <CanvasWidget
                    key={widget.id}
                    boundsRef={layoutCanvasRef}
                    definition={definition}
                    layout={widget}
                    onChange={(nextLayout) => updateLayoutWidget(widget.id, nextLayout)}
                    onRemove={() => removeLayoutWidget(widget.id)}
                    onSelect={() => setSelectedLayoutId(widget.id)}
                    selected={widget.id === selectedLayoutId}
                  />
                );
              })}
            </div>
          </section>

          <aside className="inspector-panel">
            <div className="editor-sidebar-head">
              <p>Inspector</p>
              <h3>当前选中控件</h3>
            </div>
            {selectedLayoutWidget ? (
              <div className="inspector-card">
                <div className="inspector-title">
                  {renderIcon(
                    widgetDefinitions.find((item) => item.kind === selectedLayoutWidget.kind)?.iconSrc ?? lightBulbIcon,
                    "selected widget",
                    "chip"
                  )}
                  <strong>
                    {widgetDefinitions.find((item) => item.kind === selectedLayoutWidget.kind)?.label ??
                      selectedLayoutWidget.kind}
                  </strong>
                </div>
                <div className="inspector-grid">
                  <div>
                    <span>X</span>
                    <strong>{Math.round(selectedLayoutWidget.x)}</strong>
                  </div>
                  <div>
                    <span>Y</span>
                    <strong>{Math.round(selectedLayoutWidget.y)}</strong>
                  </div>
                  <div>
                    <span>W</span>
                    <strong>{Math.round(selectedLayoutWidget.width)}</strong>
                  </div>
                  <div>
                    <span>H</span>
                    <strong>{Math.round(selectedLayoutWidget.height)}</strong>
                  </div>
                </div>
                <p>拖住控件顶部栏即可移动，拖住右下角即可缩放。当前模式更接近 IDE 的自由画布排布方式。</p>
              </div>
            ) : (
              <div className="inspector-card is-empty">
                {renderIcon(informationCircleIcon, "info", "visual", "neutral")}
                <strong>还没有选中控件</strong>
                <p>点击画布中的任意控件后，这里会显示当前尺寸和位置信息。</p>
              </div>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}
