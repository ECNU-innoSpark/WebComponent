import type { CSSProperties, ReactNode } from "react";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
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
  panelTitleStyle
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

  return (
    <section style={panelSurfaceStyle}>
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

      <div style={{ ...panelBodyStyle, gap: 10 }}>
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

          return (
            <article
              key={node.id}
              onClick={() => onSelectNode?.(node)}
              style={{
                alignItems: "center",
                ...createSelectableCardStyle(node.path === selectedPath),
                cursor: onSelectNode ? "pointer" : "default",
                display: "grid",
                gap: 4,
                padding: "14px 16px"
              }}
            >
              <div
                style={{
                  alignItems: "start",
                  display: "flex",
                  gap: 12,
                  justifyContent: "space-between"
                }}
              >
                <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={createToneBadgeStyle(node.kind === "directory" ? "accent" : "secondary")}>
                    {node.kind === "directory" ? "目录" : "文件"}
                  </span>
                  <strong style={{ color: aiWebComponentTokens.colorText }}>{node.name}</strong>
                </div>
                {node.badge ? (
                  <span style={createToneBadgeStyle(node.path === selectedPath ? "accent" : "neutral")}>
                    {node.badge}
                  </span>
                ) : null}
              </div>
              {node.description ? (
                <span style={{ color: aiWebComponentTokens.colorMuted, fontSize: 14 }}>{node.description}</span>
              ) : null}
              {node.meta ? (
                <span style={{ color: aiWebComponentTokens.colorMuted, fontSize: 12 }}>{node.meta}</span>
              ) : null}
              <div
                onClick={(event) => {
                  event.stopPropagation();
                }}
                style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}
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
  background: aiWebComponentTokens.colorSurface,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusPill,
  color: aiWebComponentTokens.colorText,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  padding: "6px 10px"
} satisfies CSSProperties;
