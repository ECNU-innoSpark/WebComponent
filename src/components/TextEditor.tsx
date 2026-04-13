import type { CSSProperties } from "react";
import { aiWebComponentTokens } from "../styles/tokens";

export type TextEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: number;
};

export function TextEditor({
  value,
  onChange,
  readOnly = false,
  minHeight = 280
}: TextEditorProps) {
  return (
    <textarea
      onChange={(event) => onChange?.(event.target.value)}
      readOnly={readOnly}
      style={{
        ...editorStyle,
        minHeight,
        ...(readOnly ? readOnlyStyle : null)
      }}
      value={value}
    />
  );
}

const editorStyle = {
  background: aiWebComponentTokens.colorSurface,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: aiWebComponentTokens.radiusSmall,
  boxShadow: aiWebComponentTokens.shadowSoft,
  color: aiWebComponentTokens.colorText,
  fontFamily: '"SF Mono", "JetBrains Mono", "Menlo", monospace',
  fontSize: 13,
  lineHeight: 1.7,
  padding: 14,
  resize: "none",
  width: "100%"
} satisfies CSSProperties;

const readOnlyStyle = {
  cursor: "default"
} satisfies CSSProperties;
