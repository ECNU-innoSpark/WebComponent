import type { CSSProperties, ReactNode } from "react";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
  createPanelCalloutStyle,
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

export type WorkflowTemplateItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  category?: ReactNode;
  badge?: ReactNode;
  highlights?: ReactNode[];
  disabled?: boolean;
};

export type WorkflowTemplatePanelProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  hideHeader?: boolean;
  items: WorkflowTemplateItem[];
  selectedItemId?: string;
  hint?: ReactNode;
  headerActions?: ReactNode;
  emptyState?: ReactNode;
  onSelect?: (item: WorkflowTemplateItem) => void;
};

export function WorkflowTemplatePanel({
  title = "功能模板",
  subtitle = "预设场景",
  titleIcon,
  hideHeader = false,
  items,
  selectedItemId,
  hint,
  headerActions,
  emptyState,
  onSelect
}: WorkflowTemplatePanelProps) {
  const activeItem = items.find((item) => item.id === selectedItemId) ?? items[0];
  const surfaceStyle = hideHeader
    ? { ...panelSurfaceStyle, background: "transparent", border: "none", borderRadius: 0 }
    : panelSurfaceStyle;
  const bodyStyle = hideHeader ? { ...panelBodyStyle, gap: 10, padding: 0 } : { ...panelBodyStyle, gap: 12 };

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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={createToneBadgeStyle("accent")}>{items.length} 个模板</span>
              {activeItem?.category ? <span style={createToneBadgeStyle("neutral")}>{activeItem.category}</span> : null}
            </div>
          </div>
          {headerActions ? <div>{headerActions}</div> : null}
        </header>
      ) : null}

      <div style={bodyStyle}>
        {activeItem ? (
          <div style={createPanelCalloutStyle("accent")}>
            <div style={{ ...sectionLabelStyle, marginBottom: 8 }}>当前模板</div>
            <div style={activeTitleStyle}>{activeItem.title}</div>
            {activeItem.description ? <div style={activeDescriptionStyle}>{activeItem.description}</div> : null}
            <div style={activeMetaRowStyle}>
              {activeItem.category ? <span style={createToneBadgeStyle("neutral")}>{activeItem.category}</span> : null}
              {activeItem.badge ? <span style={createToneBadgeStyle("accent")}>{activeItem.badge}</span> : null}
              {hint ? <span style={hintStyle}>{hint}</span> : null}
            </div>
          </div>
        ) : null}

        {items.length === 0 ? (
          <PanelStateBlock
            description={emptyState ?? "暂无可用模板。"}
            title="还没有模板"
            tone="neutral"
          />
        ) : (
          <div style={gridStyle}>
            {items.map((item) => {
              const active = item.id === selectedItemId;
              const interactive = Boolean(onSelect) && !item.disabled;

              return (
                <button
                  aria-pressed={active}
                  disabled={!interactive}
                  key={item.id}
                  onClick={() => onSelect?.(item)}
                  style={{
                    ...cardButtonStyle,
                    ...createSelectableCardStyle(active),
                    borderColor: active
                      ? aiWebComponentTokens.colorAccentBorder
                      : aiWebComponentTokens.colorBorder,
                    boxShadow: active ? aiWebComponentTokens.shadowSoft : "none",
                    cursor: interactive ? "pointer" : "default",
                    opacity: item.disabled ? 0.56 : 1
                  }}
                  type="button"
                >
                  <div style={cardTopStyle}>
                    <span style={sectionLabelStyle}>{item.category ?? "Template"}</span>
                    {item.badge ? (
                      <span style={createToneBadgeStyle(active ? "accent" : "neutral")}>{item.badge}</span>
                    ) : null}
                  </div>
                  <strong style={cardTitleStyle}>{item.title}</strong>
                  {item.description ? <div style={cardDescriptionStyle}>{item.description}</div> : null}
                  {item.highlights?.length ? (
                    <div style={tagWrapStyle}>
                      {item.highlights.map((tag, index) => (
                        <span key={`${item.id}-${index}`} style={tagStyle}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const activeTitleStyle = {
  color: aiWebComponentTokens.colorText,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.4,
  marginBottom: 6
} satisfies CSSProperties;

const activeDescriptionStyle = {
  color: aiWebComponentTokens.colorTextSubtle,
  fontSize: 12,
  lineHeight: 1.6
} satisfies CSSProperties;

const activeMetaRowStyle = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 10
} satisfies CSSProperties;

const hintStyle = {
  color: aiWebComponentTokens.colorMuted,
  fontSize: 11,
  fontWeight: 600
} satisfies CSSProperties;

const gridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
} satisfies CSSProperties;

const cardButtonStyle = {
  background: aiWebComponentTokens.colorSurface,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusSmall,
  display: "grid",
  gap: 8,
  minHeight: 152,
  padding: "13px 14px",
  textAlign: "left",
  width: "100%"
} satisfies CSSProperties;

const cardTopStyle = {
  alignItems: "center",
  display: "flex",
  gap: 8,
  justifyContent: "space-between"
} satisfies CSSProperties;

const cardTitleStyle = {
  color: aiWebComponentTokens.colorText,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.35
} satisfies CSSProperties;

const cardDescriptionStyle = {
  color: aiWebComponentTokens.colorTextSubtle,
  fontSize: 12,
  lineHeight: 1.55
} satisfies CSSProperties;

const tagWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  marginTop: "auto"
} satisfies CSSProperties;

const tagStyle = {
  background: aiWebComponentTokens.colorSurfaceMuted,
  border: `1px solid ${aiWebComponentTokens.colorBorderSubtle}`,
  borderRadius: aiWebComponentTokens.radiusPill,
  color: aiWebComponentTokens.colorMuted,
  display: "inline-flex",
  fontSize: 11,
  fontWeight: 600,
  padding: "5px 9px"
} satisfies CSSProperties;
