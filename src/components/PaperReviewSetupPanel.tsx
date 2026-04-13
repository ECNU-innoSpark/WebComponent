import { useState, type CSSProperties, type ReactNode } from "react";
import { ActionButton } from "./ActionButton";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
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

export type PaperReviewOption = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
};

export type PaperReviewFile = {
  id: string;
  name: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  status?: "uploaded" | "pending" | "warning";
};

export type PaperReviewSetupPanelProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  hideHeader?: boolean;
  summary?: ReactNode;
  departmentOptions: PaperReviewOption[];
  selectedDepartmentId?: string;
  reviewModes: PaperReviewOption[];
  selectedReviewModeId?: string;
  uploadModes?: PaperReviewOption[];
  selectedUploadModeId?: string;
  files: PaperReviewFile[];
  uploadLabel?: ReactNode;
  uploadHint?: ReactNode;
  primaryActionLabel?: ReactNode;
  secondaryActionLabel?: ReactNode;
  defaultExpandedSections?: Array<"criteria" | "mode" | "upload">;
  headerActions?: ReactNode;
  onSelectDepartment?: (option: PaperReviewOption) => void;
  onSelectReviewMode?: (option: PaperReviewOption) => void;
  onSelectUploadMode?: (option: PaperReviewOption) => void;
  onUploadClick?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  renderFileActions?: (file: PaperReviewFile) => ReactNode;
};

export function PaperReviewSetupPanel({
  title = "论文审核",
  subtitle = "左侧配置",
  titleIcon,
  hideHeader = false,
  summary,
  departmentOptions,
  selectedDepartmentId,
  reviewModes,
  selectedReviewModeId,
  uploadModes = [],
  selectedUploadModeId,
  files,
  uploadLabel = "上传文件",
  uploadHint = "正文 / 匿名稿 / 附件",
  primaryActionLabel = "开始审核",
  secondaryActionLabel = "保存草稿",
  defaultExpandedSections = ["criteria", "mode", "upload"],
  headerActions,
  onSelectDepartment,
  onSelectReviewMode,
  onSelectUploadMode,
  onUploadClick,
  onPrimaryAction,
  onSecondaryAction,
  renderFileActions
}: PaperReviewSetupPanelProps) {
  const [localDepartmentId, setLocalDepartmentId] = useState(departmentOptions[0]?.id ?? "");
  const [localReviewModeId, setLocalReviewModeId] = useState(reviewModes[0]?.id ?? "");
  const [localUploadModeId, setLocalUploadModeId] = useState(uploadModes[0]?.id ?? "");
  const [expandedSections, setExpandedSections] = useState({
    criteria: defaultExpandedSections.includes("criteria"),
    mode: defaultExpandedSections.includes("mode"),
    upload: defaultExpandedSections.includes("upload")
  });

  const resolvedDepartmentId = selectedDepartmentId ?? localDepartmentId;
  const resolvedReviewModeId = selectedReviewModeId ?? localReviewModeId;
  const resolvedUploadModeId = selectedUploadModeId ?? localUploadModeId;
  const activeDepartment = departmentOptions.find((item) => item.id === resolvedDepartmentId);
  const activeReviewMode = reviewModes.find((item) => item.id === resolvedReviewModeId);
  const activeUploadMode = uploadModes.find((item) => item.id === resolvedUploadModeId);
  const surfaceStyle = hideHeader
    ? { ...panelSurfaceStyle, background: "transparent", border: "none", borderRadius: 0 }
    : panelSurfaceStyle;
  const bodyStyle = hideHeader ? { ...panelBodyStyle, gap: 10, padding: 0 } : { ...panelBodyStyle, gap: 14 };

  function toggleSection(section: "criteria" | "mode" | "upload") {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section]
    }));
  }

  function handleDepartmentSelect(option: PaperReviewOption) {
    if (!option.disabled && selectedDepartmentId === undefined) {
      setLocalDepartmentId(option.id);
    }

    onSelectDepartment?.(option);
  }

  function handleReviewModeSelect(option: PaperReviewOption) {
    if (!option.disabled && selectedReviewModeId === undefined) {
      setLocalReviewModeId(option.id);
    }

    onSelectReviewMode?.(option);
  }

  function handleUploadModeSelect(option: PaperReviewOption) {
    if (!option.disabled && selectedUploadModeId === undefined) {
      setLocalUploadModeId(option.id);
    }

    onSelectUploadMode?.(option);
  }

  return (
    <section style={surfaceStyle}>
      {!hideHeader ? (
        <header style={panelHeaderStyle}>
          <div style={panelHeaderMainStyle}>
            <div style={panelTitleRowStyle}>
              {titleIcon ? <span style={createIconFrameStyle("accent")}>{titleIcon}</span> : null}
              <div style={panelTitleStyle}>{title}</div>
            </div>
            <div style={panelSubtitleStyle}>{subtitle}</div>
            <div style={stackedMetaStyle}>
              <span style={createToneBadgeStyle("accent")}>{activeDepartment?.label ?? "待选标准"}</span>
              <span style={createToneBadgeStyle("secondary")}>{activeReviewMode?.label ?? "待选模式"}</span>
              {activeUploadMode ? <span style={createToneBadgeStyle("neutral")}>{activeUploadMode.label}</span> : null}
            </div>
          </div>
          {headerActions ? <div>{headerActions}</div> : null}
        </header>
      ) : null}

      <div style={bodyStyle}>
        <div style={overviewCardStyle}>
          <div style={overviewHeaderStyle}>
            <span style={sectionLabelStyle}>当前配置</span>
            {summary ? <span style={sectionMetaStyle}>{summary}</span> : null}
          </div>
          <div style={stackedMetaStyle}>
            <span style={createToneBadgeStyle("accent")}>{activeDepartment?.label ?? "审查标准"}</span>
            <span
              style={createToneBadgeStyle(activeReviewMode?.id === "blind-review" ? "warning" : "secondary")}
            >
              {activeReviewMode?.label ?? "审核模式"}
            </span>
            {activeUploadMode ? <span style={createToneBadgeStyle("neutral")}>{activeUploadMode.label}</span> : null}
            <span style={createToneBadgeStyle("neutral")}>{files.length} 份文件</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <button onClick={() => toggleSection("criteria")} style={accordionTriggerStyle} type="button">
            <div style={accordionTitleBlockStyle}>
              <span style={sectionLabelStyle}>审查标准</span>
              <strong style={accordionValueStyle}>{activeDepartment?.label ?? "未选择"}</strong>
            </div>
            <AccordionChevron expanded={expandedSections.criteria} />
          </button>
          {expandedSections.criteria ? (
            <div style={choiceWrapStyle}>
              {departmentOptions.map((option) => {
                const active = option.id === resolvedDepartmentId;

                return (
                  <button
                    aria-pressed={active}
                    disabled={option.disabled}
                    key={option.id}
                    onClick={() => handleDepartmentSelect(option)}
                    style={{
                      ...choiceButtonStyle,
                      ...(active ? choiceButtonActiveStyle : null),
                      ...(option.disabled ? choiceButtonDisabledStyle : null)
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div style={sectionStyle}>
          <button onClick={() => toggleSection("mode")} style={accordionTriggerStyle} type="button">
            <div style={accordionTitleBlockStyle}>
              <span style={sectionLabelStyle}>审核模式</span>
              <strong style={accordionValueStyle}>{activeReviewMode?.label ?? "未选择"}</strong>
            </div>
            <AccordionChevron expanded={expandedSections.mode} />
          </button>
          {expandedSections.mode ? (
            <div style={choiceWrapStyle}>
              {reviewModes.map((option) => {
                const active = option.id === resolvedReviewModeId;

                return (
                  <button
                    aria-pressed={active}
                    disabled={option.disabled}
                    key={option.id}
                    onClick={() => handleReviewModeSelect(option)}
                    style={{
                      ...choiceButtonStyle,
                      ...(active ? choiceButtonActiveStyle : null),
                      ...(option.id === "blind-review" && !active ? choiceButtonWarningStyle : null),
                      ...(option.disabled ? choiceButtonDisabledStyle : null)
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div style={sectionStyle}>
          <button onClick={() => toggleSection("upload")} style={accordionTriggerStyle} type="button">
            <div style={accordionTitleBlockStyle}>
              <span style={sectionLabelStyle}>文件上传</span>
              <strong style={accordionValueStyle}>{activeUploadMode?.label ?? `${files.length} 份文件`}</strong>
            </div>
            <AccordionChevron expanded={expandedSections.upload} />
          </button>
          {expandedSections.upload ? (
            <>
              {uploadModes.length > 0 ? (
                <div style={choiceWrapStyle}>
                  {uploadModes.map((option) => {
                    const active = option.id === resolvedUploadModeId;

                    return (
                      <button
                        aria-pressed={active}
                        disabled={option.disabled}
                        key={option.id}
                        onClick={() => handleUploadModeSelect(option)}
                        style={{
                          ...choiceButtonStyle,
                          ...(active ? choiceButtonActiveStyle : null),
                          ...(option.disabled ? choiceButtonDisabledStyle : null)
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div
                style={{
                  ...createPanelSectionStyle("secondary"),
                  ...uploadCardStyle
                }}
              >
                <div style={uploadHeaderRowStyle}>
                  <strong style={uploadHeadingStyle}>{uploadLabel}</strong>
                  <span style={sectionMetaStyle}>{uploadHint}</span>
                </div>
                <ActionButton onClick={onUploadClick} variant="primary">
                  {activeUploadMode ? `选择${activeUploadMode.label}` : uploadLabel}
                </ActionButton>
              </div>

              {files.length === 0 ? (
                <PanelStateBlock
                  description="暂无文件"
                  title="等待上传"
                  tone="neutral"
                />
              ) : (
                <div style={fileListStyle}>
                  {files.map((file) => {
                    const fileActions = renderFileActions?.(file);
                    const tone =
                      file.status === "warning"
                        ? "warning"
                        : file.status === "pending"
                          ? "neutral"
                          : "success";

                    return (
                      <article
                        key={file.id}
                        style={{
                          ...createPanelSectionStyle(tone),
                          ...fileCardStyle
                        }}
                      >
                        <div style={optionTopRowStyle}>
                          <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                            <strong style={optionTitleStyle}>{file.name}</strong>
                            {file.description ? <div style={optionDescriptionStyle}>{file.description}</div> : null}
                          </div>
                          <span style={createToneBadgeStyle(tone)}>{file.badge ?? resolveFileBadge(file.status)}</span>
                        </div>
                        <div style={fileMetaRowStyle}>
                          <span style={optionMetaStyle}>{file.meta ?? "等待补充文件信息"}</span>
                          {fileActions ? <div>{fileActions}</div> : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          ) : null}
        </div>

        <div style={footerActionsStyle}>
          <ActionButton onClick={onSecondaryAction}>{secondaryActionLabel}</ActionButton>
          <ActionButton onClick={onPrimaryAction} variant="primary">
            {primaryActionLabel}
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

function AccordionChevron({ expanded }: { expanded: boolean }) {
  return (
    <span style={accordionChevronFrameStyle}>
      <svg
        aria-hidden="true"
        height="12"
        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms ease" }}
        viewBox="0 0 16 16"
        width="12"
      >
        <path
          d="M4 6.25 8 10l4-3.75"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    </span>
  );
}

function resolveFileBadge(status: PaperReviewFile["status"]) {
  if (status === "warning") {
    return "待处理";
  }

  if (status === "pending") {
    return "待校验";
  }

  return "已就绪";
}

const overviewCardStyle = {
  background: `linear-gradient(180deg, ${aiWebComponentTokens.colorSurfaceRaised} 0%, ${aiWebComponentTokens.colorSurface} 100%)`,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusSmall,
  display: "grid",
  gap: 10,
  padding: "12px 14px"
} satisfies CSSProperties;

const overviewHeaderStyle = {
  alignItems: "center",
  display: "flex",
  gap: 8,
  justifyContent: "space-between"
} satisfies CSSProperties;

const sectionStyle = {
  display: "grid",
  gap: 8
} satisfies CSSProperties;

const sectionMetaStyle = {
  color: aiWebComponentTokens.colorMuted,
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1.4
} satisfies CSSProperties;

const choiceWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8
} satisfies CSSProperties;

const choiceButtonStyle = {
  alignItems: "center",
  background: aiWebComponentTokens.colorSurface,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusPill,
  color: aiWebComponentTokens.colorText,
  cursor: "pointer",
  display: "inline-flex",
  fontSize: 12,
  fontWeight: 700,
  justifyContent: "center",
  minHeight: 34,
  padding: "0 14px",
  whiteSpace: "nowrap"
} satisfies CSSProperties;

const choiceButtonActiveStyle = {
  background: `linear-gradient(180deg, ${aiWebComponentTokens.colorAccentSoft} 0%, ${aiWebComponentTokens.colorSurface} 100%)`,
  borderColor: aiWebComponentTokens.colorAccentBorder,
  boxShadow: aiWebComponentTokens.shadowSoft,
  color: aiWebComponentTokens.colorAccentStrong
} satisfies CSSProperties;

const choiceButtonWarningStyle = {
  background: aiWebComponentTokens.colorWarningSoft,
  borderColor: aiWebComponentTokens.colorWarningBorder,
  color: aiWebComponentTokens.colorWarningStrong
} satisfies CSSProperties;

const choiceButtonDisabledStyle = {
  cursor: "default",
  opacity: 0.56
} satisfies CSSProperties;

const accordionTriggerStyle = {
  alignItems: "center",
  background: `linear-gradient(180deg, ${aiWebComponentTokens.colorSurfaceRaised} 0%, ${aiWebComponentTokens.colorSurface} 100%)`,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusSmall,
  cursor: "pointer",
  display: "flex",
  gap: 10,
  justifyContent: "space-between",
  padding: "11px 13px",
  textAlign: "left",
  width: "100%"
} satisfies CSSProperties;

const accordionTitleBlockStyle = {
  display: "grid",
  gap: 4,
  minWidth: 0
} satisfies CSSProperties;

const accordionValueStyle = {
  color: aiWebComponentTokens.colorText,
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.35
} satisfies CSSProperties;

const accordionChevronFrameStyle = {
  alignItems: "center",
  color: aiWebComponentTokens.colorMuted,
  display: "inline-flex",
  flexShrink: 0,
  justifyContent: "center"
} satisfies CSSProperties;

const optionTopRowStyle = {
  alignItems: "start",
  display: "flex",
  gap: 8,
  justifyContent: "space-between"
} satisfies CSSProperties;

const optionTitleStyle = {
  color: aiWebComponentTokens.colorText,
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.4
} satisfies CSSProperties;

const optionDescriptionStyle = {
  color: aiWebComponentTokens.colorTextSubtle,
  fontSize: 12,
  lineHeight: 1.55
} satisfies CSSProperties;

const optionMetaStyle = {
  color: aiWebComponentTokens.colorMuted,
  fontSize: 11,
  lineHeight: 1.5
} satisfies CSSProperties;

const uploadCardStyle = {
  borderStyle: "dashed",
  display: "grid",
  gap: 8,
  padding: "14px 16px"
} satisfies CSSProperties;

const uploadHeaderRowStyle = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  justifyContent: "space-between"
} satisfies CSSProperties;

const uploadHeadingStyle = {
  color: aiWebComponentTokens.colorText,
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.5
} satisfies CSSProperties;

const fileListStyle = {
  display: "grid",
  gap: 10
} satisfies CSSProperties;


const fileCardStyle = {
  display: "grid",
  gap: 8,
  padding: "12px 13px"
} satisfies CSSProperties;

const fileMetaRowStyle = {
  alignItems: "center",
  display: "flex",
  gap: 8,
  justifyContent: "space-between"
} satisfies CSSProperties;

const footerActionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  justifyContent: "flex-end"
} satisfies CSSProperties;
