import { useState, useEffect, useRef } from 'react';
import { Play, PlayCircle, Terminal, Trash2, CheckCircle, RefreshCw, AlertTriangle, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';

interface LogItem {
  time: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
  msg: string;
}

export default function TerminalPanel() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'output'>('terminal');
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);

  // Broadcast terminal collapse state to other components
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('soloforge-terminal-state-changed', {
        detail: { isCollapsed: isTerminalCollapsed }
      })
    );
  }, [isTerminalCollapsed]);

  // Listen to remote toggle terminal events (e.g. from StatusBar)
  useEffect(() => {
    const handleToggleTerminal = () => {
      setIsTerminalCollapsed(prev => !prev);
    };
    window.addEventListener('soloforge-toggle-terminal', handleToggleTerminal);
    return () => {
      window.removeEventListener('soloforge-toggle-terminal', handleToggleTerminal);
    };
  }, []);
  const [progress, setProgress] = useState(100);
  const [isBuilding, setIsBuilding] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [logItems, setLogItems] = useState<LogItem[]>([
    { time: '17:56:52', type: 'system', msg: 'System initialized on port 3000' },
    { time: '17:56:53', type: 'info', msg: 'vite v6.2.3 dev server running' },
    { time: '17:56:54', type: 'success', msg: '✓ App compiled successfully in 120ms' },
  ]);

  const [statusText, setStatusText] = useState('Idle');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of logs when we add new logs if auto-scroll is enabled
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logItems, autoScroll]);

  const startRebuild = () => {
    if (isBuilding) return;
    
    setIsBuilding(true);
    setProgress(0);
    setStatusText('Compiling routes & styles...');
    
    const now = new Date().toLocaleTimeString();
    setLogItems([
      { time: now, type: 'system', msg: '>>> Starting sequential build process...' },
      { time: now, type: 'info', msg: 'yarn run build --force' },
    ]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsBuilding(false);
        setStatusText('Server listening on port 3000');
        
        const endNow = new Date().toLocaleTimeString();
        setLogItems(prev => [
          ...prev,
          { time: endNow, type: 'success', msg: '✓ Production bundle generated at /dist (CJS format)' },
          { time: endNow, type: 'info', msg: 'node dist/server.cjs' },
          { time: endNow, type: 'success', msg: '● Server running dynamically on host 0.0.0.0:3000' }
        ]);
        setProgress(100);
      } else {
        setProgress(currentProgress);
        
        // Push intermediate logs based on progress boundaries
        const timestamp = new Date().toLocaleTimeString();
        if (currentProgress > 15 && currentProgress <= 25) {
          setStatusText(`Parsing dependencies (${currentProgress}%)`);
          setLogItems(prev => {
            if (prev.some(l => l.msg.includes('vite:css'))) return prev;
            return [...prev, { time: timestamp, type: 'info', msg: '[vite:css] bundling PostCSS guidelines & tailwind core modules' }];
          });
        } else if (currentProgress > 45 && currentProgress <= 55) {
          setStatusText(`Compiling TypeScript components (${currentProgress}%)`);
          setLogItems(prev => {
            if (prev.some(l => l.msg.includes('esbuild:ts'))) return prev;
            return [...prev, { time: timestamp, type: 'info', msg: '[esbuild:ts] processing main.tsx, App.tsx, and related modules' }];
          });
        } else if (currentProgress > 75 && currentProgress <= 85) {
          setStatusText(`Minifying bundle output (${currentProgress}%)`);
          setLogItems(prev => {
            if (prev.some(l => l.msg.includes('terser:minify'))) return prev;
            return [
              ...prev, 
              { time: timestamp, type: 'warn', msg: 'd3-selection: external import size exceeds optimal budget limit' },
              { time: timestamp, type: 'info', msg: '[terser:minify] building production assets with compression level high' }
            ];
          });
        }
      }
    }, 150);
  };

  const clearTerminal = () => {
    setLogItems([]);
  };

  return (
    <div className={`bg-bg border-t border-outline/30 flex flex-col select-none font-mono transition-all duration-300 ${isTerminalCollapsed ? 'h-[28px]' : 'h-56'}`}>
      {/* Terminal Title Bar & Navigation Buttons */}
      <div 
        onClick={() => isTerminalCollapsed && setIsTerminalCollapsed(false)}
        className={`flex items-center justify-between px-3 py-1 bg-surface border-b border-outline/30 text-[11px] ${isTerminalCollapsed ? 'cursor-pointer hover:bg-surface-bright' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-on-surface/50">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">控制台</span>
          </div>

          {!isTerminalCollapsed && (
            <div className="flex items-center gap-1 border-l border-outline/30 pl-3">
              <button 
                onClick={() => setActiveTab('terminal')} 
                className={`px-2 py-0.5 rounded transition-all ${activeTab === 'terminal' ? 'bg-primary/10 text-primary border-b-2 border-primary/80 font-bold' : 'text-on-surface/50 hover:text-on-surface'}`}
              >
                Terminal
              </button>
              <button 
                onClick={() => setActiveTab('problems')} 
                className={`px-2 py-0.5 rounded transition-all ${activeTab === 'problems' ? 'bg-primary/10 text-primary' : 'text-on-surface/50 hover:text-on-surface'}`}
              >
                Problems <span className="text-[9px] bg-surface-bright text-yellow-500 px-1 rounded ml-1">1</span>
              </button>
              <button 
                onClick={() => setActiveTab('output')} 
                className={`px-2 py-0.5 rounded transition-all ${activeTab === 'output' ? 'bg-primary/10 text-primary' : 'text-on-surface/50 hover:text-on-surface'}`}
              >
                Output
              </button>
            </div>
          )}
        </div>

        {/* Action Controls for terminal simulation */}
        <div className="flex items-center gap-2">
          {!isTerminalCollapsed ? (
            <>
              <button 
                onClick={startRebuild} 
                disabled={isBuilding}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold select-none transition-all ${isBuilding ? 'bg-surface-bright text-on-surface/40 cursor-not-allowed' : 'bg-primary hover:opacity-90 text-bg hover:scale-[1.02] active:scale-95'}`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>编译并运行</span>
              </button>
              
              <button 
                onClick={() => setAutoScroll(!autoScroll)}
                className={`p-1 rounded transition-colors ${autoScroll ? 'text-primary bg-primary/10 hover:bg-primary/25' : 'text-on-surface/40 hover:text-on-surface hover:bg-surface-bright'}`}
                title={autoScroll ? "锁定滚动 to latest log (click to unlock)" : "manual browse - automatic scroll paused (click to lock)"}
              >
                {autoScroll ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>

              <button 
                onClick={clearTerminal} 
                className="p-1 hover:bg-surface-bright rounded text-[#ea8484] hover:text-[#ff9b9b] transition-colors"
                title="Clear logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <span className="text-[9px] text-primary/80 select-none font-sans font-medium mr-2 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              <span>PORT: 3000 | {statusText}</span>
            </span>
          )}

          <div className="w-[1px] h-3 bg-outline/30 mx-0.5" />

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsTerminalCollapsed(!isTerminalCollapsed);
            }} 
            className="p-1 hover:bg-surface-bright rounded text-on-surface/50 hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
            title={isTerminalCollapsed ? "展开控制台" : "收起控制台"}
          >
            {isTerminalCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isTerminalCollapsed && (
        <>
          {/* Dynamic Build Progress Bar Container */}
          <div className="bg-surface/40 px-3 py-1 border-b border-outline/20 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2 flex-grow max-w-sm">
          <span className="text-primary/80 min-w-[70px] truncate">{statusText}</span>
          <div className="flex-grow bg-surface h-1.5 rounded-full overflow-hidden border border-outline/25">
            <div 
              className={`h-full transition-all duration-150 ${progress === 100 ? 'bg-green-500 shadow-[0_0_8px_rgb(34,197,94)]' : 'bg-primary shadow-[0_0_8px_var(--color-primary)]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-on-surface/50 w-8 text-right font-semibold">{progress}%</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-on-surface/40">
          <span>PORT: 3000</span>
          <span>•</span>
          <span>HOST: 0.0.0.0</span>
        </div>
      </div>

      {/* Log list area */}
      <div className="flex-1 overflow-y-auto p-3 text-[11px] leading-relaxed space-y-1 scrollbar-thin scrollbar-thumb-outline/30">
        {activeTab === 'terminal' && (
          <>
            {logItems.length === 0 ? (
              <div className="text-on-surface/30 italic text-center pt-8">Terminal is idle. Click "编译并运行" to start build cycles.</div>
            ) : (
              logItems.map((log, index) => (
                <div key={index} className="flex gap-3 hover:bg-surface-bright/30 rounded px-1 transition-colors">
                  <span className="text-primary/50 select-none">{log.time}</span>
                  <span className={`font-semibold shrink-0 ${log.type === 'success' ? 'text-green-500' : log.type === 'warn' ? 'text-amber-500' : log.type === 'system' ? 'text-blue-500 font-bold' : 'text-on-surface/80'}`}>
                    {log.type === 'system' ? '[system]' : log.type === 'success' ? '[success]' : log.type === 'warn' ? '[warning]' : '[info]'}
                  </span>
                  <span className={`${log.type === 'success' ? 'text-green-600 dark:text-green-300' : log.type === 'warn' ? 'text-amber-600 dark:text-yellow-200' : 'text-on-surface/95'}`}>
                    {log.msg}
                  </span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-2 p-1">
            <div className="flex items-start gap-2 bg-yellow-500/15 border border-yellow-500/30 p-2 rounded">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-on-surface font-semibold">Warning: Bundle size exceeds budget limit</div>
                <div className="text-on-surface/60 text-[10px]">file: /src/components/TerminalPanel.tsx | source: Terser Compression Engine</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'output' && (
          <div className="text-on-surface/40 italic p-2 text-center">No background output buffers current.</div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
