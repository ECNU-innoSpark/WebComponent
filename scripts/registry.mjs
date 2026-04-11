export const CONFIG_FILE = "aiwc.json";

function createExportLines(componentName, typeNames = []) {
  const lines = [`export { ${componentName} } from "./${componentName}";`];

  if (typeNames.length > 0) {
    lines.push(`export type { ${typeNames.join(", ")} } from "./${componentName}";`);
  }

  return lines;
}

export const registry = [
  {
    name: "tokens",
    description: "AIWC 视觉 tokens。",
    files: ["src/styles/tokens.ts"],
    internal: true
  },
  {
    name: "panel-styles",
    description: "AIWC 面板公共样式函数。",
    files: ["src/styles/panelStyles.ts"],
    internal: true,
    registryDependencies: ["tokens"]
  },
  {
    name: "panel-state-block",
    description: "面板状态占位块。",
    files: ["src/components/shared/PanelStateBlock.tsx"],
    internal: true,
    registryDependencies: ["panel-styles"]
  },
  {
    name: "action-button",
    aliases: ["actionbutton"],
    componentName: "ActionButton",
    description: "基础操作按钮。",
    files: ["src/components/ActionButton.tsx"],
    exports: createExportLines("ActionButton", ["ActionButtonProps"]),
    registryDependencies: ["tokens"]
  },
  {
    name: "segmented-control",
    aliases: ["segmentedcontrol"],
    componentName: "SegmentedControl",
    description: "分段切换器。",
    files: ["src/components/SegmentedControl.tsx"],
    exports: createExportLines("SegmentedControl", ["SegmentedControlItem", "SegmentedControlProps"]),
    registryDependencies: ["tokens"]
  },
  {
    name: "tone-badge",
    aliases: ["tonebadge"],
    componentName: "ToneBadge",
    description: "语义色标签。",
    files: ["src/components/ToneBadge.tsx"],
    exports: createExportLines("ToneBadge", ["ToneBadgeProps"]),
    registryDependencies: ["panel-styles"]
  },
  {
    name: "text-editor",
    aliases: ["texteditor"],
    componentName: "TextEditor",
    description: "文本编辑器。",
    files: ["src/components/TextEditor.tsx"],
    exports: createExportLines("TextEditor", ["TextEditorProps"]),
    registryDependencies: ["tokens"]
  },
  {
    name: "text-composer",
    aliases: ["textcomposer"],
    componentName: "TextComposer",
    description: "带提交动作的文本输入器。",
    files: ["src/components/TextComposer.tsx"],
    exports: createExportLines("TextComposer", ["TextComposerProps"]),
    registryDependencies: ["action-button", "tokens"]
  },
  {
    name: "session-list-panel",
    aliases: ["session", "session-list", "sessionlistpanel"],
    componentName: "SessionListPanel",
    description: "会话列表面板。",
    files: ["src/components/SessionListPanel.tsx"],
    exports: createExportLines("SessionListPanel", ["SessionListItem", "SessionListPanelProps"]),
    registryDependencies: ["panel-state-block", "panel-styles", "tokens"]
  },
  {
    name: "chat-panel",
    aliases: ["chat", "chatpanel"],
    componentName: "ChatPanel",
    description: "对话主面板。",
    files: ["src/components/ChatPanel.tsx"],
    exports: createExportLines("ChatPanel", ["ChatMessage", "ChatMessageRole", "ChatPanelProps", "ChatPanelStatus"]),
    registryDependencies: ["panel-state-block", "panel-styles", "tokens"]
  },
  {
    name: "file-manager-panel",
    aliases: ["files", "file-manager", "filemanagerpanel"],
    componentName: "FileManagerPanel",
    description: "文件管理面板。",
    files: ["src/components/FileManagerPanel.tsx"],
    exports: createExportLines("FileManagerPanel", ["FileManagerPanelProps", "FileTreeNode"]),
    registryDependencies: ["panel-state-block", "panel-styles", "tokens"]
  },
  {
    name: "file-preview-panel",
    aliases: ["preview", "file-preview", "filepreviewpanel"],
    componentName: "FilePreviewPanel",
    description: "文件预览面板。",
    files: ["src/components/FilePreviewPanel.tsx"],
    exports: createExportLines("FilePreviewPanel", ["FilePreviewPanelProps"]),
    registryDependencies: ["panel-state-block", "panel-styles", "tokens"]
  },
  {
    name: "knowledge-graph-panel",
    aliases: ["graph", "knowledge-graph", "knowledgegraphpanel"],
    componentName: "KnowledgeGraphPanel",
    description: "知识图谱面板。",
    files: ["src/components/KnowledgeGraphPanel.tsx"],
    exports: createExportLines("KnowledgeGraphPanel", ["KnowledgeEdge", "KnowledgeGraphPanelProps", "KnowledgeNode"]),
    externalDependencies: ["@xyflow/react"],
    registryDependencies: ["panel-state-block", "panel-styles", "tokens"]
  }
];

export const publicRegistry = registry.filter((item) => !item.internal);

export function getRegistryItem(name) {
  const normalized = name.toLowerCase().trim();

  return registry.find((item) => item.name === normalized || item.aliases?.includes(normalized)) ?? null;
}
