import type { CSSProperties, ReactNode } from "react";
import { PanelStateBlock } from "./shared/PanelStateBlock";
import {
  createIconFrameStyle,
  createStateCardStyle,
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

export type ChatMessageRole = "system" | "user" | "assistant" | "tool";
export type ChatPanelStatus = "idle" | "loading" | "streaming" | "error";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  status?: "idle" | "streaming" | "error";
};

export type ChatPanelProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  hideHeader?: boolean;
  messages: ChatMessage[];
  status?: ChatPanelStatus;
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
  footer?: ReactNode;
  statusBanner?: ReactNode;
  renderMessageContent?: (message: ChatMessage) => ReactNode;
  renderMessageMeta?: (message: ChatMessage) => ReactNode;
  renderMessageActions?: (message: ChatMessage) => ReactNode;
  getMessageStyle?: (message: ChatMessage) => CSSProperties | undefined;
};

const roleTones: Record<ChatMessageRole, "neutral" | "success" | "accent" | "secondary"> = {
  system: "neutral",
  user: "success",
  assistant: "accent",
  tool: "secondary"
};

const roleLabels: Record<ChatMessageRole, string> = {
  system: "System",
  user: "User",
  assistant: "Assistant",
  tool: "Tool"
};

export function ChatPanel({
  title = "对话",
  subtitle,
  titleIcon,
  hideHeader = false,
  messages,
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
  footer,
  statusBanner,
  renderMessageContent,
  renderMessageMeta,
  renderMessageActions,
  getMessageStyle
}: ChatPanelProps) {
  const showError = status === "error";
  const showEmpty = messages.length === 0 && status === "idle";
  const showLoading = messages.length === 0 && status === "loading";

  return (
    <section
      style={{
        ...panelSurfaceStyle,
        display: "flex",
        flexDirection: "column",
        minHeight: 320,
        overflow: "hidden"
      }}
    >
      {!hideHeader ? (
        <header style={panelHeaderStyle}>
          <div style={panelHeaderMainStyle}>
            <div style={panelTitleRowStyle}>
              {titleIcon ? <span style={createIconFrameStyle("accent")}>{titleIcon}</span> : null}
              <div style={panelTitleStyle}>{title}</div>
            </div>
            {subtitle ? <div style={panelSubtitleStyle}>{subtitle}</div> : null}
            {status === "streaming" ? (
              <span style={createToneBadgeStyle("accent")}>流式响应中</span>
            ) : null}
          </div>
          {headerActions ? <div>{headerActions}</div> : null}
        </header>
      ) : null}

      <div style={{ ...panelBodyStyle, flex: 1 }}>
        {statusBanner ? (
          <div
            style={{
              ...createStateCardStyle("neutral"),
              background: `linear-gradient(180deg, ${aiWebComponentTokens.colorSurfaceMuted} 0%, ${aiWebComponentTokens.colorAccentSoft} 100%)`
            }}
          >
            {statusBanner}
          </div>
        ) : null}

        {showError ? (
          <PanelStateBlock
            action={errorAction}
            description={errorState ?? "对话加载失败，请稍后重试。"}
            title="暂时无法读取会话"
            tone="danger"
            visual={errorVisual}
          />
        ) : null}

        {showLoading ? (
          <PanelStateBlock
            action={loadingAction}
            description={loadingState ?? "正在加载会话内容..."}
            title="正在准备消息上下文"
            tone="accent"
            visual={loadingVisual}
          />
        ) : null}

        {showEmpty ? (
          <PanelStateBlock
            action={emptyAction}
            description={emptyState ?? "当前还没有消息。"}
            title="先开始一轮对话"
            tone="neutral"
            visual={emptyVisual}
          />
        ) : null}

        {messages.map((message) => {
          const messageActions = renderMessageActions?.(message);
          const messageTone = roleTones[message.role];
          const messageBorderTone =
            message.status === "error"
              ? aiWebComponentTokens.colorDanger
              : message.status === "streaming"
                ? aiWebComponentTokens.colorAccent
                : aiWebComponentTokens.colorBorder;

          return (
            <article
              key={message.id}
              style={{
                background:
                  message.role === "assistant"
                    ? `linear-gradient(180deg, ${aiWebComponentTokens.colorAccentSoft} 0%, #f8f8ff 100%)`
                    : message.role === "tool"
                      ? aiWebComponentTokens.colorSecondaryAccentSoft
                      : aiWebComponentTokens.colorSurfaceMuted,
                border: `1px solid ${messageBorderTone}`,
                borderRadius: aiWebComponentTokens.radiusSmall,
                padding: "14px 16px",
                ...(getMessageStyle?.(message) ?? {})
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: 12,
                  justifyContent: "space-between"
                }}
              >
                <div
                  style={{
                    ...createToneBadgeStyle(messageTone),
                    letterSpacing: "0.04em"
                  }}
                >
                  {message.title ?? roleLabels[message.role]}
                </div>
                {messageActions ? <div>{messageActions}</div> : null}
              </div>
              {message.description ? (
                <div
                  style={{
                    color: aiWebComponentTokens.colorTextSubtle,
                    fontSize: 13,
                    marginBottom: 8
                  }}
                >
                  {message.description}
                </div>
              ) : null}
              <div
                style={{
                  color: aiWebComponentTokens.colorText,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap"
                }}
              >
                {renderMessageContent ? renderMessageContent(message) : message.content}
              </div>
              {(message.meta || renderMessageMeta) ? (
                <div
                  style={{
                    color: aiWebComponentTokens.colorMuted,
                    fontSize: 12,
                    marginTop: 10
                  }}
                >
                  {renderMessageMeta ? renderMessageMeta(message) : message.meta}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {footer ? (
        <div
          style={{
            borderTop: `1px solid ${aiWebComponentTokens.colorBorder}`,
            padding: 20
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}
