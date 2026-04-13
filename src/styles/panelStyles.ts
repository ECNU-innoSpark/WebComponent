import type { CSSProperties } from "react";
import { aiWebComponentTokens } from "./tokens";

export type PanelTone = "neutral" | "accent" | "secondary" | "success" | "warning" | "danger";

type TonePalette = {
  background: string;
  border: string;
  text: string;
};

const tonePalettes: Record<PanelTone, TonePalette> = {
  neutral: {
    background: aiWebComponentTokens.colorSurfaceMuted,
    border: aiWebComponentTokens.colorBorderSubtle,
    text: aiWebComponentTokens.colorTextSubtle
  },
  accent: {
    background: aiWebComponentTokens.colorAccentSoft,
    border: aiWebComponentTokens.colorAccentBorder,
    text: aiWebComponentTokens.colorAccentStrong
  },
  secondary: {
    background: aiWebComponentTokens.colorSecondaryAccentSoft,
    border: aiWebComponentTokens.colorSecondaryAccentBorder,
    text: aiWebComponentTokens.colorSecondaryAccentStrong
  },
  success: {
    background: aiWebComponentTokens.colorSuccessSoft,
    border: aiWebComponentTokens.colorSuccessBorder,
    text: aiWebComponentTokens.colorSuccess
  },
  warning: {
    background: aiWebComponentTokens.colorWarningSoft,
    border: aiWebComponentTokens.colorWarningBorder,
    text: aiWebComponentTokens.colorWarningStrong
  },
  danger: {
    background: aiWebComponentTokens.colorDangerSoft,
    border: aiWebComponentTokens.colorDangerBorder,
    text: aiWebComponentTokens.colorDanger
  }
};

export const panelSurfaceStyle = {
  background: `linear-gradient(180deg, ${aiWebComponentTokens.colorSurface} 0%, ${aiWebComponentTokens.colorSurfaceRaised} 100%)`,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radius,
  boxShadow: aiWebComponentTokens.shadowSoft,
  overflow: "hidden"
} satisfies CSSProperties;

export const panelHeaderStyle = {
  alignItems: "start",
  background: `linear-gradient(180deg, rgba(85, 90, 255, 0.08) 0%, rgba(255, 255, 255, 0.96) 68%)`,
  borderBottom: `1px solid ${aiWebComponentTokens.colorBorder}`,
  display: "flex",
  gap: 16,
  justifyContent: "space-between",
  padding: "16px 18px 15px"
} satisfies CSSProperties;

export const panelHeaderMainStyle = {
  display: "grid",
  gap: 6
} satisfies CSSProperties;

export const panelTitleRowStyle = {
  alignItems: "center",
  display: "flex",
  gap: 12
} satisfies CSSProperties;

export const panelTitleStyle = {
  color: aiWebComponentTokens.colorText,
  fontSize: 17,
  fontWeight: 700,
  letterSpacing: "-0.015em",
  lineHeight: 1.3
} satisfies CSSProperties;

export const panelSubtitleStyle = {
  color: aiWebComponentTokens.colorTextSubtle,
  fontSize: 13,
  lineHeight: 1.6,
  maxWidth: 620
} satisfies CSSProperties;

export const panelBodyStyle = {
  display: "grid",
  gap: 16,
  padding: 18
} satisfies CSSProperties;

export const sectionLabelStyle = {
  color: aiWebComponentTokens.colorMuted,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase"
} satisfies CSSProperties;

export const stackedMetaStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8
} satisfies CSSProperties;

export function createToneBadgeStyle(tone: PanelTone = "accent"): CSSProperties {
  const palette = tonePalettes[tone];

  return {
    alignItems: "center",
    background: palette.background,
    border: `1px solid ${palette.border}`,
    borderRadius: aiWebComponentTokens.radiusPill,
    color: palette.text,
    display: "inline-flex",
    fontSize: 11,
    fontWeight: 700,
    gap: 6,
    padding: "4px 9px",
    whiteSpace: "nowrap"
  };
}

export function createStateCardStyle(tone: PanelTone = "neutral"): CSSProperties {
  const palette = tonePalettes[tone];

  return {
    background: `linear-gradient(180deg, ${palette.background} 0%, ${aiWebComponentTokens.colorSurface} 100%)`,
    border: `1px solid ${palette.border}`,
    borderRadius: aiWebComponentTokens.radiusSmall,
    color: palette.text,
    display: "grid",
    gap: 10,
    padding: "16px",
    boxShadow: aiWebComponentTokens.shadowSoft
  };
}

export function createPanelSectionStyle(tone: PanelTone = "neutral"): CSSProperties {
  const palette = tonePalettes[tone];

  return {
    background:
      tone === "neutral"
        ? aiWebComponentTokens.colorSurface
        : `linear-gradient(180deg, ${palette.background} 0%, ${aiWebComponentTokens.colorSurface} 100%)`,
    border: `1px solid ${palette.border}`,
    borderRadius: aiWebComponentTokens.radiusSmall,
    boxShadow: aiWebComponentTokens.shadowSoft
  };
}

export function createPanelCalloutStyle(tone: PanelTone = "accent"): CSSProperties {
  const palette = tonePalettes[tone];

  return {
    background: `linear-gradient(180deg, ${palette.background} 0%, ${aiWebComponentTokens.colorSurface} 100%)`,
    border: `1px solid ${palette.border}`,
    borderLeft: `3px solid ${palette.text}`,
    borderRadius: aiWebComponentTokens.radiusSmall,
    boxShadow: aiWebComponentTokens.shadowSoft,
    color: aiWebComponentTokens.colorTextSubtle,
    padding: "14px 16px"
  };
}

export function createIconFrameStyle(tone: PanelTone = "accent"): CSSProperties {
  const palette = tonePalettes[tone];

  return {
    alignItems: "center",
    background: palette.background,
    border: `1px solid ${palette.border}`,
    borderRadius: aiWebComponentTokens.radiusSmall,
    color: palette.text,
    display: "inline-flex",
    flexShrink: 0,
    height: 30,
    justifyContent: "center",
    width: 30
  };
}

export function createGhostButtonStyle(interactive: boolean): CSSProperties {
  return {
    background: aiWebComponentTokens.colorSurfaceRaised,
    border: `1px solid ${aiWebComponentTokens.colorBorder}`,
    borderRadius: aiWebComponentTokens.radiusPill,
    color: aiWebComponentTokens.colorText,
    cursor: interactive ? "pointer" : "default",
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 11px"
  };
}

export function createSelectableCardStyle(active: boolean): CSSProperties {
  return {
    background: active ? aiWebComponentTokens.colorSurfaceAccent : aiWebComponentTokens.colorSurface,
    border: `1px solid ${
      active ? aiWebComponentTokens.colorAccentBorder : aiWebComponentTokens.colorBorder
    }`,
    borderRadius: aiWebComponentTokens.radiusSmall,
    boxShadow: active ? aiWebComponentTokens.shadowSoft : "none"
  };
}
