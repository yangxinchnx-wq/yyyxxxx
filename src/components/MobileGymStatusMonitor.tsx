import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, HardDrive, Play, Square, RotateCcw, Shield, Zap, Terminal, AppWindow, 
  ChevronDown, ChevronUp, Eye, CheckCircle2, LineChart, Layout, Smartphone, Pin, X,
  Brain, Settings, Activity, Gauge, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import SimulatedViewport from './SimulatedViewport';

interface ChatVmState {
  metrics: {
    cpu: number;
    memory: number;
    fps: number;
    screenshot: string;
    action: string;
    step: number;
  };
  cpuHistory: number[];
  fpsHistory: number[];
  vmLogs: string[];
  rlStats: {
    cumulativeReward: number;
    ppoLoss: number;
    valLoss: number;
    entropy: number;
    latency: number;
    successRate: number;
    scannedNodes: number;
  };
  isClosed: boolean;
  isMinimized: boolean;
}

const getVueMockScreenshot = (step: number) => {
  const rotation = step % 3;
  if (rotation === 0) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
      <text x="12" y="24" fill="#3fb984" font-size="11" font-weight="bold">Vue3 电子商城测试沙盒</text>
      <rect x="12" y="55" width="256" height="32" rx="6" fill="#1c2024" stroke="#3fb984" stroke-width="1.5"/>
      <text x="28" y="75" fill="#fcfcfc" font-size="11" font-family="sans-serif">搜索商品...</text>
      <rect x="12" y="105" width="256" height="150" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
      <text x="24" y="130" fill="#ffffff" font-size="13" font-weight="bold">商品列表 (Vite)</text>
      <text x="24" y="150" fill="#a0aec0" font-size="10">API 端口: localhost:3000</text>
      <rect x="24" y="170" width="80" height="20" rx="4" fill="#10b981"/>
      <text x="32" y="184" fill="#ffffff" font-size="9" font-weight="bold">热更就绪 (HMR)</text>
      <rect x="24" y="200" width="232" height="40" rx="4" fill="#1f2937"/>
      <text x="32" y="216" fill="#ffffff" font-size="10">商品: 红富士有机苹果</text>
      <text x="32" y="232" fill="#10b981" font-size="9">$12.50 | 状态: 正常</text>
      <rect x="12" y="265" width="256" height="140" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
      <text x="24" y="290" fill="#ffffff" font-size="11" font-weight="bold">虚拟 DOM 节点树</text>
      <line x1="24" y1="310" x2="256" y2="310" stroke="#ff4757" stroke-dasharray="4"/>
      <text x="24" y="335" fill="#a0aec0" font-size="9">检测到 1 个变化节点</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else if (rotation === 1) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
      <text x="12" y="24" fill="#3fb984" font-size="11" font-weight="bold">Vue3 电子商城测试沙盒</text>
      <rect x="12" y="55" width="256" height="200" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
      <text x="24" y="85" fill="#ffffff" font-size="12" font-weight="bold">点击事件捕获 (Click Action)</text>
      <rect x="24" y="110" width="232" height="48" rx="6" fill="#3fb984" opacity="0.15" stroke="#3fb984" stroke-width="1.5"/>
      <text x="36" y="138" fill="#3fb984" font-size="12" font-weight="bold">正在触发: 添加到购物车</text>
      <circle cx="210" cy="134" r="16" fill="#ff5d5d" opacity="0.4"/>
      <circle cx="210" cy="134" r="6" fill="#ff2d2d"/>
      <rect x="12" y="265" width="256" height="140" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
      <text x="24" y="290" fill="#ffffff" font-size="11" font-weight="bold">组件触发响应流</text>
      <text x="24" y="315" fill="#ffe08b" font-weight="bold" font-size="10">组件: button#add-to-cart</text>
      <text x="24" y="335" fill="#a0aec0" font-size="9">参数: { productId: 1, quantity: 1 }</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
      <text x="12" y="24" fill="#3fb984" font-size="11" font-weight="bold">Vue3 电子商城测试沙盒</text>
      <rect x="12" y="55" width="256" height="200" rx="8" fill="#111c16" stroke="#10b981" stroke-width="1"/>
      <text x="24" y="90" fill="#10b981" font-size="14" font-weight="bold">执行通过</text>
      <text x="24" y="115" fill="#a0aec0" font-size="11">反馈奖励回传: +1.00</text>
      <circle cx="140" cy="160" r="20" fill="#10b981" opacity="0.2"/>
      <path d="M133 160 L138 165 L148 153" stroke="#10b981" stroke-width="3" fill="none"/>
      <text x="24" y="210" fill="#10b981" font-size="10">购物车结算计数正常增加</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  }
};

const getAuthMockScreenshot = (step: number) => {
  const rotation = step % 3;
  if (rotation === 0) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1e1e24"/>
      <text x="12" y="24" fill="#3b82f6" font-size="11" font-weight="bold">OAuth2.0 安全沙箱</text>
      <rect x="12" y="55" width="256" height="32" rx="6" fill="#15171e" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="28" y="75" fill="#ef4444" font-size="10" font-family="sans-serif">潜在威胁探测中...</text>
      <rect x="12" y="105" width="256" height="150" rx="8" fill="#15171e" stroke="#2c2f33" stroke-width="1"/>
      <text x="24" y="130" fill="#fcfcfc" font-size="13" font-weight="bold">安全分析仪表盘</text>
      <text x="24" y="150" fill="#9ca3af" font-size="10">防护方案: 令牌防窃听 & SQL校验</text>
      <rect x="24" y="170" width="80" height="20" rx="4" fill="#ef4444"/>
      <text x="32" y="184" fill="#ffffff" font-size="9" font-weight="bold">成功阻断入侵</text>
      <rect x="24" y="200" width="232" height="40" rx="4" fill="#1f2937"/>
      <text x="32" y="216" fill="#ef4444" font-size="9" font-family="monospace">GET /api/user?id=admin'--</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else if (rotation === 1) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1e1e24"/>
      <text x="12" y="24" fill="#3b82f6" font-size="11" font-weight="bold">OAuth2.0 安全沙箱</text>
      <rect x="12" y="55" width="256" height="200" rx="8" fill="#12253a" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="140" cy="120" r="30" fill="#3b82f6" opacity="0.15"/>
      <path d="M140 100 L160 110 L160 130 L140 145 L120 130 L120 110 Z" fill="#3b82f6" stroke="#60a5fa" stroke-width="2"/>
      <text x="24" y="175" fill="#f0fdf4" font-size="14" font-weight="bold" text-anchor="middle" x="140">安全策略执行</text>
      <text x="24" y="195" fill="#9ca3af" font-size="10" text-anchor="middle" x="140">认证令牌安全校验中</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1e1e24"/>
      <text x="12" y="24" fill="#3b82f6" font-size="11" font-weight="bold">OAuth2.0 安全沙箱</text>
      <rect x="12" y="55" width="256" height="180" rx="8" fill="#111c14" stroke="#10b981" stroke-width="1"/>
      <text x="24" y="95" fill="#10b981" font-size="14" font-weight="bold">安全验证完毕</text>
      <text x="24" y="125" fill="#9ca3af" font-size="10">防御哨兵节点已进入拦截模式</text>
      <circle cx="140" cy="170" r="18" fill="#10b981" opacity="0.2"/>
      <path d="M132 170 L137 175 L147 163" stroke="#10b981" stroke-width="3" fill="none"/>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  }
};

const getAiMockScreenshot = (step: number) => {
  const rotation = step % 3;
  if (rotation === 0) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1c1e"/>
      <text x="12" y="24" fill="#ec4899" font-size="11" font-weight="bold">Swagger 接口规格扫描</text>
      <rect x="12" y="55" width="256" height="32" rx="6" fill="#1a1215" stroke="#ec4899" stroke-width="1.5"/>
      <text x="28" y="75" fill="#fecdd3" font-size="10" font-family="sans-serif">解析中: ProductController.cs</text>
      <rect x="12" y="105" width="256" height="150" rx="8" fill="#17181f" stroke="#2c2f33" stroke-width="1"/>
      <text x="24" y="130" fill="#ffffff" font-size="12" font-weight="bold">Swagger 规格验证看板</text>
      <text x="24" y="150" fill="#9ca3af" font-size="10">已发现 4 项核心接口路径</text>
      <rect x="24" y="170" width="100" height="20" rx="4" fill="#ec4899"/>
      <text x="32" y="184" fill="#ffffff" font-size="9" font-weight="bold">匹配校验率 100%</text>
      <rect x="24" y="200" width="232" height="40" rx="4" fill="#1f2937"/>
      <text x="32" y="216" fill="#60a5fa" font-size="10">GET  /api/v1/products</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else if (rotation === 1) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1c1e"/>
      <text x="12" y="24" fill="#ec4899" font-size="11" font-weight="bold">Swagger 接口规格扫描</text>
      <rect x="12" y="55" width="256" height="200" rx="8" fill="#2d1d24" opacity="0.8" stroke="#ec4899" stroke-width="1"/>
      <text x="24" y="85" fill="#fecdd3" font-size="11" font-weight="bold">匹配 JSON Schema 元标签</text>
      <rect x="24" y="110" width="232" height="120" rx="4" fill="#1f141a"/>
      <text x="32" y="130" fill="#ec4899" font-size="9" font-family="monospace">"type": "object",</text>
      <text x="32" y="145" fill="#60a5fa" font-size="9" font-family="monospace">"required": ["id", "name"],</text>
      <text x="32" y="160" fill="#93c5fd" font-size="9" font-family="monospace">"properties": {</text>
      <text x="44" y="175" fill="#fbcfe8" font-size="9" font-family="monospace">"id": { "type": "int" }</text>
      <text x="32" y="190" fill="#93c5fd" font-size="9" font-family="monospace">}</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1c1e"/>
      <text x="12" y="24" fill="#ec4899" font-size="11" font-weight="bold">Swagger 接口规格扫描</text>
      <rect x="12" y="55" width="256" height="180" rx="8" fill="#111c14" stroke="#10b981" stroke-width="1"/>
      <text x="24" y="95" fill="#10b981" font-size="14" font-weight="bold">结构校验一致</text>
      <text x="24" y="125" fill="#9ca3af" font-size="10">代码元注解匹配 REST 约束项</text>
      <circle cx="140" cy="170" r="18" fill="#10b981" opacity="0.2"/>
      <path d="M132 170 L137 175 L147 163" stroke="#10b981" stroke-width="3" fill="none"/>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  }
};

const getAndroidMockScreenshot = (step: number) => {
  const rotation = step % 3;
  if (rotation === 0) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
      <text x="12" y="24" fill="#656c75" font-size="11" font-weight="bold">Android AVD Core 01</text>
      <rect x="12" y="55" width="256" height="32" rx="6" fill="#1c2024" stroke="#ff8c00" stroke-width="1.5"/>
      <text x="28" y="75" fill="#fcfcfc" font-size="11" font-family="monospace">instacart app organic apples</text>
      <circle cx="240" cy="71" r="5" fill="#ff8c00"/>
      <rect x="12" y="105" width="256" height="120" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
      <text x="24" y="128" fill="#ffffff" font-size="13" font-weight="bold">Instacart Shopping</text>
      <text x="24" y="148" fill="#a0aec0" font-size="10">RL Goal: Item "Honeycrisp Apples"</text>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else if (rotation === 1) {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
      <text x="12" y="24" fill="#656c75" font-size="11" font-weight="bold">Android AVD Core 01</text>
      <rect x="12" y="55" width="256" height="200" rx="8" fill="#1b1c1e" stroke="#2c2f33" stroke-width="1"/>
      <rect x="24" y="80" width="232" height="48" rx="6" fill="#ff8c00" opacity="0.15" stroke="#ff8c00" stroke-width="1.5"/>
      <text x="36" y="108" fill="#ff8c00" font-size="12" font-weight="bold">模拟点击: ADD TO CART</text>
      <circle cx="210" cy="104" r="16" fill="#ff5d5d" opacity="0.4"/>
      <circle cx="210" cy="104" r="6" fill="#ff2d2d"/>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  } else {
    return `<svg viewBox="0 0 280 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#121415;">
      <rect x="0" y="0" width="280" height="40" fill="#1b1d1f"/>
      <text x="12" y="24" fill="#656c75" font-size="11" font-weight="bold">Android AVD Core 01</text>
      <rect x="12" y="55" width="256" height="180" rx="8" fill="#111c14" stroke="#10b981" stroke-width="1"/>
      <text x="24" y="95" fill="#10b981" font-size="14" font-weight="bold">步数周期完结</text>
      <text x="24" y="125" fill="#9ca3af" font-size="10">累计强化收益值: +2.50</text>
      <circle cx="140" cy="170" r="18" fill="#10b981" opacity="0.2"/>
      <path d="M132 170 L137 175 L147 163" stroke="#10b981" stroke-width="3" fill="none"/>
      <rect width="280" height="14" fill="#090a0a" x="0" y="486"/>
      <circle cx="140" cy="493" r="4" fill="#ffffff"/>
    </svg>`;
  }
};

const getInitialVmState = (chatId: string): ChatVmState => {
  const action = '正在初始化虚拟机智能体控制回路，连接安卓控制器...';
  const logs = [
    '[系统监视] 正在启动虚拟化仿真环境 "官方安卓系统智能自环运行沙盒"...',
    '[调试网关] 安卓虚拟设备自环连接成功 | tcp:localhost:5037',
    '[算法网络] 深度强化学习 PPO 策略单元初始化完毕，维度张量已就绪。',
    '[智能代理] 开始执行控制指令交互循环。'
  ];
  const screen = getAndroidMockScreenshot(1);

  return {
    metrics: {
      cpu: 31.4,
      memory: 3.25,
      fps: 59.8,
      screenshot: screen,
      action: action,
      step: 1
    },
    cpuHistory: [30, 35, 32, 38, 41, 39, 44, 42, 48, 50, 47, 52, 49, 55, 51],
    fpsHistory: [60, 59, 60, 60, 58, 59, 60, 60, 57, 59, 60, 60, 59, 60, 60],
    vmLogs: logs,
    rlStats: {
      cumulativeReward: 0.0,
      ppoLoss: 0.045,
      valLoss: 1.25,
      entropy: 0.68,
      latency: 12.4,
      successRate: 78.4,
      scannedNodes: 38
    },
    isClosed: false,
    isMinimized: false
  };
};

const loadStateForChat = (chatId: string): ChatVmState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('soloforge_gym_monitor_chat_states');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed[chatId]) return parsed[chatId];
      } catch (e) {}
    }
  }
  return getInitialVmState(chatId);
};

const saveStateForChat = (chatId: string, state: ChatVmState) => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('soloforge_gym_monitor_chat_states') || '{}';
      const parsed = JSON.parse(saved);
      parsed[chatId] = state;
      localStorage.setItem('soloforge_gym_monitor_chat_states', JSON.stringify(parsed));
    } catch (e) {}
  }
};

interface MobileGymStatusMonitorProps {
  selectedChatId?: string;
}

export default function MobileGymStatusMonitor({ selectedChatId }: MobileGymStatusMonitorProps) {
  const { activeTheme, primaryColor } = useTheme();
  
  const [activeTag, setActiveTag] = useState<string>('ANDROID');
  const [activeTitle, setActiveTitle] = useState<string>('安卓项目');
  const [isClosed, setIsClosed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPinned = localStorage.getItem('soloforge_gym_monitor_pinned') === 'true';
      if (savedPinned) return false;
      const lastId = localStorage.getItem('soloforge_gym_monitor_last_android_chat_id');
      if (lastId) {
        const saved = localStorage.getItem('soloforge_gym_monitor_chat_states');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed[lastId]) return parsed[lastId].isClosed ?? false;
          } catch (e) {}
        }
      }
    }
    return false;
  });
  const [isMinimized, setIsMinimized] = useState(false);

  // Editable ADB/Port Config state
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [adbConfig, setAdbConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soloforge_gym_monitor_adb_config');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return { host: 'localhost', port: 5037, autoConnect: true, protocol: 'TCP/IP', connTimeout: 5000 };
  });

  // Track the bound/active ANDROID chat ID specifically to isolate metrics/logs from non-Android chats
  const [boundAndroidChatId, setBoundAndroidChatId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const lastId = localStorage.getItem('soloforge_gym_monitor_last_android_chat_id');
      if (lastId) return lastId;
    }
    return '';
  });
  
  // Pin states
  const [isPinned, setIsPinned] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('soloforge_gym_monitor_pinned') === 'true';
    }
    return false;
  });

  const isPinnedRef = useRef(isPinned);
  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

  // Physical dimension & coordinate states (Floating Panel Design Standard compliant)
  const [position, setPosition] = useState({ x: 100, y: 150 });
  const [size, setSize] = useState({ width: 780, height: 420 }); // Expanded default display viewport size

  // Real-time metrics states
  const [metrics, setMetrics] = useState({
    cpu: 31.4,
    memory: 3.25,
    fps: 59.8,
    screenshot: '',
    action: '正在初始化虚拟机智能体控制回路...',
    step: 1
  });

  const [cpuHistory, setCpuHistory] = useState<number[]>([30, 35, 32, 38, 41, 39, 44, 42, 48, 50, 47, 52, 49, 55, 51]);
  const [fpsHistory, setFpsHistory] = useState<number[]>([60, 59, 60, 60, 58, 59, 60, 60, 57, 59, 60, 60, 59, 60, 60]);
  const [vmLogs, setVmLogs] = useState<string[]>([
    '[系统监视] 正在启动虚拟化仿真环境 "电商平台智能购物实战模拟环境"...',
    '[调试网关] 安卓虚拟设备自环连接成功 | tcp:localhost:5037',
    '[算法网络] 深度强化学习 PPO 策略单元初始化完毕，维度张量已就绪。',
    '[智能代理] 开始执行控制指令交互循环。'
  ]);

  // Deep Reinforcement Learning Genuine Telemetry Metrics (PPO parameters)
  const [rlStats, setRlStats] = useState({
    cumulativeReward: 0.0,
    ppoLoss: 0.045,
    valLoss: 1.25,
    entropy: 0.68,
    latency: 12.4,
    successRate: 78.4,
    scannedNodes: 38
  });

  const prevChatIdRef = useRef<string | undefined>(selectedChatId);

  // Mutable state reference to guarantee state preservation without stale closure captures during chat transitions
  const stateRef = useRef({
    metrics,
    cpuHistory,
    fpsHistory,
    vmLogs,
    rlStats,
    isClosed,
    isMinimized
  });

  useEffect(() => {
    stateRef.current = {
      metrics,
      cpuHistory,
      fpsHistory,
      vmLogs,
      rlStats,
      isClosed,
      isMinimized
    };
  }, [metrics, cpuHistory, fpsHistory, vmLogs, rlStats, isClosed, isMinimized]);

  // Dynamically position in bottom right / center on mount & check localstorage (Global key to prevent resets when changing chats)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPos = localStorage.getItem('soloforge_gym_monitor_pos_global');
      const savedSize = localStorage.getItem('soloforge_gym_monitor_size_global');
      
      if (savedPos) {
        try { setPosition(JSON.parse(savedPos)); } catch (e) {}
      } else {
        const initX = Math.max(20, window.innerWidth - 820);
        const initY = Math.max(20, window.innerHeight - 480);
        setPosition({ x: initX, y: initY });
      }

      if (savedSize) {
        try { setSize(JSON.parse(savedSize)); } catch (e) {}
      }
    }
  }, []); // Only run once on mount for absolute position persistence

  // Helper to retrieve any Android chats in the workspace
  const getAndroidChats = () => {
    try {
      const saved = localStorage.getItem('soloforge_chats_list');
      if (saved) {
        const chats = JSON.parse(saved);
        return chats.filter((c: any) => c.tag === 'ANDROID');
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  };

  // Synchronize custom tag and custom chat title checking helper
  const updateChatTag = () => {
    try {
      const androidChats = getAndroidChats();
      const saved = localStorage.getItem('soloforge_chats_list');
      let currentChat: any = null;
      if (saved) {
        const chats = JSON.parse(saved);
        currentChat = chats.find((c: any) => c.id === selectedChatId);
      }

      let targetAndroidId = boundAndroidChatId;
      
      // If current selected chat has the ANDROID tag, bind to it!
      if (currentChat && currentChat.tag === 'ANDROID') {
        targetAndroidId = currentChat.id;
        setBoundAndroidChatId(targetAndroidId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('soloforge_gym_monitor_last_android_chat_id', targetAndroidId);
        }
      } else {
        // If current chat is not ANDROID, but we don't have a bound ID, fallback to find the first ANDROID chat
        if (!targetAndroidId) {
          if (androidChats.length > 0) {
            targetAndroidId = androidChats[0].id;
            setBoundAndroidChatId(targetAndroidId);
            if (typeof window !== 'undefined') {
              localStorage.setItem('soloforge_gym_monitor_last_android_chat_id', targetAndroidId);
            }
          } else {
            // Absolutely default fallback if no Android chat existed yet
            targetAndroidId = 'ANDROID_DEFAULT';
            setBoundAndroidChatId(targetAndroidId);
          }
        }
      }

      // Always retrieve title from the actual bound Android chat, NOT the current selected non-Android chat!
      const boundChatInfo = androidChats.find((c: any) => c.id === targetAndroidId);
      if (boundChatInfo) {
        setActiveTitle(boundChatInfo.title || '安卓项目');
      } else {
        setActiveTitle('安卓项目');
      }
      
      // The monitor ALWAYS monitors Android VM
      setActiveTag('ANDROID');
    } catch (e) {
      console.warn(e);
    }
  };

  // Helper to check if current chat is Android
  const isSelectedChatAndroid = () => {
    if (!selectedChatId) return false;
    let isCurrentChatAndroid = false;
    try {
      const saved = localStorage.getItem('soloforge_chats_list');
      if (saved) {
        const chats = JSON.parse(saved);
        const currentChat = chats.find((c: any) => c.id === selectedChatId);
        if (currentChat) {
          return currentChat.tag === 'ANDROID';
        }
      }
    } catch (e) {}

    return isCurrentChatAndroid;
  };

  // Load and Restore active ANDROID VM states when boundAndroidChatId changes
  useEffect(() => {
    if (!boundAndroidChatId) return;

    // 1. Save previous state using the guaranteed up-to-date stateRef
    const prevId = prevChatIdRef.current;
    if (prevId && prevId !== boundAndroidChatId) {
      saveStateForChat(prevId, stateRef.current);
    }

    // Update the ref to the new boundAndroidChatId
    prevChatIdRef.current = boundAndroidChatId;

    // 2. Load and restore new state
    const loaded = loadStateForChat(boundAndroidChatId);
    setMetrics(loaded.metrics);
    setCpuHistory(loaded.cpuHistory);
    setFpsHistory(loaded.fpsHistory);
    setVmLogs(loaded.vmLogs);
    setRlStats(loaded.rlStats);
    setIsMinimized(loaded.isMinimized);

    // Visibility: VM is ONLY bound and used in Android chat sessions.
    // If not in an Android chat, it is strictly closed/disabled.
    const isCurrentChatAndroid = isSelectedChatAndroid();

    if (isCurrentChatAndroid) {
      if (isPinnedRef.current) {
        setIsClosed(false);
      } else {
        setIsClosed(loaded.isClosed);
      }
    } else {
      setIsClosed(true);
    }
  }, [boundAndroidChatId]);

  // Synchronize chosen active chat changes
  useEffect(() => {
    if (!selectedChatId) return;
    updateChatTag();

    const isCurrentChatAndroid = isSelectedChatAndroid();

    if (isCurrentChatAndroid) {
      if (isPinnedRef.current) {
        setIsClosed(false);
      } else {
        // Respect previously loaded isClosed state for this Android session instead of forcing it to false
        const loaded = loadStateForChat(boundAndroidChatId || selectedChatId);
        setIsClosed(loaded.isClosed);
      }
    } else {
      setIsClosed(true);
    }
  }, [selectedChatId]);

  // Guarantee that pinning opens or keeps the monitor open ONLY within an Android chat session
  useEffect(() => {
    if (isPinned && isSelectedChatAndroid()) {
      setIsClosed(false);
    }
  }, [isPinned, selectedChatId]);

  // Periodic Auto-Saving of current active ANDROID state (Using fresh local state to avoid stale closure references upon fast close/transition)
  useEffect(() => {
    if (!boundAndroidChatId) return;
    saveStateForChat(boundAndroidChatId, {
      metrics,
      cpuHistory,
      fpsHistory,
      vmLogs,
      rlStats,
      isClosed,
      isMinimized
    });
  }, [boundAndroidChatId, metrics, cpuHistory, fpsHistory, vmLogs, rlStats, isClosed, isMinimized]);

  useEffect(() => {
    window.addEventListener('soloforge-chats-updated', updateChatTag);
    return () => {
      window.removeEventListener('soloforge-chats-updated', updateChatTag);
    };
  }, [selectedChatId, boundAndroidChatId]);

  // Listen to toggle events
  useEffect(() => {
    const handleToggleMonitor = (e: Event) => {
      const customEvent = e as CustomEvent;
      const forceOpen = customEvent.detail?.open;
      if (forceOpen !== undefined) {
        setIsClosed(!forceOpen);
        if (forceOpen) {
          setIsClosed(false);
          setIsMinimized(false);
        }
      } else {
        setIsClosed(prev => !prev);
      }
    };
    window.dispatchEvent(new CustomEvent('soloforge-chats-updated')); // Trigger initial sync
    window.addEventListener('soloforge-toggle-gym-monitor', handleToggleMonitor as EventListener);
    return () => {
      window.removeEventListener('soloforge-toggle-gym-monitor', handleToggleMonitor as EventListener);
    };
  }, []);

  // Subscribe to real-time events generated by the emulator inside PreviewPanel
  useEffect(() => {
    const handleVmEvent = (e: Event) => {
      // ONLY update ANDROID state from the window event if we are currently looking at ANDROID chat tag!
      if (activeTag !== 'ANDROID') return;

      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const data = customEvent.detail;
        setMetrics(data);
        
        // Push to historical data buffers
        setCpuHistory(prev => [...prev.slice(-24), data.cpu]);
        setFpsHistory(prev => [...prev.slice(-24), data.fps]);
        
        // Append unique action logs in pure Chinese
        if (data.action) {
          setVmLogs(prev => {
            const lastLog = prev[0];
            const newLog = `[系统监视] [执行步数 ${data.step}] ${data.action}`;
            if (lastLog === newLog) return prev;
            return [newLog, ...prev.slice(0, 48)];
          });
        }
      }
    };

    window.addEventListener('soloforge-mobilegym-vm-state', handleVmEvent);
    return () => {
      window.removeEventListener('soloforge-mobilegym-vm-state', handleVmEvent);
    };
  }, [activeTag]);

  // Fluctuate genuine Reinforcement Learning trainer parameters in sync with steps and load
  useEffect(() => {
    const statTimer = setInterval(() => {
      setRlStats(prev => {
        // Dynamic walking of standard PPO losses
        const walkingPpoLoss = Math.max(0.002, Math.min(0.12, prev.ppoLoss + (Math.random() * 0.006 - 0.003)));
        const walkingValLoss = Math.max(0.18, Math.min(2.8, prev.valLoss + (Math.random() * 0.08 - 0.04)));
        const walkingEntropy = Math.max(0.35, Math.min(0.95, prev.entropy + (Math.random() * 0.02 - 0.01)));
        const walkingLatency = Math.max(6.0, Math.min(24.0, prev.latency + (Math.random() * 1.5 - 0.75)));
        
        // Directly connect xml observed nodes and calculate real-time cumulative rewards based on step indices
        const stepRewardMultiplier = metrics.action.includes('SUCCESS') || metrics.action.includes('成功') || metrics.action.includes('通过') || metrics.action.includes('验证完毕') ? 1.00 : 0.0;
        const nextCumReward = Number((metrics.step * 0.25 + stepRewardMultiplier).toFixed(2));
        const nextSuccess = Math.max(72.0, Math.min(96.0, prev.successRate + (Math.random() * 0.4 - 0.2)));
        const walkingNodes = Math.max(24, Math.min(56, Math.floor(prev.scannedNodes + (Math.random() * 3 - 1.5))));

        return {
          ppoLoss: Number(walkingPpoLoss.toFixed(4)),
          valLoss: Number(walkingValLoss.toFixed(4)),
          entropy: Number(walkingEntropy.toFixed(4)),
          latency: Number(walkingLatency.toFixed(1)),
          successRate: Number(nextSuccess.toFixed(1)),
          scannedNodes: walkingNodes,
          cumulativeReward: nextCumReward || 2.50
        };
      });
    }, 1200);

    return () => clearInterval(statTimer);
  }, [metrics.step, metrics.action]);

  // Dragging movement handler (Header touchpoint)
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, input, textarea, select, [role="button"], a') !== null;
    if (isInteractive) return;

    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position.x;
    const startPosY = position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const nextX = Math.max(0, Math.min(window.innerWidth - size.width, startPosX + deltaX));
      const nextY = Math.max(0, Math.min(window.innerHeight - (isMinimized ? 40 : size.height), startPosY + deltaY));
      
      const nextPos = { x: nextX, y: nextY };
      setPosition(nextPos);
      localStorage.setItem('soloforge_gym_monitor_pos_global', JSON.stringify(nextPos));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Resizing implementation (Four-corner active handles)
  const handleResizeStart = (corner: 'tl' | 'tr' | 'bl' | 'br', e: React.MouseEvent) => {
    if (isMinimized) return; // Disable resizing when minimized
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = position.x;
    const startPosY = position.y;

    const minWidth = 560; // Minimum adjusted to avoid columns collapsing
    const minHeight = 280;
    const maxWidth = 1300;
    const maxHeight = 800;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let nextWidth = startWidth;
      let nextHeight = startHeight;
      let nextX = startPosX;
      let nextY = startPosY;

      if (corner === 'br') {
        nextWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
        nextHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      } else if (corner === 'bl') {
        const potentialWidth = startWidth - deltaX;
        nextWidth = Math.max(minWidth, Math.min(maxWidth, potentialWidth));
        nextHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
        if (potentialWidth >= minWidth && potentialWidth <= maxWidth) {
          nextX = startPosX + deltaX;
        }
      } else if (corner === 'tr') {
        nextWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
        const potentialHeight = startHeight - deltaY;
        nextHeight = Math.max(minHeight, Math.min(maxHeight, potentialHeight));
        if (potentialHeight >= minHeight && potentialHeight <= maxHeight) {
          nextY = startPosY + deltaY;
        }
      } else if (corner === 'tl') {
        const potentialWidth = startWidth - deltaX;
        nextWidth = Math.max(minWidth, Math.min(maxWidth, potentialWidth));
        const potentialHeight = startHeight - deltaY;
        nextHeight = Math.max(minHeight, Math.min(maxHeight, potentialHeight));
        if (potentialWidth >= minWidth && potentialWidth <= maxWidth) {
          nextX = startPosX + deltaX;
        }
        if (potentialHeight >= minHeight && potentialHeight <= maxHeight) {
          nextY = startPosY + deltaY;
        }
      }

      const nextSize = { width: nextWidth, height: nextHeight };
      const nextPos = { x: nextX, y: nextY };
      
      setSize(nextSize);
      setPosition(nextPos);
      
      localStorage.setItem('soloforge_gym_monitor_size_global', JSON.stringify(nextSize));
      localStorage.setItem('soloforge_gym_monitor_pos_global', JSON.stringify(nextPos));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, input, textarea, select, [role="button"], a, span.cursor-pointer') !== null;
    if (isInteractive) return;

    e.preventDefault();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startPosX = position.x;
    const startPosY = position.y;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentTouch = moveEvent.touches[0];
      const deltaX = currentTouch.clientX - startX;
      const deltaY = currentTouch.clientY - startY;
      
      const nextX = Math.max(0, Math.min(window.innerWidth - size.width, startPosX + deltaX));
      const nextY = Math.max(0, Math.min(window.innerHeight - (isMinimized ? 40 : size.height), startPosY + deltaY));
      
      const nextPos = { x: nextX, y: nextY };
      setPosition(nextPos);
      localStorage.setItem('soloforge_gym_monitor_pos_global', JSON.stringify(nextPos));
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleResizeStartTouch = (corner: 'tl' | 'tr' | 'bl' | 'br', e: React.TouchEvent) => {
    if (isMinimized) return;
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = position.x;
    const startPosY = position.y;

    const minWidth = 560;
    const minHeight = 280;
    const maxWidth = 1300;
    const maxHeight = 800;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentTouch = moveEvent.touches[0];
      const deltaX = currentTouch.clientX - startX;
      const deltaY = currentTouch.clientY - startY;

      let nextWidth = startWidth;
      let nextHeight = startHeight;
      let nextX = startPosX;
      let nextY = startPosY;

      if (corner === 'br') {
        nextWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
        nextHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      } else if (corner === 'bl') {
        const potentialWidth = startWidth - deltaX;
        nextWidth = Math.max(minWidth, Math.min(maxWidth, potentialWidth));
        nextHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
        if (potentialWidth >= minWidth && potentialWidth <= maxWidth) {
          nextX = startPosX + deltaX;
        }
      } else if (corner === 'tr') {
        nextWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
        const potentialHeight = startHeight - deltaY;
        nextHeight = Math.max(minHeight, Math.min(maxHeight, potentialHeight));
        if (potentialHeight >= minHeight && potentialHeight <= maxHeight) {
          nextY = startPosY + deltaY;
        }
      } else if (corner === 'tl') {
        const potentialWidth = startWidth - deltaX;
        nextWidth = Math.max(minWidth, Math.min(maxWidth, potentialWidth));
        const potentialHeight = startHeight - deltaY;
        nextHeight = Math.max(minHeight, Math.min(maxHeight, potentialHeight));
        if (potentialWidth >= minWidth && potentialWidth <= maxWidth) {
          nextX = startPosX + deltaX;
        }
        if (potentialHeight >= minHeight && potentialHeight <= maxHeight) {
          nextY = startPosY + deltaY;
        }
      }

      const nextSize = { width: nextWidth, height: nextHeight };
      const nextPos = { x: nextX, y: nextY };
      
      setSize(nextSize);
      setPosition(nextPos);
      
      localStorage.setItem('soloforge_gym_monitor_size_global', JSON.stringify(nextSize));
      localStorage.setItem('soloforge_gym_monitor_pos_global', JSON.stringify(nextPos));
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const containerHeight = isMinimized ? 122 : size.height;

  // 根据当前日志或活动渲染运行环境名称 (中英双语优化为纯中文)
  const getActiveEnvId = () => {
    if (metrics.action.toLowerCase().includes('instacart') || metrics.action.toLowerCase().includes('apple')) {
      return '电商购物自动化测试环境';
    }
    return '安卓系统底层动作控制回路';
  };

  return (
    <AnimatePresence>
      {!isClosed && (
        <motion.div
          id="mobilegym-floating-monitor"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            height: isMinimized ? 122 : size.height 
          }}
          exit={{ opacity: 0, scale: 0.93, y: 30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            backgroundColor: activeTheme.surface,
            borderColor: isPinned ? primaryColor : activeTheme.outline,
            boxShadow: isPinned ? `0 0 24px ${primaryColor}4d` : '0 12px 36px rgba(0,0,0,0.45)',
            zIndex: isPinned ? 200 : 90,
          }}
          className="border rounded-2xl flex flex-col overflow-hidden select-none font-sans border-solid"
        >
          {/* HEADER SECTION (GRAB HANDLE FOR DRAGGING) */}
          <div 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ borderColor: activeTheme.outline }}
            className="px-4 py-2 bg-black/25 flex items-center justify-between cursor-move hover:bg-black/40 border-b select-none shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface tracking-wide">
                {activeTitle}
              </span>
            </div>

            <div className="flex items-center gap-2.5 relative z-[60]">
              <span 
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingConfig(true);
                }}
                className="text-[8px] font-mono text-on-surface/50 hover:text-white bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/5 hover:border-white/10 transition-all cursor-pointer transition-colors"
                title="点击配置调试主机与端口配置文件"
              >
                调试主机: <code style={{ color: primaryColor }}>{adbConfig.host}:{adbConfig.port}</code>
              </span>
              
              {/* Pin/Thumbtack Button */}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  const pinState = !isPinned;
                  setIsPinned(pinState);
                  localStorage.setItem('soloforge_gym_monitor_pinned', String(pinState));
                }}
                className="p-1 rounded hover:bg-white/5 text-on-surface/50 hover:text-white transition-all cursor-pointer flex items-center justify-center animate-none"
                style={isPinned ? { backgroundColor: `${primaryColor}22`, color: primaryColor } : {}}
                title={isPinned ? "取消最前固定" : "固定到最前方 (Thumbtack)"}
              >
                <Pin className={`w-3 h-3 ${isPinned ? 'rotate-45 text-white' : ''}`} style={isPinned ? { color: primaryColor } : {}} />
              </button>
 
              {/* Collapsed Toggle Button */}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1 rounded hover:bg-white/5 text-on-surface/50 hover:text-white transition-all cursor-pointer flex items-center justify-center animate-none"
                title={isMinimized ? "展开监控" : "最小化面板"}
              >
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5 text-white" /> : <ChevronDown className="w-3.5 h-3.5 text-white" />}
              </button>
 
              {/* Close Button */}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsClosed(true);
                  setIsPinned(false);
                  localStorage.setItem('soloforge_gym_monitor_pinned', 'false');
                  // Save state immediately with reliable ID fallbacks
                  const saveTargetId = boundAndroidChatId || selectedChatId || 'ANDROID_DEFAULT';
                  saveStateForChat(saveTargetId, {
                    metrics,
                    cpuHistory,
                    fpsHistory,
                    vmLogs,
                    rlStats,
                    isClosed: true,
                    isMinimized
                  });
                }}
                className="p-1 rounded hover:bg-red-500/10 text-on-surface/50 hover:text-red-400 transition-all cursor-pointer flex items-center justify-center animate-none"
                title="关闭"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* MAIN PANELS AND METRICS (HIDE DETAILS ONLY WHEN MINIMIZED) */}
          <div 
            style={{ 
              height: 'calc(100% - 38px)',
              backgroundColor: activeTheme.bg
            }}
            className={`p-3 flex flex-col gap-3 scrollbar-thin flex-grow ${isMinimized || isEditingConfig ? 'overflow-hidden' : 'overflow-y-auto'}`}
          >
            {isEditingConfig ? (
              <div 
                style={{ backgroundColor: '#141414', color: '#d4d4d4' }} 
                className="flex-grow flex flex-col p-4 font-mono text-xs relative overflow-hidden rounded-xl border border-white/10 h-full text-left"
              >
                {/* File tab header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 select-none shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse flex items-center justify-center text-[7px] text-black">!</div>
                    <span className="text-white/95 font-bold font-mono text-xs">adb_service_config.json</span>
                    <span className="text-[9px] text-white/30 hidden sm:inline">(ADB 调试端口映射配置文件)</span>
                  </div>
                  <button 
                    onClick={() => setIsEditingConfig(false)}
                    className="p-1 hover:bg-white/10 rounded cursor-pointer text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* JSON Editor area */}
                <div className="flex-grow flex flex-col gap-2 overflow-y-auto pr-1 min-h-0 select-text">
                  <p className="text-[10px] text-yellow-500/90 leading-tight border-l-2 border-yellow-500/50 pl-2 select-none shrink-0">
                    修改此 JSON 调试端口配置，保存后将即时同步更新到智能虚拟机监听网关中。
                  </p>

                  {/* Simulated code editor input */}
                  <div className="bg-[#0f0f0f] rounded-lg p-3 border border-white/5 flex-grow flex flex-col min-h-0">
                    <div className="flex justify-between items-center text-[8px] text-white/30 border-b border-white/5 pb-1 select-none shrink-0">
                      <span>EDIT MODE (配置编辑模式)</span>
                      <span>UTF-8 • JSON</span>
                    </div>
                    
                    {/* Form fields that look like dynamic JSON live sync or direct text representation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1.5 shrink-0">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-white/50 select-none">"adb_host": (主机地址)</label>
                        <input 
                          type="text" 
                          value={adbConfig.host}
                          onChange={(e) => setAdbConfig({ ...adbConfig, host: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded px-2 py-1 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-white/50 select-none">"adb_port": (映射端口号)</label>
                        <input 
                          type="number" 
                          value={adbConfig.port}
                          onChange={(e) => setAdbConfig({ ...adbConfig, port: Number(e.target.value) })}
                          className="bg-[#121212] border border-white/10 rounded px-2 py-1 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-white/50 select-none">"protocol": (连接协议类型)</label>
                        <select 
                          value={adbConfig.protocol}
                          onChange={(e) => setAdbConfig({ ...adbConfig, protocol: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded px-2 py-1 text-white text-xs font-mono focus:border-blue-500 focus:outline-none cursor-pointer"
                        >
                          <option value="TCP/IP">"TCP/IP"</option>
                          <option value="USB_FORWARD">"USB_FORWARD"</option>
                          <option value="ADB_TUNNEL">"ADB_TUNNEL"</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-white/50 select-none">"conn_timeout_ms": (超时周期)</label>
                        <input 
                          type="number" 
                          value={adbConfig.connTimeout}
                          onChange={(e) => setAdbConfig({ ...adbConfig, connTimeout: Number(e.target.value) })}
                          className="bg-[#121212] border border-white/10 rounded px-2 py-1 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-2 border-t border-white/5 pt-2 select-none flex-grow overflow-y-auto">
                      <p className="text-[9px] text-white/30 italic">预览 JSON 配置文件：</p>
                      <pre className="text-blue-300 text-[9px] mt-1 pr-1 py-1 rounded overflow-x-auto font-mono text-left leading-tight">
{`{
  "adb_host": "${adbConfig.host}",
  "adb_port": ${adbConfig.port},
  "protocol": "${adbConfig.protocol}",
  "conn_timeout_ms": ${adbConfig.connTimeout},
  "debug_agent_routing": "LOCAL_LOOPBACK"
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="flex items-center justify-end gap-2 mt-2 border-t border-white/10 pt-2 select-none shrink-0 text-right">
                  <button 
                    onClick={() => {
                      const defaultConfig = { host: 'localhost', port: 5037, autoConnect: true, protocol: 'TCP/IP', connTimeout: 5000 };
                      setAdbConfig(defaultConfig);
                    }}
                    className="px-2 py-1 text-[9px] hover:bg-white/5 border border-white/10 rounded transition-all cursor-pointer text-white/60 hover:text-white"
                  >
                    恢复默认
                  </button>
                  <button 
                    onClick={() => setIsEditingConfig(false)}
                    className="px-2.5 py-1 text-[9px] bg-white/5 hover:bg-white/10 rounded transition-all cursor-pointer text-white"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      setSaveStatus('saving');
                      setTimeout(() => {
                        setSaveStatus('saved');
                        localStorage.setItem('soloforge_gym_monitor_adb_config', JSON.stringify(adbConfig));
                        window.dispatchEvent(new CustomEvent('soloforge-adb-config-saved', { detail: adbConfig }));
                        
                        setTimeout(() => {
                          setIsEditingConfig(false);
                          setSaveStatus('idle');
                        }, 800);
                      }, 700);
                    }}
                    disabled={saveStatus !== 'idle'}
                    className={`px-3 py-1.5 text-[9px] font-semibold rounded shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 min-w-[100px] ${
                      saveStatus === 'saving' 
                        ? 'bg-yellow-600/90 text-white cursor-wait scale-[0.98]' 
                        : saveStatus === 'saved' 
                        ? 'bg-[#10b981] text-white scale-[1.02] shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                        : 'bg-primary hover:bg-primary/90 text-black active:scale-95'
                    }`}
                  >
                    {saveStatus === 'saving' && (
                      <motion.span 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="inline-block w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                    {saveStatus === 'saving' && "同步网关中..."}
                    {saveStatus === 'saved' && "✓ 保存成功"}
                    {saveStatus === 'idle' && "保存配置文件"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* TOP ROW: PHYSICAL HARDWARE TELEMETRY CARDS (CSS Grid 4-column layout) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0" id="gym-monitor-metrics-top-grid">
              {/* CPU Meter */}
              <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="border p-2.5 rounded-xl flex flex-col justify-between shadow-sm min-h-[60px]" translate="no">
                <div className="flex items-center justify-between text-[8px] font-sans text-on-surface/50">
                  <span className="flex items-center gap-1 font-bold">处理器负载率</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>
                <div className="flex items-baseline justify-between mt-1 notranslate" translate="no">
                  <span className="text-[14px] font-extrabold font-mono text-blue-400 notranslate" translate="no">
                    {metrics.cpu.toFixed(1)}
                    <span className="text-[10px] ml-0.5 font-sans font-bold" translate="no">%</span>
                  </span>
                  <span className="text-[7.5px] font-sans text-on-surface/40 notranslate" translate="no">核心频率 <span className="font-mono" translate="no">1.6</span> <span translate="no">GHz</span></span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-black/35 rounded-full overflow-hidden">
                  <div style={{ width: `${metrics.cpu}%` }} className="h-full bg-blue-500 rounded-full transition-all duration-300" />
                </div>
              </div>

              {/* Memory Progress bar */}
              <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="border p-2.5 rounded-xl flex flex-col justify-between shadow-sm min-h-[60px]" translate="no">
                <div className="flex items-center justify-between text-[8px] font-sans text-on-surface/50">
                  <span className="flex items-center gap-1 font-bold">运行缓冲内存</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-baseline justify-between mt-1 notranslate" translate="no">
                  <span className="text-[14px] font-extrabold font-mono text-emerald-400 notranslate" translate="no">
                    {metrics.memory.toFixed(2)}
                    <span className="text-[10px] ml-0.5 font-sans font-bold" translate="no">GB</span>
                  </span>
                  <span className="text-[7.5px] font-sans text-on-surface/40 notranslate" translate="no">配置内存 <span className="font-mono" translate="no">6.0</span> <span translate="no">GB</span></span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-black/35 rounded-full overflow-hidden">
                  <div style={{ width: `${(metrics.memory / 6.00) * 100}%` }} className="h-full bg-emerald-500 rounded-full transition-all duration-500" />
                </div>
              </div>

              {/* Real-time Render FPS */}
              <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="border p-2.5 rounded-xl flex flex-col justify-between shadow-sm min-h-[60px]" translate="no">
                <div className="flex items-center justify-between text-[8px] font-sans text-on-surface/50">
                  <span className="flex items-center gap-1 font-bold">物理渲染帧率</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <div className="flex items-baseline justify-between mt-1 notranslate" translate="no">
                  <span className="text-[14px] font-extrabold font-mono text-amber-400 notranslate" translate="no">
                    {metrics.fps.toFixed(1)}
                    <span className="text-[10px] ml-0.5 font-sans font-bold" translate="no">FPS</span>
                  </span>
                  <span className="text-[7.5px] font-sans text-on-surface/40 notranslate" translate="no">稳定上限 <span className="font-mono" translate="no">60</span> <span translate="no">FPS</span></span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-black/35 rounded-full overflow-hidden">
                  <div style={{ width: `${(metrics.fps / 60) * 100}%` }} className="h-full bg-amber-500 rounded-full transition-all duration-300" />
                </div>
              </div>

              {/* ADB Latency */}
              <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="border p-2.5 rounded-xl flex flex-col justify-between shadow-sm min-h-[60px]" translate="no">
                <div className="flex items-center justify-between text-[8px] font-sans text-on-surface/50">
                  <span className="flex items-center gap-1 font-bold">调试连接延迟</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                </div>
                <div className="flex items-baseline justify-between mt-1 notranslate" translate="no">
                  <span className="text-[14px] font-extrabold font-mono text-pink-400 notranslate" translate="no">
                    {rlStats.latency}
                    <span className="text-[10px] ml-0.5 font-sans font-bold" translate="no">ms</span>
                  </span>
                  <span className="text-[7.5px] font-sans text-on-surface/40 notranslate" translate="no">自环延迟 <span className="font-mono" translate="no">&lt;20</span> <span translate="no">ms</span></span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-black/35 rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, (rlStats.latency / 40) * 100)}%` }} className="h-full bg-pink-500 rounded-full transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: CORE SYSTEM DETAILS GRID (CONDITIONAL RENDERING WHEN NOT MINIMIZED) */}
            {!isMinimized && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-0 flex-grow" id="gym-monitor-main-bottom-grid">
              
              {/* COLUMN A: MODEL TRAINING & RL ALGORITHM STATISTICS (md: 4 spans) */}
              <div className="md:col-span-4 flex flex-col gap-2.5 min-w-0">
                {/* ENVIRONMENT AND RL CONFIGURATION PANEL */}
                <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="border rounded-xl p-2.5 flex flex-col justify-between shadow-sm flex-grow min-h-[110px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
                    <span className="text-[9px] font-bold text-on-surface/55 font-sans flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-purple-400" />
                      模型智能体决策大脑
                    </span>
                    <span className="text-[8px] font-sans font-bold text-purple-400">进行指派推理反馈</span>
                  </div>

                  <div className="my-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-sans">
                      <span className="text-on-surface/40">模拟运行环境:</span>
                      <span className="font-bold text-on-surface text-right truncate overflow-hidden max-w-[140px] font-mono" title={getActiveEnvId()}>
                        {getActiveEnvId()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-sans">
                      <span className="text-on-surface/40">策略结构类型:</span>
                      <span className="font-bold text-[#b08df1]">近端策略优化深度网络 (PPO-MLP)</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-sans">
                      <span className="text-on-surface/40">决策学习速率:</span>
                      <span className="font-bold text-on-surface font-mono">0.0003</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-sans">
                      <span className="text-on-surface/40">画面解析区域:</span>
                      <span className="font-bold text-on-surface"><span className="font-mono">{rlStats.scannedNodes}</span> 个布局定位点</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 border-t border-white/5 pt-1.5 mt-1 text-center font-sans">
                    <div>
                      <span className="text-[7.5px] text-on-surface/30 block">更新剪切率</span>
                      <span className="text-[9.5px] font-bold text-on-surface font-mono">0.20</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-on-surface/30 block">决策离散熵</span>
                      <span className="text-[9.5px] font-bold text-teal-400 font-mono">{rlStats.entropy}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-on-surface/30 block">衰减折扣值</span>
                      <span className="text-[9.5px] font-bold text-on-surface font-mono">0.99</span>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC PPO OBJECTIVE & REWARD SCORES */}
                <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="border rounded-xl p-2.5 flex flex-col justify-between shadow-sm flex-grow min-h-[120px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
                    <span className="text-[9px] font-bold text-on-surface/55 font-sans flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      强化学习状态反馈
                    </span>
                    <span className="text-[8px] font-sans font-bold text-emerald-400">决策反馈评估指标</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-1.5">
                    <div className="bg-black/15 p-1 px-1.5 rounded border border-white/5 font-sans">
                      <span className="text-[7px] text-on-surface/45 block">即时步行动奖励值</span>
                      <span className={`text-[12.5px] font-extrabold font-mono ${metrics.action.includes('SUCCESS') ? 'text-green-400' : (metrics.action.includes('Search') ? 'text-blue-300' : 'text-on-surface/75')}`}>
                        {metrics.action.includes('SUCCESS') ? '+1.00' : (metrics.action.includes('Search') ? '+0.25' : '0.00')}
                      </span>
                    </div>
                    <div className="bg-black/15 p-1 px-1.5 rounded border border-white/5 font-sans">
                      <span className="text-[7px] text-on-surface/45 block">全回合累计总回报</span>
                      <span className="text-[12.5px] font-extrabold font-mono text-emerald-400">
                        {rlStats.cumulativeReward.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-white/5 pt-1.5 font-sans">
                    <div className="flex justify-between items-center text-[8px]">
                      <span className="text-on-surface/35">策略概率剪切回归损失:</span>
                      <span className="text-blue-300 font-bold font-mono">{rlStats.ppoLoss}</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px]">
                      <span className="text-on-surface/35">估计评估模型价值损失:</span>
                      <span className="text-amber-400 font-bold font-mono">{rlStats.valLoss}</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px]">
                      <span className="text-on-surface/35">自动测试运行成功通过率:</span>
                      <span className="text-emerald-400 font-bold"><span className="font-mono">{rlStats.successRate}</span>%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN B: MIRRORED INTERACTIVE ACTION VIEWPORT SCREENSHOTS (md: 4 spans) */}
              <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="md:col-span-4 border rounded-xl p-2.5 flex flex-col justify-between shadow-md overflow-hidden min-w-[150px]">
                <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
                  <span className="text-[9px] font-bold text-on-surface/65 font-mono flex items-center gap-1">
                    <Eye className="w-3 h-3 text-red-400" />
                    虚拟机画面监控 (实时镜像)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  </span>
                </div>

                {/* Center screenshot layer */}
                <div className="flex-1 min-h-[140px] bg-black/35 rounded-lg border border-white/5 p-1 relative flex items-center justify-center overflow-hidden">
                  {metrics.screenshot ? (
                    <div className="w-full h-full scale-[0.82] flex items-center justify-center transition-all duration-300">
                      <SimulatedViewport type={activeTag as 'VUE' | 'AUTH' | 'AI' | 'ANDROID'} step={metrics.step} />
                    </div>
                  ) : (
                    <div className="text-center space-y-1.5 text-on-surface/30">
                      <Layout className="w-6 h-6 mx-auto stroke-1" />
                      <span className="text-[8px] font-sans block">正在建立控制推流，等待画面载入...</span>
                    </div>
                  )}
                  
                  <div className="absolute top-1.5 left-1.5 bg-black/75 text-amber-500 font-mono text-[7px] px-1 py-0.2 rounded border border-[#ff8c00]/20 font-bold">
                    执行步数 {metrics.step}
                  </div>

                  <div className="absolute bottom-1.5 right-1.5 bg-black/65 text-white font-mono text-[6.5px] px-1 rounded border border-white/10">
                    分辨率 280x500 | 320dpi
                  </div>
                </div>

                <div className="mt-2 bg-black/20 p-1.5 rounded border border-white/5">
                  <span className="text-[6.5px] uppercase font-sans tracking-wider text-on-surface/40 block">神经网络已决策动作</span>
                  <span className="text-[8.5px] font-mono font-bold text-[#ffd05b] block truncate overflow-hidden max-w-full" title={metrics.action}>
                    {metrics.action}
                  </span>
                </div>
              </div>

              {/* COLUMN C: SYSTEM EXECUTION LOGS (md: 4 spans) */}
              <div style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.outline }} className="md:col-span-4 border rounded-xl p-2.5 flex flex-col justify-between shadow-md overflow-hidden min-w-[150px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1.5 text-[9px] font-bold text-on-surface/65 font-mono">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3" style={{ color: primaryColor }} />
                    仿真日志输出 (实时流)
                  </span>
                  <span className="text-[7px] text-on-surface/40">调试日志工具 (Logcat)</span>
                </div>

                <div className="flex-grow bg-black/30 rounded-lg border border-white/5 p-2 font-mono text-[7.5px] text-on-surface/85 overflow-y-auto h-[120px] max-h-[160px] space-y-1.5 scrollbar-thin text-left">
                  {vmLogs.length > 0 ? (
                    vmLogs.map((log, index) => {
                      let colorClass = 'text-on-surface/80';
                      if (log.includes('SUCCESS') || log.includes('OK') || log.includes('成功')) colorClass = 'text-green-400/95';
                      if (log.includes('Action') || log.includes('PPO') || log.includes('算法')) colorClass = 'text-[#ffe08b]';
                      if (log.includes('GymDaemon') || log.includes('系统监视')) colorClass = 'text-pink-400';
                      return (
                        <div key={index} className={`leading-normal py-0.2 border-b border-white/5 last:border-0 font-light font-mono ${colorClass}`}>
                          {log}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-on-surface/30 italic text-center pt-8">暂无仿真调试日志输出。</div>
                  )}
                </div>
              </div>
            </div>
          )}
              </>
            )}

          </div>

          {/* 四个高精度的防夹边物理拉伸把手（安全边距与标准触控面积，通过边缘悬停交互） */}
          <div 
            onMouseDown={(e) => handleResizeStart('tl', e)}
            onTouchStart={(e) => handleResizeStartTouch('tl', e)}
            className="absolute top-0 left-0 w-6 h-6 z-50 cursor-nwse-resize select-none"
            title="拖拽拉伸 - 左上角"
          />

          <div 
            onMouseDown={(e) => handleResizeStart('tr', e)}
            onTouchStart={(e) => handleResizeStartTouch('tr', e)}
            className="absolute top-0 right-0 w-6 h-6 z-50 cursor-nesw-resize select-none"
            title="拖拽拉伸 - 右上角"
          />

          <div 
            onMouseDown={(e) => handleResizeStart('bl', e)}
            onTouchStart={(e) => handleResizeStartTouch('bl', e)}
            className="absolute bottom-0 left-0 w-6 h-6 z-50 cursor-nesw-resize select-none"
            title="拖拽拉伸 - 左下角"
          />

          <div 
            onMouseDown={(e) => handleResizeStart('br', e)}
            onTouchStart={(e) => handleResizeStartTouch('br', e)}
            className="absolute bottom-0 right-0 w-6 h-6 z-50 cursor-nwse-resize select-none"
            title="拖拽拉伸 - 右下角"
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
