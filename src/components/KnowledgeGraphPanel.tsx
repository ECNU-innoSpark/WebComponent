import type { ReactNode } from "react";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
  createIconFrameStyle,
  createSelectableCardStyle,
  createToneBadgeStyle,
  panelBodyStyle,
  panelHeaderMainStyle,
  panelHeaderStyle,
  panelSubtitleStyle,
  panelSurfaceStyle,
  panelTitleRowStyle,
  panelTitleStyle,
  sectionLabelStyle
} from "../styles/panelStyles";
import { aiWebComponentTokens } from "../styles/tokens";

export type KnowledgeNode = {
  id: string;
  label: string;
  category: string;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
};

export type KnowledgeEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
};

export type KnowledgeGraphPanelProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  hideHeader?: boolean;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  status?: "idle" | "loading" | "error";
  emptyState?: ReactNode;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  emptyVisual?: ReactNode;
  emptyAction?: ReactNode;
  loadingVisual?: ReactNode;
  loadingAction?: ReactNode;
  errorVisual?: ReactNode;
  errorAction?: ReactNode;
  summary?: ReactNode;
  headerActions?: ReactNode;
  activeNodeId?: string;
  onSelectNode?: (node: KnowledgeNode) => void;
};

export function KnowledgeGraphPanel({
  title = "知识图谱",
  subtitle,
  titleIcon,
  hideHeader = false,
  nodes,
  edges,
  status = "idle",
  emptyState,
  loadingState,
  errorState,
  emptyVisual,
  emptyAction,
  loadingVisual,
  loadingAction,
  errorVisual,
  errorAction,
  summary,
  headerActions,
  activeNodeId,
  onSelectNode
}: KnowledgeGraphPanelProps) {
  const showError = status === "error";
  const showEmpty = nodes.length === 0 && edges.length === 0 && status === "idle";
  const showLoading = nodes.length === 0 && edges.length === 0 && status === "loading";
  const categories = new Set(nodes.map((node) => node.category)).size;

  return (
    <section style={panelSurfaceStyle}>
      {!hideHeader ? (
        <header style={panelHeaderStyle}>
          <div style={panelHeaderMainStyle}>
            <div style={panelTitleRowStyle}>
              {titleIcon ? <span style={createIconFrameStyle("accent")}>{titleIcon}</span> : null}
              <div style={panelTitleStyle}>{title}</div>
            </div>
            <div style={panelSubtitleStyle}>
              {subtitle ?? "用于承接知识点、任务链路与文件引用之间的结构化关系。"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={createToneBadgeStyle("accent")}>{nodes.length} 个节点</span>
              <span style={createToneBadgeStyle("secondary")}>{edges.length} 条关系</span>
              <span style={createToneBadgeStyle("neutral")}>{categories} 个分组</span>
            </div>
          </div>
          {headerActions ? <div>{headerActions}</div> : null}
        </header>
      ) : null}

      <div style={panelBodyStyle}>
        {summary ? (
          <div
            style={{
              background: `linear-gradient(180deg, ${aiWebComponentTokens.colorSurfaceMuted} 0%, ${aiWebComponentTokens.colorAccentSoft} 100%)`,
              border: `1px solid ${aiWebComponentTokens.colorBorder}`,
              borderRadius: aiWebComponentTokens.radiusSmall,
              lineHeight: 1.6,
              padding: "18px 16px"
            }}
          >
            {summary}
          </div>
        ) : null}

        {showError ? (
          <PanelStateBlock
            action={errorAction}
            description={errorState ?? "图谱数据加载失败。"}
            title="暂时无法整理知识关系"
            tone="danger"
            visual={errorVisual}
          />
        ) : null}
        {showLoading ? (
          <PanelStateBlock
            action={loadingAction}
            description={loadingState ?? "正在整理知识关系..."}
            title="正在生成关系视图"
            tone="accent"
            visual={loadingVisual}
          />
        ) : null}
        {showEmpty ? (
          <PanelStateBlock
            action={emptyAction}
            description={emptyState ?? "当前还没有可展示的知识关系。"}
            title="还没有图谱内容"
            tone="neutral"
            visual={emptyVisual}
          />
        ) : null}

        {!showError && !showLoading && !showEmpty ? (
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
            }}
          >
            <div
              style={{
                background: aiWebComponentTokens.colorSurfaceMuted,
                borderRadius: aiWebComponentTokens.radiusSmall,
                display: "grid",
                gap: 12,
                padding: 16
              }}
            >
              <div style={sectionLabelStyle}>Nodes</div>
              <div style={{ display: "grid", gap: 10 }}>
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode?.(node)}
                    style={{
                      ...createSelectableCardStyle(node.id === activeNodeId),
                      cursor: onSelectNode ? "pointer" : "default",
                      display: "grid",
                      gap: 6,
                      padding: "12px 14px",
                      textAlign: "left"
                    }}
                    type="button"
                  >
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: 8,
                        justifyContent: "space-between"
                      }}
                    >
                      <strong style={{ color: aiWebComponentTokens.colorText }}>{node.label}</strong>
                      {node.badge ? <span style={createToneBadgeStyle("accent")}>{node.badge}</span> : null}
                    </div>
                    <div style={{ color: aiWebComponentTokens.colorTextSubtle, fontSize: 13 }}>
                      {node.description ?? node.category}
                    </div>
                    {node.meta ? (
                      <div style={{ color: aiWebComponentTokens.colorMuted, fontSize: 12 }}>{node.meta}</div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: aiWebComponentTokens.colorSurfaceMuted,
                borderRadius: aiWebComponentTokens.radiusSmall,
                display: "grid",
                gap: 12,
                padding: 16
              }}
            >
              <div style={sectionLabelStyle}>Edges</div>
              <div style={{ display: "grid", gap: 10 }}>
                {edges.map((edge) => (
                  <div
                    key={edge.id}
                    style={{
                      background: aiWebComponentTokens.colorSurface,
                      border: `1px solid ${aiWebComponentTokens.colorBorder}`,
                      borderRadius: 14,
                      display: "grid",
                      gap: 6,
                      padding: "12px 14px"
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: 8,
                        justifyContent: "space-between"
                      }}
                    >
                      <strong style={{ color: aiWebComponentTokens.colorText }}>{edge.label}</strong>
                      {edge.badge ? <span style={createToneBadgeStyle("secondary")}>{edge.badge}</span> : null}
                    </div>
                    <div style={{ color: aiWebComponentTokens.colorTextSubtle, fontSize: 13 }}>
                      {edge.description ?? `${edge.source} → ${edge.target}`}
                    </div>
                    {edge.meta ? (
                      <div style={{ color: aiWebComponentTokens.colorMuted, fontSize: 12 }}>{edge.meta}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
