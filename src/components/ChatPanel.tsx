import type { CSSProperties, ReactNode } from "react";
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

const chatContentMaxWidth = 860;
const chatBrandColor = "#555AFF";
const chatBrandSoft = "rgba(85, 90, 255, 0.08)";
const chatBrandBorder = "rgba(85, 90, 255, 0.16)";

const roleLabelColors: Record<ChatMessageRole, string> = {
  system: aiWebComponentTokens.colorMuted,
  user: "rgba(255, 255, 255, 0.72)",
  assistant: chatBrandColor,
  tool: aiWebComponentTokens.colorSecondaryAccent
};

const roleColumnWidths: Record<ChatMessageRole, string> = {
  system: "100%",
  user: "min(100%, 76%)",
  assistant: "min(100%, 92%)",
  tool: "min(100%, 92%)"
};

const toolAvatarIcon = (
  <svg
    aria-hidden="true"
    fill="none"
    height="14"
    viewBox="0 0 16 16"
    width="14"
  >
    <path
      d="M9.2 2.3a3.2 3.2 0 0 1 4 4l-2 2a1.6 1.6 0 0 1-2.3 0l-.8-.8-4.1 4.1a1 1 0 1 1-1.4-1.4l4.1-4.1-.8-.8a1.6 1.6 0 0 1 0-2.3l2-2Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
    />
  </svg>
);

const roleAvatarContent: Record<ChatMessageRole, ReactNode> = {
  system: "SYS",
  user: "我",
  assistant: "AI",
  tool: toolAvatarIcon
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
  const contentPadding = hideHeader ? (footer ? "10px 0 120px" : "10px 0 18px") : footer ? "20px 20px 120px" : "20px";
  const surfaceStyle = hideHeader
    ? { ...panelSurfaceStyle, background: "transparent", border: "none", borderRadius: 0 }
    : panelSurfaceStyle;
  const bodyStyle = {
    ...panelBodyStyle,
    flex: 1,
    gap: 14,
    minHeight: 0,
    minWidth: 0,
    overflowX: "hidden",
    overflowY: "auto",
    padding: 0
  } satisfies CSSProperties;

  return (
    <section
      style={{
        ...surfaceStyle,
        display: "flex",
        flexDirection: "column",
        minHeight: 320,
        minWidth: 0,
        overflow: "hidden",
        position: "relative"
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

      <div style={bodyStyle}>
        <div
          style={{
            display: "grid",
            gap: 16,
            margin: "0 auto",
            maxWidth: chatContentMaxWidth,
            padding: contentPadding,
            minWidth: 0,
            width: "100%"
          }}
        >
          {statusBanner ? (
            <div
              style={{
                alignItems: "center",
                background: chatBrandSoft,
                border: `1px solid ${chatBrandBorder}`,
                borderRadius: aiWebComponentTokens.radiusPill,
                color: aiWebComponentTokens.colorTextSubtle,
                display: "inline-flex",
                fontSize: 12,
                fontWeight: 600,
                gap: 8,
                justifySelf: "start",
                padding: "8px 12px"
              }}
            >
              <span
                style={{
                  background: chatBrandColor,
                  borderRadius: 999,
                  display: "inline-flex",
                  height: 6,
                  width: 6
                }}
              />
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
            <div
              style={{
                color: aiWebComponentTokens.colorMuted,
                display: "grid",
                gap: 14,
                justifyItems: "center",
                padding: "48px 20px",
                textAlign: "center"
              }}
            >
              {emptyVisual ? <div>{emptyVisual}</div> : null}
              <div style={{ color: aiWebComponentTokens.colorText, fontSize: 22, fontWeight: 700 }}>
                先开始一轮对话
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 420 }}>
                {emptyState ?? "当前还没有消息。"}
              </div>
              {emptyAction ? <div>{emptyAction}</div> : null}
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 18, minWidth: 0 }}>
            {messages.map((message) => {
              const messageActions = renderMessageActions?.(message);
              const messageBorderTone =
                message.status === "error"
                  ? aiWebComponentTokens.colorDanger
                  : message.status === "streaming"
                    ? aiWebComponentTokens.colorAccent
                    : aiWebComponentTokens.colorBorder;
              const isUser = message.role === "user";
              const isAssistant = message.role === "assistant";
              const isTool = message.role === "tool";
              const isSystem = message.role === "system";
              const showAssistantSurface = isAssistant && (Boolean(message.title) || Boolean(message.description) || message.status === "streaming");
              const bubbleBackground = isUser
                ? aiWebComponentTokens.colorText
                : isAssistant
                  ? showAssistantSurface
                    ? "rgba(255, 255, 255, 0.88)"
                    : "transparent"
                  : "rgba(243, 244, 246, 0.82)";
              const bubbleBorder = isUser
                ? "none"
                : isAssistant
                  ? showAssistantSurface
                    ? `1px solid ${messageBorderTone}`
                    : "none"
                  : `1px solid ${messageBorderTone}`;
              const bubblePadding = isUser ? "13px 16px" : isAssistant ? (showAssistantSurface ? "13px 16px" : "2px 2px 2px 0") : "11px 13px";
              const bubbleShadow = isUser ? "none" : isAssistant ? (showAssistantSurface ? aiWebComponentTokens.shadowSoft : "none") : aiWebComponentTokens.shadowSoft;

              if (isSystem) {
                return (
                  <div
                    key={message.id}
                    style={{
                      alignItems: "center",
                      color: aiWebComponentTokens.colorMuted,
                      display: "flex",
                      gap: 12,
                      minWidth: 0,
                      padding: "4px 0"
                    }}
                  >
                    <span
                      style={{
                        background: aiWebComponentTokens.colorBorder,
                        flex: 1,
                        height: 1,
                        minWidth: 24
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        maxWidth: "70%",
                        overflowWrap: "anywhere",
                        textAlign: "center"
                      }}
                    >
                      {renderMessageContent ? renderMessageContent(message) : message.content}
                    </span>
                    <span
                      style={{
                        background: aiWebComponentTokens.colorBorder,
                        flex: 1,
                        height: 1,
                        minWidth: 24
                      }}
                    />
                  </div>
                );
              }

              const defaultTitle =
                message.title ?? (isTool ? "工具输出" : message.status === "streaming" && isAssistant ? "正在回复" : null);
              const showMessageLabel = Boolean(defaultTitle) || Boolean(messageActions);

              return (
                <div
                  key={message.id}
                  style={{
                    alignItems: "flex-start",
                    display: "flex",
                    flexDirection: isUser ? "row-reverse" : "row",
                    gap: 10,
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    minWidth: 0,
                    width: "100%"
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      background: isUser
                        ? aiWebComponentTokens.colorText
                        : isAssistant
                          ? "rgba(85, 90, 255, 0.08)"
                          : "rgba(255, 255, 255, 0.88)",
                      border: isUser
                        ? "none"
                        : isAssistant
                          ? `1px solid ${chatBrandBorder}`
                          : `1px solid ${aiWebComponentTokens.colorBorder}`,
                      borderRadius: 999,
                      color: isUser ? aiWebComponentTokens.colorSurface : isTool ? aiWebComponentTokens.colorSecondaryAccent : aiWebComponentTokens.colorText,
                      boxShadow: isUser ? "none" : isAssistant ? "none" : aiWebComponentTokens.shadowSoft,
                      display: "inline-flex",
                      flexShrink: 0,
                      fontSize: isUser ? 11 : 10,
                      fontWeight: 700,
                      height: 32,
                      justifyContent: "center",
                      marginTop: 2,
                      width: 32
                    }}
                  >
                    {roleAvatarContent[message.role]}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      flex: 1,
                      gap: 6,
                      marginLeft: isUser ? "auto" : 0,
                      maxWidth: roleColumnWidths[message.role],
                      minWidth: 0,
                      textAlign: isUser ? "right" : "left",
                      width: "100%"
                    }}
                  >
                    <article
                      style={{
                        background: bubbleBackground,
                        border: bubbleBorder,
                        borderRadius: isUser ? 18 : aiWebComponentTokens.radius,
                        boxShadow: bubbleShadow,
                        color: isUser ? aiWebComponentTokens.colorSurface : aiWebComponentTokens.colorText,
                        minWidth: 0,
                        padding: bubblePadding,
                        width: "100%",
                        ...(getMessageStyle?.(message) ?? {})
                      }}
                    >
                      {showMessageLabel ? (
                        <div
                          style={{
                            alignItems: "center",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            justifyContent: "space-between",
                            marginBottom: message.description || messageActions ? 8 : 6,
                            minWidth: 0
                          }}
                        >
                          {defaultTitle ? (
                            <div
                              style={{
                                color: isUser ? "rgba(255, 255, 255, 0.72)" : roleLabelColors[message.role],
                                flex: "1 1 120px",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.03em",
                                minWidth: 0,
                                overflowWrap: "anywhere",
                                textTransform: "uppercase"
                              }}
                            >
                              {defaultTitle}
                            </div>
                          ) : <span />}
                          {messageActions ? <div style={{ flexShrink: 0 }}>{messageActions}</div> : null}
                        </div>
                      ) : null}
                      <div
                        style={{
                          display: "grid",
                          gap: 9,
                          minWidth: 0
                        }}
                      >
                        {message.description ? (
                          <div
                            style={{
                              color: isUser ? "rgba(255, 255, 255, 0.78)" : aiWebComponentTokens.colorTextSubtle,
                              fontSize: 12,
                              fontWeight: 500,
                              lineHeight: 1.55,
                              minWidth: 0,
                              overflowWrap: "anywhere"
                            }}
                          >
                            {message.description}
                          </div>
                        ) : null}
                        <div
                          style={{
                            color: isUser ? aiWebComponentTokens.colorSurface : aiWebComponentTokens.colorText,
                            fontSize: 14,
                            lineHeight: isAssistant && !showAssistantSurface ? 1.78 : 1.7,
                            minWidth: 0,
                            overflowWrap: "anywhere",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word"
                          }}
                        >
                          {renderMessageContent ? renderMessageContent(message) : message.content}
                        </div>
                        {(message.meta || renderMessageMeta) ? (
                          <div
                            style={{
                              color: isUser ? "rgba(255, 255, 255, 0.6)" : aiWebComponentTokens.colorMuted,
                              fontSize: 11,
                              letterSpacing: "0.01em",
                              minWidth: 0,
                              paddingTop: isAssistant && !showAssistantSurface ? 2 : 0,
                              overflowWrap: "anywhere"
                            }}
                          >
                            {renderMessageMeta ? renderMessageMeta(message) : message.meta}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {footer ? (
        <div
          style={{
            background: "transparent",
            flexShrink: 0,
            left: 0,
            minWidth: 0,
            padding: "0 16px 16px",
            pointerEvents: "none",
            position: "absolute",
            right: 0,
            bottom: 0
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: chatContentMaxWidth,
              minWidth: 0,
              pointerEvents: "auto",
              width: "100%"
            }}
          >
            {footer}
          </div>
        </div>
      ) : null}
    </section>
  );
}
