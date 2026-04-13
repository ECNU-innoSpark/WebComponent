import type { ReactNode } from "react";
import {
  createStateCardStyle,
  sectionLabelStyle,
  type PanelTone
} from "../../styles/panelStyles";
import { aiWebComponentTokens } from "../../styles/tokens";

export type PanelStateBlockProps = {
  tone?: PanelTone;
  visual?: ReactNode;
  title?: ReactNode;
  description: ReactNode;
  action?: ReactNode;
};

export function PanelStateBlock({
  tone = "neutral",
  visual,
  title,
  description,
  action
}: PanelStateBlockProps) {
  return (
    <div style={createStateCardStyle(tone)}>
      <div style={{ ...sectionLabelStyle, color: aiWebComponentTokens.colorMuted }}>State</div>
      {visual ? <div style={{ display: "grid", justifyItems: "start" }}>{visual}</div> : null}
      {title ? (
        <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
          {title}
        </div>
      ) : null}
      <div style={{ color: aiWebComponentTokens.colorTextSubtle, lineHeight: 1.65 }}>{description}</div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
