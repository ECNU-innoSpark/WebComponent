import type { CSSProperties, ReactNode } from "react";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
  createPanelCalloutStyle,
  createGhostButtonStyle,
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

export type FileTreeNode = {
  id: string;
  path: string;
  name: string;
  kind: "file" | "directory";
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
};

export type FileManagerPanelProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  hideHeader?: boolean;
  currentPath?: string;
  nodes: FileTreeNode[];
  selectedPath?: string;
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
  headerActions?: ReactNode;
  onNavigate?: (path: string) => void;
  onOpenFile?: (node: FileTreeNode) => void;
  onSelectNode?: (node: FileTreeNode) => void;
  renderNodeActions?: (node: FileTreeNode) => ReactNode;
};

function buildBreadcrumbs(path: string) {
  if (!path || path === ".") {
    return [{ label: ".", path: "." }];
  }

  const parts = path.split("/").filter(Boolean);
  const breadcrumbs = [{ label: ".", path: "." }];

  for (let index = 0; index < parts.length; index += 1) {
    breadcrumbs.push({
      label: parts[index] ?? "",
      path: parts.slice(0, index + 1).join("/")
    });
  }

  return breadcrumbs;
}

export function FileManagerPanel({
  title = "文件管理",
  subtitle,
  titleIcon,
  hideHeader = false,
  currentPath = ".",
  nodes,
  selectedPath,
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
  headerActions,
  onNavigate,
  onOpenFile,
  onSelectNode,
  renderNodeActions
}: FileManagerPanelProps) {
  const showError = status === "error";
  const showEmpty = nodes.length === 0 && status === "idle";
  const showLoading = nodes.length === 0 && status === "loading";
  const selectedNode = nodes.find((node) => node.path === selectedPath);
  const surfaceStyle = hideHeader
    ? { ...panelSurfaceStyle, background: "transparent", border: "none", borderRadius: 0 }
    : panelSurfaceStyle;
  const bodyStyle = hideHeader ? { ...panelBodyStyle, gap: 10, padding: 0 } : { ...panelBodyStyle, gap: 12 };

  return (
    <section style={surfaceStyle}>
      {!hideHeader ? (
        <header style={{ ...panelHeaderStyle, display: "grid" }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 16,
              justifyContent: "space-between"
            }}
          >
            <div style={panelHeaderMainStyle}>
              <div style={panelTitleRowStyle}>
                {titleIcon ? <span style={createIconFrameStyle("accent")}>{titleIcon}</span> : null}
                <div style={panelTitleStyle}>{title}</div>
              </div>
              {subtitle ? <div style={panelSubtitleStyle}>{subtitle}</div> : null}
              <span style={createToneBadgeStyle("neutral")}>{nodes.length} 个项目</span>
            </div>
            {headerActions ? <div>{headerActions}</div> : null}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12
            }}
          >
            {buildBreadcrumbs(currentPath).map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate?.(item.path)}
                style={{
                  ...createGhostButtonStyle(Boolean(onNavigate)),
                  background:
                    item.path === currentPath ? aiWebComponentTokens.colorAccentSoft : aiWebComponentTokens.colorSurfaceMuted,
                  borderColor:
                    item.path === currentPath
                      ? aiWebComponentTokens.colorBorderStrong
                      : aiWebComponentTokens.colorBorder
                }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>
      ) : null}

      <div style={bodyStyle}>
        {hideHeader ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {buildBreadcrumbs(currentPath).map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate?.(item.path)}
                style={{
                  ...createGhostButtonStyle(Boolean(onNavigate)),
                  background:
                    item.path === currentPath ? aiWebComponentTokens.colorAccentSoft : aiWebComponentTokens.colorSurfaceMuted,
                  borderColor:
                    item.path === currentPath
                      ? aiWebComponentTokens.colorBorderStrong
                      : aiWebComponentTokens.colorBorder
                }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
        <div style={createPanelCalloutStyle("secondary")}>
          <div style={{ ...sectionLabelStyle, marginBottom: 8 }}>目录</div>
          <div style={{ color: aiWebComponentTokens.colorText, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
            {currentPath}
          </div>
          <div style={{ color: aiWebComponentTokens.colorTextSubtle, fontSize: 12, lineHeight: 1.55 }}>
            {nodes.length} 个项目
            {selectedNode ? ` · 当前 ${selectedNode.name}` : ""}
          </div>
        </div>
        {showError ? (
          <PanelStateBlock
            action={errorAction}
            description={errorState ?? "目录加载失败，请稍后重试。"}
            title="暂时无法读取目录"
            tone="danger"
            visual={errorVisual}
          />
        ) : null}

        {showLoading ? (
          <PanelStateBlock
            action={loadingAction}
            description={loadingState ?? "正在加载文件目录..."}
            title="正在同步目录内容"
            tone="accent"
            visual={loadingVisual}
          />
        ) : null}

        {showEmpty ? (
          <PanelStateBlock
            action={emptyAction}
            description={emptyState ?? "当前目录没有文件。"}
            title="目录还是空的"
            tone="neutral"
            visual={emptyVisual}
          />
        ) : null}

        {nodes.map((node) => {
          const nodeActions = renderNodeActions?.(node);
          const isSelected = node.path === selectedPath;

          return (
            <article
              key={node.id}
              onClick={() => onSelectNode?.(node)}
              style={{
                alignItems: "center",
                ...createSelectableCardStyle(isSelected),
                borderLeft: `2px solid ${
                  isSelected ? aiWebComponentTokens.colorAccent : "transparent"
                }`,
                cursor: onSelectNode ? "pointer" : "default",
                display: "grid",
                gap: 8,
                padding: "12px 13px"
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
                <span style={sectionLabelStyle}>{node.kind === "directory" ? "Directory" : "File"}</span>
                {node.meta ? (
                  <span style={{ color: aiWebComponentTokens.colorMuted, fontSize: 11 }}>{node.meta}</span>
                ) : null}
              </div>
              <div
                style={{
                  alignItems: "start",
                  display: "flex",
                  gap: 12,
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ color: aiWebComponentTokens.colorText }}>{node.name}</strong>
                  <span
                    style={{
                      color:
                        node.kind === "directory"
                          ? aiWebComponentTokens.colorAccent
                          : aiWebComponentTokens.colorMuted,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase"
                    }}
                  >
                    {node.kind === "directory" ? "目录" : "文件"}
                  </span>
                </div>
                {node.badge ? (
                  <span style={createToneBadgeStyle(isSelected ? "accent" : "neutral")}>
                    {node.badge}
                  </span>
                ) : null}
              </div>
              {node.description ? (
                <span style={{ color: aiWebComponentTokens.colorTextSubtle, fontSize: 13, lineHeight: 1.6 }}>
                  {node.description}
                </span>
              ) : null}
              <div
                onClick={(event) => {
                  event.stopPropagation();
                }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}
              >
                {node.kind === "directory" ? (
                  <button
                    onClick={() => onNavigate?.(node.path)}
                    style={actionButtonStyle}
                    type="button"
                  >
                    打开目录
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenFile?.(node)}
                    style={actionButtonStyle}
                    type="button"
                  >
                    打开文件
                  </button>
                )}
                {nodeActions}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const actionButtonStyle = {
  background: aiWebComponentTokens.colorSurfaceRaised,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusSmall,
  boxShadow: aiWebComponentTokens.shadowSoft,
  color: aiWebComponentTokens.colorText,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  padding: "6px 10px"
} satisfies CSSProperties;
