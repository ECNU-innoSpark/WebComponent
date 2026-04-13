import type { CSSProperties, ReactNode } from "react";
import { aiWebComponentTokens } from "../styles/tokens";

export type TaskPresetBarItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type TaskPresetBarProps = {
  items: TaskPresetBarItem[];
  value?: string;
  onChange?: (value: string) => void;
  label?: ReactNode;
  hint?: ReactNode;
  ariaLabel?: string;
};

export function TaskPresetBar({
  items,
  value,
  onChange,
  label = "功能选择",
  hint,
  ariaLabel = "功能预设"
}: TaskPresetBarProps) {
  const activeItem = items.find((item) => item.id === value);
  const resolvedHint = hint ?? activeItem?.description;

  if (items.length === 0) {
    return null;
  }

  return (
    <section style={rootStyle}>
      {(label || resolvedHint) ? (
        <div style={headerStyle}>
          {label ? <div style={labelStyle}>{label}</div> : <span />}
          {resolvedHint ? <div style={hintStyle}>{resolvedHint}</div> : null}
        </div>
      ) : null}
      <div aria-label={ariaLabel} role="toolbar" style={trackStyle}>
        {items.map((item) => {
          const active = item.id === value;
          const disabled = item.disabled || !onChange;

          return (
            <button
              aria-pressed={active}
              disabled={disabled}
              key={item.id}
              onClick={() => onChange?.(item.id)}
              style={{
                ...chipStyle,
                ...(active ? activeChipStyle : null),
                ...(disabled ? disabledChipStyle : null)
              }}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

const rootStyle = {
  display: "grid",
  gap: 8,
  width: "100%"
} satisfies CSSProperties;

const headerStyle = {
  alignItems: "baseline",
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  justifyContent: "space-between",
  minWidth: 0
} satisfies CSSProperties;

const labelStyle = {
  color: aiWebComponentTokens.colorAccentStrong,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase"
} satisfies CSSProperties;

const hintStyle = {
  color: aiWebComponentTokens.colorMuted,
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1.4,
  minWidth: 0
} satisfies CSSProperties;

const trackStyle = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 2,
  scrollbarWidth: "thin"
} satisfies CSSProperties;

const chipStyle = {
  background: aiWebComponentTokens.colorSurface,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusPill,
  boxShadow: aiWebComponentTokens.shadowSoft,
  color: aiWebComponentTokens.colorTextSubtle,
  cursor: "pointer",
  flexShrink: 0,
  fontSize: 12,
  fontWeight: 700,
  minHeight: 34,
  padding: "0 14px",
  transition: "background-color 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease",
  whiteSpace: "nowrap"
} satisfies CSSProperties;

const activeChipStyle = {
  background: `linear-gradient(180deg, ${aiWebComponentTokens.colorAccentSoft} 0%, ${aiWebComponentTokens.colorSurface} 100%)`,
  border: `1px solid ${aiWebComponentTokens.colorAccentBorder}`,
  color: aiWebComponentTokens.colorAccentStrong
} satisfies CSSProperties;

const disabledChipStyle = {
  cursor: "not-allowed",
  opacity: 0.5
} satisfies CSSProperties;
