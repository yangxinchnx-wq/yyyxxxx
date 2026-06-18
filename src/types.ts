export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  avatar: string;
  name: string;
  time: string;
  text: string;
  steps?: {
    title: string;
    status: 'completed' | 'progress' | 'pending';
    progress?: number;
    duration?: string;
    substeps?: { title: string; status: 'completed' | 'progress' | 'pending'; progress?: number; duration?: string }[];
  }[];
  /**
   * AI 在回复过程中触发的 hashline / 工具调用结果
   * 每条对应一次 read / edit / batch 操作
   */
  toolCalls?: ToolCall[];
}

export type ToolCallKind = 'hashline.read' | 'hashline.edit' | 'hashline.batch';

export interface ToolCallBase {
  id: string;
  kind: ToolCallKind;
  status: 'running' | 'success' | 'error';
  timestamp: number;
  durationMs?: number;
}

export interface HashlineReadCall extends ToolCallBase {
  kind: 'hashline.read';
  filePath: string;
  version?: { mtimeMs: number; contentHash: string; lockEpoch: number };
  /** 出错时携带的错误码 */
  errorCode?: string;
}

export interface HashlineEditCall extends ToolCallBase {
  kind: 'hashline.edit';
  filePath: string;
  op: 'replace' | 'append' | 'prepend' | 'delete';
  diff?: string;
  diffSummary?: string;
  removedLineCount?: number;
  insertedLineCount?: number;
  newVersion?: { mtimeMs: number; contentHash: string; lockEpoch: number };
  errorCode?: string;
  /** 锚点出错时,后端返回的最新锚点(AI 自愈用),UI 仅显示一行提示 */
  freshAnchoredText?: string;
}

export interface HashlineBatchCall extends ToolCallBase {
  kind: 'hashline.batch';
  total: number;
  succeeded: number;
  failedAt?: number;
  errorCode?: string;
  /**
   * 子结果数组(每个文件一项)
   * - success: 全部成功的文件
   * - error: partial(已成功但因后续失败回滚的子结果)
   */
  results?: Array<{
    filePath: string;
    diff: string;
    diffSummary: string;
    removedLineCount: number;
    insertedLineCount: number;
    version: { mtimeMs: number; contentHash: string; lockEpoch: number };
  }>;
}

export type ToolCall = HashlineReadCall | HashlineEditCall | HashlineBatchCall;

export interface ChatHistoryItem {
  id: string;
  title: string;
  time: string;
  active?: boolean;
}

export interface SecondaryModel {
  id: string;
  name: string;
  weight: number; // Relative weight, e.g. 1 to 10
}

export interface ThemePreset {
  id: string;
  name: string;
  bg: string;
  surface: string;
  surfaceBright: string;
  primary: string;
  onSurface: string;
  outline: string;
}


