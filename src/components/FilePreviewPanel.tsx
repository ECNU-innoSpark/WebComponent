import type { ReactNode } from "react";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
  createPanelCalloutStyle,
  createPanelSectionStyle,
  createIconFrameStyle,
  createToneBadgeStyle,
  panelBodyStyle,
  panelHeaderMainStyle,
  panelHeaderStyle,
  panelSubtitleStyle,
  panelSurfaceStyle,
  panelTitleRowStyle,
  panelTitleStyle,
  sectionLabelStyle,
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
  const surfaceStyle = hideHeader
    ? { ...panelSurfaceStyle, background: "transparent", border: "none", borderRadius: 0 }
    : panelSurfaceStyle;
  const bodyStyle = hideHeader
    ? { ...panelBodyStyle, minHeight: 320, padding: 0 }
    : { ...panelBodyStyle, minHeight: 320 };

  return (
    <section style={surfaceStyle}>
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

      <div style={bodyStyle}>
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
          <div style={{ display: "grid", gap: 12 }}>
            <div style={createPanelCalloutStyle("accent")}>
              <div style={{ ...sectionLabelStyle, marginBottom: 8 }}>Source Context</div>
              <div style={{ color: aiWebComponentTokens.colorText, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                {fileName ?? "当前尚未绑定来源文件"}
              </div>
              <div style={{ color: aiWebComponentTokens.colorTextSubtle, fontSize: 13, lineHeight: 1.6 }}>
                当前面板适合承接文档摘录、JSON 配置、课堂素材片段与结构化输出，保持“来源文件 + 内容预览”同屏可读。
              </div>
            </div>

            <div
              style={{
                ...createPanelSectionStyle("neutral"),
                display: "grid",
                gap: 0,
                minHeight: 280,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: aiWebComponentTokens.colorSurfaceMuted,
                  borderBottom: `1px solid ${aiWebComponentTokens.colorBorder}`,
                  display: "flex",
                  gap: 10,
                  justifyContent: "space-between",
                  padding: "10px 12px"
                }}
              >
                <div style={{ display: "grid", gap: 3 }}>
                  <span style={sectionLabelStyle}>Preview Surface</span>
                  <span style={{ color: aiWebComponentTokens.colorTextSubtle, fontSize: 12 }}>
                    适合放代码、文档内容、AI 中间产物与结构化摘录
                  </span>
                </div>
                <div style={stackedMetaStyle}>
                  <span style={createToneBadgeStyle(fileName ? "accent" : "neutral")}>
                    {fileName ?? "未选择文件"}
                  </span>
                  <span style={createToneBadgeStyle("secondary")}>{language}</span>
                </div>
              </div>

              <div
                style={{
                  background: aiWebComponentTokens.colorSurfaceRaised,
                  minHeight: 0,
                  overflow: "auto",
                  padding: 14
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
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
