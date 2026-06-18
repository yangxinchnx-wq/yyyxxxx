// ─────────────────────────────────────────────────────────────────
// AndroidComposePreview — 解释型 Compose/ArkTS 渲染器
//
// 设计原则：
// - 接收 ComposeTree（后端 parser 输出的 JSON）
// - 递归 NodeRenderer：Column/Row/Box/Text/Button/Spacer/If
// - 点击有视觉反馈（scale + 颜色）
// - 接收 width/height 限定 Pixel 8 外壳尺寸
// - 监听全局 'compose.tree' 事件实现实时刷新（后端 chokidar → WS 推送）
//
// 设计文档：UI/连接.md (解释型预览方案)
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react';
import type { ComposeNode, ComposeTree, ComposeNodeType } from '@/../src/compose/types';

// ─── 类型 ───────────────────────────────────────────────────

interface AndroidComposePreviewProps {
  filePath: string;
  funcName?: string;
  width: number;
  height: number;
}

// 全局事件载荷：与服务端 ServerMsg['compose.tree'].payload 对齐
interface ComposeTreeEventDetail {
  path: string;
  tree: ComposeTree;
}

function isComposeTreePayload(v: unknown): v is ComposeTreeEventDetail {
  if (typeof v !== 'object' || v === null) return false;
  const obj = v as Record<string, unknown>;
  return typeof obj.path === 'string' && typeof obj.tree === 'object' && obj.tree !== null;
}

// ─── 数据获取 hook ─────────────────────────────────────────

interface FetchState {
  tree: ComposeTree | null;
  error: string | null;
  loading: boolean;
}

function useComposeTree(filePath: string, funcName: string): FetchState {
  const [state, setState] = useState<FetchState>({ tree: null, error: null, loading: true });

  const fetchTree = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const url = `/api/compose/preview?func=${encodeURIComponent(funcName)}&path=${encodeURIComponent(filePath)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        setState({ tree: null, error: body.error ?? `HTTP ${res.status}`, loading: false });
        return;
      }
      const data = await res.json();
      setState({ tree: data.tree as ComposeTree, error: null, loading: false });
    } catch (e) {
      setState({ tree: null, error: e instanceof Error ? e.message : String(e), loading: false });
    }
  }, [filePath, funcName]);

  useEffect(() => {
    void fetchTree();

    // 订阅全局 WS compose.tree 事件 — 文件保存时后端推送，无延迟
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<unknown>).detail;
      if (!isComposeTreePayload(detail)) return;
      if (detail.path !== filePath) return;
      setState({ tree: detail.tree, error: null, loading: false });
    };
    window.addEventListener('soloforge:compose-tree', handler);
    return () => window.removeEventListener('soloforge:compose-tree', handler);
  }, [fetchTree, filePath]);

  return state;
}

// ─── NodeRenderer（递归） ───────────────────────────────────

interface NodeRendererProps {
  node: ComposeNode;
  depth: number;
}

function NodeRenderer({ node, depth }: NodeRendererProps) {
  // If 条件不满足：不渲染
  if (node.type === 'If' && node.visible === false) {
    return null;
  }

  const children = node.children.map((c, i) => (
    <NodeRenderer key={c.id || `${node.id}-${i}`} node={c} depth={depth + 1} />
  ));

  switch (node.type) {
    case 'Column':
      return <div className="flex flex-col gap-2" style={node.style}>{children}</div>;

    case 'Row':
      return <div className="flex flex-row gap-2" style={node.style}>{children}</div>;

    case 'Box':
      return (
        <div className="border border-dashed border-white/20 p-2 rounded" style={node.style}>
          {children}
        </div>
      );

    case 'Spacer':
      return <div aria-hidden style={node.style} />;

    case 'Text':
      return (
        <p
          className="text-white text-sm leading-relaxed break-words"
          style={node.style}
        >
          {node.props.text ?? ''}
        </p>
      );

    case 'Button':
      return <ButtonNode node={node} />;

    case 'If':
      // visible 已在上方判定；children 由上方 map 渲染
      return <>{children}</>;

    case 'Unknown':
    default:
      return (
        <div className="text-yellow-400 text-xs italic px-2 py-1 border border-yellow-400/30 rounded">
          [unsupported: {node.type}] {Object.entries(node.props).map(([k, v]) => `${k}=${v}`).join(' ')}
        </div>
      );
  }
}

function ButtonNode({ node }: { node: ComposeNode }) {
  const [pressed, setPressed] = useState(false);
  const handleClick = () => {
    setPressed(true);
    window.setTimeout(() => setPressed(false), 150);
  };
  const label = node.props.label ?? '';
  // 用户自定义背景色：未提供时用默认蓝
  const hasCustomBg = !!node.style?.backgroundColor;
  const interactiveClass = hasCustomBg
    ? ''
    : (pressed ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600');
  return (
    <button
      type="button"
      onClick={handleClick}
      data-testid={`compose-btn-${node.id}`}
      className={[
        'px-4 py-2 rounded-lg font-medium text-white',
        'transition-all duration-150 ease-out select-none',
        'active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300',
        pressed ? 'scale-95 shadow-inner' : 'scale-100',
        interactiveClass,
      ].filter(Boolean).join(' ')}
      style={node.style}
    >
      {label}
    </button>
  );
}

// ─── 顶层组件 ───────────────────────────────────────────────

export function AndroidComposePreview({ filePath, funcName = 'MainScreen', width, height }: AndroidComposePreviewProps) {
  const { tree, error, loading } = useComposeTree(filePath, funcName);

  return (
    <div
      className="relative overflow-hidden bg-gray-900 rounded-[28px] border-4 border-gray-800 shadow-2xl"
      style={{ width, height }}
    >
      {/* 状态栏 */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900/95 flex items-center justify-between px-4 text-[10px] text-white/70 z-10">
        <span>9:41</span>
        <span className="font-semibold text-white/90">● ● ●</span>
      </div>

      {/* 内容区 */}
      <div className="absolute inset-0 pt-6 pb-6 px-3 overflow-auto">
        {loading && !tree && (
          <div className="flex items-center justify-center h-full text-white/50 text-xs">Loading…</div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
            <div className="text-red-400 text-xs font-semibold">Parse error</div>
            <pre className="text-red-300 text-[10px] whitespace-pre-wrap text-center">{error}</pre>
          </div>
        )}
        {tree && <NodeRenderer node={tree.root} depth={0} />}
      </div>

      {/* 底部 home bar */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full" />
    </div>
  );
}

export default AndroidComposePreview;
