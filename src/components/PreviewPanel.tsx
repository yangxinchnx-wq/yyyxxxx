import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, Monitor, Smartphone, Tablet, Wifi, Search, ExternalLink, 
  Cpu, HardDrive, Play, Square, RotateCcw, Sliders, Shield, Zap, Terminal, AppWindow, Image as ImageIcon, ZoomIn, ZoomOut,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import SimulatedViewport from './SimulatedViewport';

interface PreviewPanelProps {
  width?: number;
  isResizing?: boolean;
  dragStartWidth?: number;
  selectedChatId?: string;
}

// Preset configurations for simulated Android Devices
const DEVICE_PRESETS = [
  { id: 'pixel8', name: 'Google Pixel 8 Pro', width: 280, height: 530, density: '480 dpi', os: 'Android 14' },
  { id: 'tablet', name: 'Generic Android Tablet', width: 440, height: 600, density: '320 dpi', os: 'Android 14 (R)' },
  { id: 'watch', name: 'Android WearOS Watch', width: 220, height: 220, density: '240 dpi', os: 'WearOS 4' }
];

// Activity/Simulation screenshot frames (SVG mock data representing agent navigation to keep sandbox lightweight yet rich)
const MOCK_SCREENSHOTS = [
  // 1. Home Dashboard Search
  `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
    <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
    <text x="12" y="24" fill="#656c75" font-size="11" font-weight="bold">MobileGym AVD Core 01</text>
    <rect x="12" y="55" width="256" height="32" rx="6" fill="#1c2024" stroke="#ff8c00" stroke-width="1.5"/>
    <text x="28" y="75" fill="#fcfcfc" font-size="11" font-family="monospace">instacart app organic apples</text>
    <circle cx="240" cy="71" r="5" fill="#ff8c00"/>
    <rect x="12" y="105" width="256" height="120" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
    <text x="24" y="128" fill="#ffffff" font-size="13" font-weight="bold">Instacart Shopping</text>
    <text x="24" y="148" fill="#a0aec0" font-size="10">RL Goal: Item "Honeycrisp Apples"</text>
    <rect x="24" y="165" width="70" height="24" rx="4" fill="#059669"/>
    <text x="36" y="180" fill="#ffffff" font-size="10" font-weight="bold">API Active</text>
    <circle cx="120" cy="180" r="16" fill="#ff5d5d" opacity="0.4"/>
    <circle cx="120" cy="180" r="6" fill="#ff2d2d"/>
    <rect x="12" y="240" width="120" height="150" rx="6" fill="#181a1c"/>
    <rect x="20" y="248" width="104" height="70" rx="4" fill="#2d3748"/>
    <text x="20" y="335" fill="#ffffff" font-size="10">Honeycrisp Apple</text>
    <text x="20" y="352" fill="#059669" font-size="10" font-weight="bold">$1.99 / lb</text>
    <rect x="20" y="365" width="40" height="16" rx="3" fill="#ff8c00"/>
    <text x="26" y="377" fill="#121415" font-size="8" font-weight="bold">Action</text>
    <rect x="148" y="240" width="120" height="150" rx="6" fill="#181a1c"/>
    <rect x="156" y="248" width="104" height="70" rx="4" fill="#2d3748"/>
    <text x="156" y="335" fill="#ffffff" font-size="10">Gala Apples (Bg)</text>
    <text x="156" y="352" fill="#059669" font-size="10" font-weight="bold">$2.49 / lb</text>
    <rect x="12" y="405" width="256" height="40" rx="6" fill="#1e2227" stroke="#2e353f"/>
    <text x="20" y="428" fill="#ffe08b" font-size="10" font-family="monospace">Reward: +0.25 (Search phase complete)</text>
    <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
    <circle cx="140" cy="493" r="4" fill="#ffffff"/>
  </svg>`,

  // 2. Add to Cart selection
  `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
    <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
    <text x="12" y="24" fill="#656c75" font-size="11" font-weight="bold">MobileGym AVD Core 01</text>
    <rect x="12" y="55" width="256" height="300" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
    <rect x="24" y="75" width="232" height="140" rx="6" fill="#2d3748"/>
    <text x="32" y="238" fill="#ffffff" font-size="14" font-weight="bold">Fresh Organic Honeycrisp</text>
    <text x="32" y="258" fill="#a0aec0" font-size="10">Origin: Washington State, US</text>
    <text x="32" y="278" fill="#10b981" font-size="16" font-weight="bold">$1.99 / lb</text>
    <rect x="32" y="295" width="216" height="36" rx="6" fill="#ff8c00" stroke="#f59e0b" stroke-width="1"/>
    <text x="100" y="318" fill="#121415" font-size="11" font-weight="extrabold">ADD TO CART</text>
    <circle cx="210" cy="312" r="16" fill="#ff5d5d" opacity="0.4"/>
    <circle cx="210" cy="312" r="6" fill="#ff2d2d"/>
    <rect x="12" y="370" width="256" height="75" rx="6" fill="#111215" stroke="#ffe08b" stroke-width="1"/>
    <text x="20" y="390" fill="#10b981" font-size="10" font-weight="bold">Reward: +1.00 (Objective Met!)</text>
    <text x="20" y="410" fill="#718096" font-size="9" font-family="monospace">Goal status: SUCCESS</text>
    <text x="20" y="425" fill="#718096" font-size="9" font-family="monospace">Step 48: Action clicked Cart (x=210, y=312)</text>
    <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
    <circle cx="140" cy="493" r="4" fill="#ffffff"/>
  </svg>`,

  // 3. Settings/Agent Policy Optimization
  `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
    <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
    <text x="12" y="24" fill="#656c75" font-size="11" font-weight="bold">MobileGym AVD Core 01</text>
    <rect x="12" y="55" width="256" height="320" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
    <text x="24" y="85" fill="#ffffff" font-size="14" font-weight="bold">Agent Policy Settings</text>
    <line x1="24" y1="95" x2="244" y2="95" stroke="#2d3748" stroke-width="1"/>
    <text x="24" y="120" fill="#e2e8f0" font-size="11">RL Algorithm: PPO (Clip)</text>
    <text x="24" y="140" fill="#cbd5e0" font-size="9">Learning rate: 0.0003</text>
    <text x="24" y="160" fill="#cbd5e0" font-size="9">Gamma: 0.99 (Discount)</text>
    <rect x="24" y="180" width="220" height="60" rx="4" fill="#111215" stroke="#2d3748"/>
    <text x="32" y="198" fill="#ff8c00" font-size="10" font-weight="bold">Observation Space Specs</text>
    <text x="32" y="215" fill="#718096" font-size="9">Screen: 280x500 Visual Image</text>
    <text x="32" y="230" fill="#718096" font-size="9">XML Tree Hierarchies Enabled</text>
    <rect x="24" y="255" width="100" height="28" rx="4" fill="#2d3748"/>
    <text x="44" y="272" fill="#ffffff" font-size="10">Back to Gym</text>
    <circle cx="74" cy="270" r="16" fill="#ff5d5d" opacity="0.4"/>
    <circle cx="74" cy="270" r="6" fill="#ff2d2d"/>
    <rect x="134" y="255" width="110" height="28" rx="4" fill="#ff5c5c" opacity="0.2"/>
    <text x="144" y="272" fill="#ff8a8a" font-size="10">Terminate Node</text>
    <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
    <circle cx="140" cy="493" r="4" fill="#ffffff"/>
  </svg>`
];

export default function PreviewPanel({ width = 385, isResizing = false, dragStartWidth = 385, selectedChatId }: PreviewPanelProps) {
  const { activeTheme } = useTheme();
  const [activeProjectTag, setActiveProjectTag] = useState<string>('VUE');
  const [previewMode, setPreviewMode] = useState<'web' | 'mobilegym'>('web');
  const [selectedDevice, setSelectedDevice] = useState('pixel8');
  const [phoneWidth, setPhoneWidth] = useState(280);
  const [phoneHeight, setPhoneHeight] = useState(500);
  const [vmUrl, setVmUrl] = useState('https://android.emulator.sandbox.dev');
  const [isAgentRunning, setIsAgentRunning] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [rewardHistory, setRewardHistory] = useState<number[]>([0.0, 0.1, 0.25, -0.05, 0.4, 0.12, 1.0]);
  const [activeActionMsg, setActiveActionMsg] = useState('Searching Shopping item: apples');
  const [logs, setLogs] = useState<string[]>([
    '[GymInit] Connecting to MobileGym AVD daemon...',
    '[GymInit] Successfully setup ADB port mapping tcp:5037',
    '[AgentPPO] Load Policy weights... [OK]',
    '[AgentState] Task assigned: find apples and add to card',
    '[RewardTracker] Baseline zero initial reward set'
  ]);
  const [scaleFactor, setScaleFactor] = useState(100);
  const [adbPort, setAdbPort] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('soloforge_gym_monitor_adb_config');
        if (saved) {
          return JSON.parse(saved).port || 5037;
        }
      } catch (e) {}
    }
    return 5037;
  });

  useEffect(() => {
    const handleConfigSave = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.port) {
        setAdbPort(customEvent.detail.port);
      }
    };
    window.addEventListener('soloforge-adb-config-saved', handleConfigSave as EventListener);
    return () => {
      window.removeEventListener('soloforge-adb-config-saved', handleConfigSave as EventListener);
    };
  }, []);

  // Default web layout state placeholders
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hmrState, setHmrState] = useState<'idle' | 'updating' | 'success'>('idle');
  const [blogTitle, setBlogTitle] = useState('MyBlog');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Load project type context from local storage to auto-display MobileGym
  const checkChatType = () => {
    try {
      const saved = localStorage.getItem('soloforge_chats_list');
      if (saved) {
        const chats = JSON.parse(saved);
        const currentChat = chats.find((c: any) => c.id === selectedChatId);
        if (currentChat) {
          const tag = currentChat.tag || 'NEW';
          setActiveProjectTag(tag);
          if (tag === 'ANDROID') {
            setPreviewMode('mobilegym');
          } else {
            setPreviewMode('web');
          }
          return;
        }
      }
      // Failbacks for default template ids
      if (selectedChatId === '1') {
        setActiveProjectTag('VUE');
        setPreviewMode('web');
      } else if (selectedChatId === '2') {
        setActiveProjectTag('AUTH');
        setPreviewMode('web');
      } else if (selectedChatId === '3') {
        setActiveProjectTag('AI');
        setPreviewMode('web');
      } else {
        setActiveProjectTag('NEW');
        setPreviewMode('web');
      }
    } catch (e) {
      console.warn('Error fetching active chat tag context:', e);
    }
  };

  useEffect(() => {
    checkChatType();
  }, [selectedChatId]);

  // Safely enforce that if activeProjectTag is not ANDROID, preview mode must switch back to default (web)
  useEffect(() => {
    if (activeProjectTag !== 'ANDROID' && previewMode === 'mobilegym') {
      setPreviewMode('web');
    }
  }, [activeProjectTag, previewMode]);

  useEffect(() => {
    window.addEventListener('soloforge-chats-updated', checkChatType);
    return () => {
      window.removeEventListener('soloforge-chats-updated', checkChatType);
    };
  }, [selectedChatId]);

  // Handle preset device dimension select
  const handleApplyPreset = (id: string) => {
    const preset = DEVICE_PRESETS.find(p => p.id === id);
    if (preset) {
      setSelectedDevice(id);
      setPhoneWidth(preset.width);
      setPhoneHeight(preset.height);
    }
  };

  // Automated RL Agent Loop Generator
  useEffect(() => {
    if (!isAgentRunning || previewMode !== 'mobilegym') return;

    const interval = setInterval(() => {
      // Rotate active step
      setActiveStep(prev => (prev >= 60 ? 1 : prev + 1));
      
      // Update screenshot indices
      setCurrentScreenshotIndex(prev => {
        const nextIdx = (prev + 1) % MOCK_SCREENSHOTS.length;
        // set descriptive actions based on simulated screen
        if (nextIdx === 0) {
          setActiveActionMsg('Step Action: input "organic apples" in Search Bar');
          setRewardHistory(hist => [...hist.slice(-10), Number((Math.random() * 0.3).toFixed(2))]);
          setLogs(prevLogs => [
            `[Step ${Math.floor(Math.random() * 50)}] Action: type("instacart", "organic apples")`,
            ...prevLogs.slice(0, 50)
          ]);
        } else if (nextIdx === 1) {
          setActiveActionMsg('Step Action: click "ADD TO CART" (x=210, y=312)');
          setRewardHistory(hist => [...hist.slice(-10), 1.0]);
          setLogs(prevLogs => [
            `[Step ${Math.floor(Math.random() * 50) + 50}] Action: click(x=210, y=312) | Target: Button "ADD TO CART"`,
            `[AgentReward] SUCCESS reward met (+1.00 objective achievement)`,
            ...prevLogs.slice(0, 50)
          ]);
        } else {
          setActiveActionMsg('Step Action: optimize policy network hyperparameters');
          setRewardHistory(hist => [...hist.slice(-10), 0.0]);
          setLogs(prevLogs => [
            `[PPO Optimization] Policy epoch update finished. Alpha clip: 0.2`,
            `[AgentState] Resetting MobileGym sandbox to initial step`,
            ...prevLogs.slice(0, 50)
          ]);
        }
        return nextIdx;
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [isAgentRunning, previewMode]);

  // Live Performance Stats Broadcaster
  const cpuRef = useRef(35);
  const memRef = useRef(3.14);
  const fpsRef = useRef(59.8);

  useEffect(() => {
    // Continuous random walk for metrics to make status display organic and believable
    const statInterval = setInterval(() => {
      cpuRef.current = Math.max(12, Math.min(88, cpuRef.current + (Math.random() * 10 - 5)));
      memRef.current = Math.max(2.1, Math.min(7.8, memRef.current + (Math.random() * 0.1 - 0.05)));
      fpsRef.current = Math.max(54, Math.min(60, fpsRef.current + (Math.random() * 1.2 - 0.6)));

      const activeMetrics = {
        cpu: Number(cpuRef.current.toFixed(1)),
        memory: Number(memRef.current.toFixed(2)),
        fps: Number(fpsRef.current.toFixed(1)),
        screenshot: MOCK_SCREENSHOTS[currentScreenshotIndex],
        action: activeActionMsg,
        step: activeStep,
        logs: logs.slice(0, 15)
      };

      // Dispatch event to workspace monitoring system
      window.dispatchEvent(new CustomEvent('soloforge-mobilegym-vm-state', {
        detail: activeMetrics
      }));
    }, 1000);

    return () => clearInterval(statInterval);
  }, [currentScreenshotIndex, activeActionMsg, activeStep, logs]);

  const triggerHmr = () => {
    if (hmrState === 'updating') return;
    setHmrState('updating');
    setTimeout(() => {
      setHmrState('success');
      setTimeout(() => setHmrState('idle'), 2000);
    }, 1500);
  };

  const getWidthClass = () => {
    if (device === 'mobile') return 'max-w-[280px] w-full';
    if (device === 'tablet') return 'max-w-[340px] w-full';
    return 'w-full';
  };

  const posts = [
    {
      id: 'vue3',
      title: '探索 Vue3 的组合式 API',
      category: '前端开发',
      date: '2024-05-20',
      reads: 1234,
      bg: 'from-emerald-500 to-teal-700',
      description: '深入理解 Vue3 组合式 API 的设计思想和使用方法, 探究 ref & reactive 响应式底层原理性能优势...',
      content: [
        '组合式 API (Composition API) 是一组 API，允许我们使用导入的函数来编写组件，而不再受制于 Options API 的固定结构。',
        '它的核心响应性机制由 ES6 Proxy 驱动，带来了更直观的逻辑组织模式和完美的 TypeScript 支持效能优势。',
      ]
    },
    {
      id: 'nodejs',
      title: 'Node.js 后端开发实践',
      category: '后端开发',
      date: '2024-05-18',
      reads: 856,
      bg: 'from-green-600 to-neutral-700',
      description: '使用 Node.js + Express 搭建 RESTful API, 结合中间件开发, 设计全链路异常拦截与安全沙箱防护。',
      content: [
        '基于 Node.js 的高并发非阻塞事件循环特性，结合 Express 可以极速构建高可用的微服务。',
        '本篇将详述如何在实际项目中实现完备的 JWT 用户验证流程和精细化的速率控制网关限流。',
      ]
    }
  ];

  // Manual Drag to resize device handler conforming strictly to Floating Panel Design Standard
  const handlePhoneResizeStart = (e: React.MouseEvent, corner: 'br' | 'b' | 'r') => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = phoneWidth;
    const startH = phoneHeight;

    const handleMouseMove = (moveEv: MouseEvent) => {
      const deltaX = moveEv.clientX - startX;
      const deltaY = moveEv.clientY - startY;
      
      if (corner === 'r' || corner === 'br') {
        const nextW = Math.max(180, Math.min(580, startW + deltaX));
        setPhoneWidth(nextW);
      }
      if (corner === 'b' || corner === 'br') {
        const nextH = Math.max(220, Math.min(750, startH + deltaY));
        setPhoneHeight(nextH);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResetSimulator = () => {
    setActiveStep(1);
    setLogs(prev => [`[GymAction] Manual Reset triggered at ${new Date().toLocaleTimeString()}`, ...prev]);
    setRewardHistory([0]);
    triggerHmr();
  };

  return (
    <div 
      style={{ 
        width,
        transition: isResizing ? 'none' : 'width 250ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="h-full bg-surface border-l border-outline/50 flex flex-col shrink-0 select-none z-10 overflow-hidden"
    >
      <div
        style={{
          width: isResizing ? `${dragStartWidth}px` : '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden'
        }}
      >
        {/* TOP BAR / VIEW TOGGLE (Including MobileGym Option) */}
        <div className="p-2.5 px-3 border-b border-outline/40 flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display font-semibold text-[11px] text-on-surface tracking-wide">
              {activeProjectTag === 'ANDROID' ? '安卓虚拟机环境' : '实时预览'}
            </span>
          </div>

           <div className="flex items-center gap-2">
            {/* View options switcher selection */}
            {activeProjectTag === 'ANDROID' && (
              <div className="flex items-center bg-bg p-0.5 rounded border border-outline">
                <button
                  onClick={() => setPreviewMode('web')}
                  className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-colors cursor-pointer ${previewMode === 'web' ? 'bg-[#5adbb5]/10 text-[#5adbb5] border border-[#5adbb5]/25' : 'text-on-surface/40 hover:text-on-surface'}`}
                >
                  WEB 视图
                </button>
                <button
                  onClick={() => {
                    if (activeProjectTag === 'ANDROID') {
                      setPreviewMode('mobilegym');
                    }
                  }}
                  disabled={activeProjectTag !== 'ANDROID'}
                  className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-all ${
                    activeProjectTag !== 'ANDROID' 
                      ? 'opacity-35 cursor-not-allowed text-on-surface/30'
                      : previewMode === 'mobilegym' 
                      ? 'bg-primary/20 text-primary border border-primary/30 font-bold cursor-pointer' 
                      : 'text-on-surface/40 hover:text-on-surface cursor-pointer'
                  }`}
                  title={activeProjectTag !== 'ANDROID' ? "安卓虚拟环境只能在安卓对话中绑定与使用" : "切换至安卓虚拟机镜像"}
                  translate="no"
                >
                  Android
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MODE A: STANDARD WEB VIEW MODE */}
        {/* ---------------------------------------------------- */}
        {previewMode === 'web' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-1 px-3 bg-surface-bright/45 border-b border-outline/30 flex items-center gap-2 shrink-0">
              <button className="text-on-surface/30 hover:text-on-surface font-mono text-[11px]">&larr;</button>
              <button className="text-on-surface/30 hover:text-on-surface font-mono text-[11px]">&rarr;</button>
              <button onClick={triggerHmr} className="text-on-surface/30 hover:text-on-surface font-mono text-[11px]">&#x21BB;</button>
              <div className="flex-1 bg-bg rounded px-2.5 py-0.5 border border-outline text-[10px] text-on-surface/50 font-mono overflow-hidden whitespace-nowrap select-all flex items-center gap-1.5">
                <Wifi className="w-2.5 h-2.5 text-green-500" />
                <span>http://localhost:5173</span>
              </div>
            </div>

            <div className="flex-1 bg-bg p-3.5 flex items-start justify-center overflow-auto relative scrollbar-thin">
              <div className={`${getWidthClass()} bg-[#111214] border border-[#222426]/80 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[480px] max-h-[580px] transition-all duration-300`}>
                <div className="bg-[#17181c] border-b border-[#222426]/60 p-3 flex items-center justify-between px-4">
                  <span 
                    onClick={() => { setSelectedPost(null); setActiveTab('home'); }}
                    className="font-display font-black text-xs text-white tracking-tight cursor-pointer hover:opacity-80"
                  >
                    {blogTitle}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-medium text-on-surface/60">
                    <span 
                      onClick={() => { setSelectedPost(null); setActiveTab('home'); }}
                      className={`cursor-pointer hover:text-white ${activeTab === 'home' && !selectedPost ? 'text-[#3b82f6]' : ''}`}
                    >
                      首页
                    </span>
                    <span className="cursor-pointer hover:text-white">文章</span>
                    <span className="cursor-pointer hover:text-white_80">分类</span>
                    <Search className="w-3 h-3 text-on-surface/40 hover:text-white cursor-pointer" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text scrollbar-thin">
                  {!selectedPost ? (
                    <>
                      <div className="bg-gradient-to-r from-[#203a43] to-[#2c5364] text-white p-5 rounded-lg text-center relative overflow-hidden flex flex-col justify-center items-center py-6 shadow-md border border-[#222426]/40">
                        <div className="absolute top-0 right-0 bg-[#e5c158]/20 text-[#ffe08b] text-[8px] font-mono font-bold px-2 py-0.5 rounded-bl">New Post</div>
                        <h2 className="text-sm font-extrabold tracking-wide mb-1 flex items-center gap-1 justify-center">
                          记录生活，分享技术
                        </h2>
                        <p className="text-[10px] text-white/70 max-w-[210px] leading-tight mb-3 text-center">
                          这里是我的技术博客，分享前端、后端、数据库等技术文章
                        </p>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-[#2c2f33] pb-1">
                          <span className="text-[11px] font-bold text-white tracking-wide">最新文章</span>
                        </div>

                        <div className="space-y-3">
                          {posts.map((post) => (
                            <div
                              key={post.id}
                              onClick={() => setSelectedPost(post)}
                              className="bg-[#17191d] hover:bg-[#1a1c22] border border-[#222426]/60 hover:border-[#ffe08b]/20 p-3 rounded-lg flex gap-3 transition-all cursor-pointer group"
                            >
                              <div className={`w-12 h-12 rounded-md bg-gradient-to-tr ${post.bg} shrink-0 opacity-80 group-hover:opacity-100 flex items-center justify-center font-bold text-[10px] text-white font-mono`}>
                                {post.category}
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <h3 className="text-xs font-bold text-white group-hover:text-primary transition-colors leading-snug truncate">
                                  {post.title}
                                </h3>
                                <p className="text-[10px] text-on-surface/50 line-clamp-2 leading-normal">
                                  {post.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 p-1">
                      <button onClick={() => setSelectedPost(null)} className="text-[10px] text-primary/80 hover:text-primary font-mono flex items-center gap-1 mb-2 cursor-pointer">
                        &larr; 返回首页
                      </button>
                      <h2 className="text-sm font-extrabold text-white leading-snug">{selectedPost.title}</h2>
                    </motion.div>
                  )}
                </div>
                <div className="bg-[#17181c] border-t border-[#222426]/60 p-2.5 text-center text-[9px] text-on-surface/30">
                  &copy; 2026 SoloDev Technology Blogs
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE B: MOBILEGYM EMULATOR & MONITORS VIEW */}
        {/* ---------------------------------------------------- */}
        {previewMode === 'mobilegym' && (
          <div 
            style={{ backgroundColor: activeTheme.bg }} 
            className="flex-grow flex flex-col overflow-hidden text-on-surface"
          >
            
            {/* Control panel & Profile switcher */}
            <div 
              style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }}
              className="p-2 border-b flex flex-col gap-1.5 shrink-0"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 bg-[var(--color-surface-bright)]/60 p-0.5 rounded border border-[var(--color-outline)]/25">
                  {DEVICE_PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPreset(p.id)}
                      className={`px-1.5 py-0.5 rounded text-[8.5px] font-sans transition-colors font-semibold select-none cursor-pointer ${
                        selectedDevice === p.id 
                          ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-bold' 
                          : 'text-[var(--color-on-surface)]/60 hover:text-[var(--color-on-surface)]'
                      }`}
                    >
                      {p.id === 'pixel8' ? '手机' : p.id === 'tablet' ? '平板' : '手表'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('soloforge-toggle-gym-monitor'));
                    }}
                    className="text-[9px] text-[var(--color-primary)] hover:text-[var(--color-primary)]/90 font-mono font-bold bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/15 px-1.5 py-0.5 rounded border border-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/30 flex items-center gap-1 cursor-pointer transition-all select-none"
                    title="点击可直接展开或最小化底层遥测监控"
                  >
                    <span className="w-1 h-1 bg-green-400 rounded-full animate-ping" />
                    <span>调试端口: {adbPort}</span>
                  </span>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('soloforge-toggle-gym-monitor', { detail: { open: true } }));
                    }}
                    className="text-[9px] text-[var(--color-primary)] hover:text-[var(--color-on-surface)] font-mono font-bold bg-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/25 px-2.5 py-0.5 rounded border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 duration-150"
                    title="显示或重开底层动作遥测和 CPU 监控监视器"
                  >
                    <Monitor className="w-3 h-3 text-[var(--color-primary)]" />
                    <span>打开监控</span>
                  </button>
                </div>
              </div>

              {/* Debug remote/mock URL setting */}
              <div className="flex items-center gap-1 text-[9px]">
                <span className="text-[var(--color-on-surface)]/50 font-sans">主控地址:</span>
                <input
                  type="text"
                  value={vmUrl}
                  onChange={(e) => setVmUrl(e.target.value)}
                  className="flex-1 bg-[var(--color-surface)]/85 border border-[var(--color-outline)]/25 rounded px-1.5 py-0.5 font-mono text-[var(--color-on-surface)] text-[8px] focus:outline-none focus:border-[var(--color-primary)]/60 shrink-0"
                />
                <button 
                  onClick={handleResetSimulator}
                  title="Reload sandbox container"
                  className="p-1 rounded hover:bg-[var(--color-on-surface)]/5 text-[var(--color-on-surface)]/75 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3 h-3 text-[var(--color-primary)]" />
                </button>
              </div>

              {/* Zooming / Scaling Slider */}
              <div className="flex items-center justify-between gap-1.5 border-t border-[var(--color-outline)]/10 pt-1 text-[9px] font-sans text-[var(--color-on-surface)]/50">
                <span className="flex items-center gap-1 text-[var(--color-primary)]/85"><Sliders className="w-2.5 h-2.5" /> 缩放比例:</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setScaleFactor(prev => Math.max(50, prev - 10))} 
                    className="hover:text-[var(--color-on-surface)] p-0.5 cursor-pointer"
                  >
                    <ZoomOut className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-[var(--color-on-surface)] text-[8.5px] font-bold w-10 text-center bg-[var(--color-surface-bright)]/60 border border-[var(--color-outline)]/15 rounded">{scaleFactor}%</span>
                  <button 
                    onClick={() => setScaleFactor(prev => Math.min(150, prev + 10))} 
                    className="hover:text-[var(--color-on-surface)] p-0.5 cursor-pointer"
                  >
                    <ZoomIn className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sandbox Render Outer Zone with Zoom style applied */}
            <div 
              style={{ backgroundColor: activeTheme.bg }}
              className="flex-grow flex-1 overflow-auto p-4 flex items-center justify-center relative scrollbar-thin border border-outline/20 m-2.5 rounded-2xl shadow-inner"
            >
              
              {/* Virtual Handset frame conforming to FLOATING PANEL / RESIZE STANDARD */}
              <div 
                style={{
                  width: `${phoneWidth * (scaleFactor / 100)}px`,
                  height: `${phoneHeight * (scaleFactor / 100)}px`,
                  transition: 'none'
                }}
                className="relative bg-black rounded-[28px] p-2 border-4 border-[#2b353f] shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col group select-none"
              >
                
                {/* 1. Android Status Bar Header Display */}
                <div className="h-6 w-full px-4 flex items-center justify-between text-[8px] font-sans text-on-surface/75 z-25 shrink-0">
                  <div className="font-semibold text-[8px] text-white">09:41</div>
                  <div className="w-16 h-3.5 bg-[#1b2126] rounded-full mx-auto" /> {/* Dynamic Island Capsule */}
                  <div className="flex items-center gap-1">
                    <Wifi className="w-2 h-2 text-green-400" />
                    <span className="text-[7.5px] font-mono text-[#ff8c00]">AVD</span>
                    <span className="font-extrabold text-[#10b981]">G</span>
                  </div>
                </div>

                {/* 2. Interactive App Viewport */}
                <div className="flex-grow w-full rounded-[18px] bg-[#121415] overflow-hidden relative border border-white/5">
                  
                  {/* Dynamic screenshot or active running iframe */}
                  <div className="absolute inset-0 pointer-events-auto select-none" style={{ background: '#121415' }}>
                    
                    {/* Render active mockup standard HTML viewport representing screenshot stream */}
                    <div className="w-full h-full text-white">
                      <SimulatedViewport 
                        type={(activeProjectTag === 'NEW' ? 'ANDROID' : activeProjectTag) as 'VUE' | 'AUTH' | 'AI' | 'ANDROID'} 
                        step={currentScreenshotIndex} 
                      />
                    </div>

                    {/* Interactive Click location pointer (Agent action visual feedback overlay, moves automatically) */}
                    {isAgentRunning && currentScreenshotIndex === 0 && (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        style={{ top: '180px', left: '120px' }}
                        className="absolute w-8 h-8 -ml-4 -mt-4 bg-red-500 rounded-full flex items-center justify-center z-30"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      </motion.div>
                    )}

                    {isAgentRunning && currentScreenshotIndex === 1 && (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        style={{ top: '312px', left: '210px' }}
                        className="absolute w-8 h-8 -ml-4 -mt-4 bg-red-500 rounded-full flex items-center justify-center z-30"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      </motion.div>
                    )}
                  </div>

                  {/* Glassmorphic watermark log overlay */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 bg-black/65 backdrop-blur border border-white/5 rounded p-1 px-1.5 z-28">
                    <div className="flex items-center justify-between">
                      <span className="text-[7.5px] font-mono text-[#ffe08b]">AVD VM Task Core</span>
                      <span className="text-[7px] text-[#ff8c00] font-mono uppercase bg-[#ff8c00]/5 px-1 rounded">RL Run</span>
                    </div>
                    <span className="text-[8px] font-bold text-white block truncate">{activeActionMsg}</span>
                  </div>

                  {/* Active Simulation Step Counter Badge */}
                  <div className="absolute bottom-2 left-2 bg-[#ff8c00] text-black text-[7px] font-black tracking-wide rounded px-1.5 py-0.5 font-mono z-28 shadow-md">
                    EPOCH STEP {activeStep}
                  </div>
                </div>

                {/* Android virtual button footer gap */}
                <div className="h-5 w-full flex items-center justify-center shrink-0">
                  <div className="w-18 h-1 rounded-full bg-white/40" />
                </div>

                {/* 3. FOUR CONSTRUCTIVE ACTIVE CORNER RESIZE TOUCHPOINTS - FLOATING PANEL DESIGN COMPLIANT */}
                {/* Each corner has clear visual handles, cursors & hover reactions */}
                
                {/* BOTTOM RIGHT DOUBLE RESIZER HANDLE */}
                <div 
                  onMouseDown={(e) => handlePhoneResizeStart(e, 'br')}
                  className="absolute bottom-2.5 right-2.5 w-6 h-6 z-50 cursor-nwse-resize select-none flex items-end justify-end group/handle p-1 active:scale-110 transition-transform"
                  title="拖动调整 Android 画面尺寸 (宽与高)"
                >
                  <div className="w-3.5 h-3.5 border-r-2 border-b-2 border-[#ff8c00] rounded-br-[6px] group-hover/handle:border-white transition-colors duration-150" />
                </div>

                {/* BOTTOM CORNER SINGLE SIZING HANDLE */}
                <div 
                  onMouseDown={(e) => handlePhoneResizeStart(e, 'b')}
                  className="absolute bottom-0 left-12 right-12 h-2.5 z-40 cursor-ns-resize select-none flex items-center justify-center group/bottom active:scale-y-110 transition-all"
                  title="拖动调整 Android 垂直高度"
                >
                  <div className="w-10 h-1 bg-[#ff8c00]/60 rounded-full group-hover/bottom:bg-white transition-colors" />
                </div>

                {/* RIGHT SIZING EXPANSION HANDLE */}
                <div 
                  onMouseDown={(e) => handlePhoneResizeStart(e, 'r')}
                  className="absolute right-0 top-12 bottom-12 w-2.5 z-40 cursor-ew-resize select-none flex items-center justify-center group/right active:scale-x-110 transition-all"
                  title="拖动调整 Android 水平宽度"
                >
                  <div className="h-10 w-1 bg-[#ff8c00]/60 rounded-full group-hover/right:bg-white transition-colors" />
                </div>
              </div>
            </div>

            {/* Micro Controls Action drawer */}
            <div 
              style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }}
              className="p-2.5 border-t flex items-center justify-between text-[10px] shrink-0 font-mono"
            >
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAgentRunning(!isAgentRunning)}
                  className={`px-2 py-1 rounded flex items-center gap-1 text-[9px] font-bold transition-all cursor-pointer ${isAgentRunning ? 'bg-[#ff5d5d]/20 text-[#ff5d5d] border border-[#ff5d5d]/30' : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'}`}
                >
                  {isAgentRunning ? (
                    <>
                      <Square className="w-2.5 h-2.5 fill-current" />
                      停止 RL 策略
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 fill-current" />
                      运行强化智能体
                    </>
                  )}
                </button>
              </div>

              <div className="text-on-surface/40 text-[8.5px] text-right">
                <span>Task: Instacart Shopping PPO</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
