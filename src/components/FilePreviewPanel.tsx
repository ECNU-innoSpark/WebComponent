import type { ReactNode } from "react";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
  createIconFrameStyle,
  createToneBadgeStyle,
  panelBodyStyle,
  panelHeaderMainStyle,
  panelHeaderStyle,
  panelSubtitleStyle,
  panelSurfaceStyle,
  panelTitleRowStyle,
  panelTitleStyle,
  stackedMetaStyle
} from "../styles/panelStyles";
import { aiWebComponentTokens } from "../styles/tokens";

export type FilePreviewPanelProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  hideHeader?: boolean;
  fileName?: string;
  language?: string;
  content?: ReactNode;
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
};

export function FilePreviewPanel({
  title = "文件预览",
  subtitle,
  titleIcon,
  hideHeader = false,
  fileName,
  language = "text",
  content,
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
  headerActions
}: FilePreviewPanelProps) {
  const hasContent = content !== undefined && content !== null && content !== "";
  const showError = !hasContent && status === "error";
  const showEmpty = !hasContent && status === "idle";
  const showLoading = !hasContent && status === "loading";
  const isPrimitiveContent = typeof content === "string" || typeof content === "number";

  return (
    <section style={panelSurfaceStyle}>
      {!hideHeader ? (
        <header style={panelHeaderStyle}>
          <div style={panelHeaderMainStyle}>
            <div style={panelTitleRowStyle}>
              {titleIcon ? <span style={createIconFrameStyle("accent")}>{titleIcon}</span> : null}
              <div style={panelTitleStyle}>{title}</div>
            </div>
            <div style={panelSubtitleStyle}>{subtitle ?? "支持文本、Markdown、JSON 等结构化内容"}</div>
            <div style={stackedMetaStyle}>
              <span style={createToneBadgeStyle(fileName ? "accent" : "neutral")}>
                {fileName ?? "尚未选择文件"}
              </span>
              <span style={createToneBadgeStyle("secondary")}>{language}</span>
            </div>
          </div>
          {headerActions ? <div>{headerActions}</div> : null}
        </header>
      ) : null}

      <div
        style={{
          ...panelBodyStyle,
          minHeight: 320
        }}
      >
        {showError ? (
          <PanelStateBlock
            action={errorAction}
            description={errorState ?? "文件内容加载失败。"}
            title="暂时无法预览文件"
            tone="danger"
            visual={errorVisual}
          />
        ) : null}
        {showLoading ? (
          <PanelStateBlock
            action={loadingAction}
            description={loadingState ?? "正在加载文件内容..."}
            title="正在准备文件内容"
            tone="accent"
            visual={loadingVisual}
          />
        ) : null}
        {showEmpty ? (
          <PanelStateBlock
            action={emptyAction}
            description={emptyState ?? "请先从文件管理器中选择一个文件。"}
            title="还没有可预览的内容"
            tone="neutral"
            visual={emptyVisual}
          />
        ) : null}
        {!showLoading && !showEmpty && !showError ? (
          <div
            style={{
              background: "linear-gradient(180deg, #f8f9ff 0%, #eef1ff 100%)",
              border: `1px solid ${aiWebComponentTokens.colorBorderStrong}`,
              borderRadius: aiWebComponentTokens.radiusSmall,
              minHeight: 280,
              overflow: "auto",
              padding: 18
            }}
          >
            {isPrimitiveContent ? (
              <pre
                style={{
                  color: aiWebComponentTokens.colorText,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
                  fontSize: 13,
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap"
                }}
              >
                {content}
              </pre>
            ) : (
              content
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
