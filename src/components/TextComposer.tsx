import type { CSSProperties, FormEvent, ReactNode } from "react";
import { ActionButton } from "./ActionButton";
import { aiWebComponentTokens } from "../styles/tokens";

export type TextComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  submitLabel?: string;
  footerHint?: ReactNode;
};

export function TextComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  submitLabel = "发送",
  footerHint
}: TextComposerProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} style={shellStyle}>
      <textarea
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          ...textareaStyle,
          ...(disabled ? disabledStyle : null)
        }}
        value={value}
      />
      <div style={actionsStyle}>
        {footerHint ? <div style={hintStyle}>{footerHint}</div> : <div />}
        <ActionButton disabled={disabled} type="submit" variant="primary">
          {submitLabel}
        </ActionButton>
      </div>
    </form>
  );
}

const shellStyle = {
  background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 18%)",
  borderTop: `1px solid ${aiWebComponentTokens.colorBorder}`,
  display: "grid",
  gap: 10,
  padding: "14px 16px 16px"
} satisfies CSSProperties;

const textareaStyle = {
  background: aiWebComponentTokens.colorSurfaceRaised,
  border: `1px solid ${aiWebComponentTokens.colorBorder}`,
  borderRadius: 18,
  color: aiWebComponentTokens.colorText,
  minHeight: 108,
  padding: "14px 16px",
  resize: "vertical",
  width: "100%"
} satisfies CSSProperties;

const actionsStyle = {
  alignItems: "center",
  display: "flex",
  gap: 12,
  justifyContent: "space-between"
} satisfies CSSProperties;

const hintStyle = {
  color: aiWebComponentTokens.colorMuted,
  fontSize: 12,
  lineHeight: 1.5
} satisfies CSSProperties;

const disabledStyle = {
  cursor: "not-allowed",
  opacity: 0.7
} satisfies CSSProperties;
