import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, Play, Smartphone, Brain, Loader2 } from 'lucide-react';

interface SimulatedViewportProps {
  type: 'VUE' | 'AUTH' | 'AI' | 'ANDROID';
  step: number;
}

export default function SimulatedViewport({ type, step }: SimulatedViewportProps) {
  const rotation = step % 3;

  // Vue3 Shopping Sandbox Mockup
  if (type === 'VUE') {
    if (rotation === 0) {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          {/* Status Bar */}
          <div className="bg-[#1b1d1f] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#3fb984] tracking-wide" translate="no">Vue3 电子商城测试沙盒</span>
            <span className="text-[9px] text-[#656c75] font-mono">VUE3-CORE-01</span>
          </div>

          {/* Search bar inside App */}
          <div className="p-3 shrink-0">
            <div className="w-full bg-[#1c2024] border border-[#3fb984] rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs text-white/50">
              <span className="truncate">搜索商品...</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb984] animate-pulse" />
            </div>
          </div>

          {/* Main App Content area */}
          <div className="flex-1 overflow-y-auto px-3 space-y-3 pb-3">
            <div className="bg-[#1b1c1e] border border-white/5 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xs">商品列表 (Vite)</span>
                <span className="text-[9px] text-[#656c75] font-mono">localhost:3000</span>
              </div>
              <div className="inline-block bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 text-[9px] font-bold px-2 py-0.5 rounded-md">
                热更就绪 (HMR)
              </div>
              <div className="bg-[#1f2937] p-2.5 rounded-lg border border-white/5 space-y-1 mt-1">
                <span className="text-white text-[11px] font-medium block">商品: 红富士有机苹果</span>
                <span className="text-[#10b981] text-[10px] font-mono block">$12.50 | 状态: 正常</span>
              </div>
            </div>

            {/* Virtual DOM state */}
            <div className="bg-[#1b1c1e] border border-white/5 rounded-xl p-3 space-y-1.5">
              <span className="text-white font-bold text-xs block">虚拟 DOM 节点树</span>
              <div className="border-t border-dashed border-[#ff4757]/40 my-1 py-1">
                <span className="text-on-surface/40 text-[10px] text-red-400 font-mono block">检测到 1 个变化节点</span>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    } else if (rotation === 1) {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          <div className="bg-[#1b1d1f] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#3fb984] tracking-wide" translate="no">Vue3 电子商城测试沙盒</span>
            <span className="text-[9px] text-[#656c75] font-mono">VUE3-CORE-01</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-3">
            {/* Click event tracker */}
            <div className="bg-[#1b1c1e] border border-white/5 rounded-xl p-3 space-y-2 relative">
              <span className="text-white font-bold text-xs block">点击事件捕获 (Click Action)</span>
              <div className="bg-[#3fb984]/15 border border-[#3fb984]/35 rounded-lg p-2 flex items-center justify-between relative">
                <span className="text-[#3fb984] text-[11px] font-bold">正在触发: 添加到购物车</span>
                {/* Simulated click pointer bubble */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping" />
                  <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
                </div>
              </div>
            </div>

            {/* Event Output container */}
            <div className="bg-[#1b1c1e] border border-white/5 rounded-xl p-3 space-y-2">
              <span className="text-white font-bold text-xs block">组件触发响应流</span>
              <div className="font-mono text-[10.5px] space-y-1 text-left bg-black/20 p-2.5 rounded-lg border border-white/5">
                <p className="text-[#ffe08b] font-bold">组件: button#add-to-cart</p>
                <p className="text-[#a0aec0] text-[9.5px]">参数: &#123; productId: 1, quantity: 1 &#125;</p>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          <div className="bg-[#1b1d1f] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#3fb984] tracking-wide" translate="no">Vue3 电子商城测试沙盒</span>
            <span className="text-[9px] text-[#656c75] font-mono">VUE3-CORE-01</span>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
            <div className="bg-[#111c16] border border-[#10b981] rounded-2xl p-5 max-w-[240px] space-y-3.5 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center mx-auto text-[#10b981]">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[#10b981] font-bold text-sm">执行通过</h4>
                <p className="text-[#a0aec0] text-[10.5px]">反馈奖励回传: +1.00</p>
              </div>
              <div className="text-[10px] text-[#10b981]/90 bg-[#10b981]/10 px-2.5 py-1 rounded-md border border-[#10b981]/15 leading-tight">
                购物车结算计数正常增加
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    }
  }

  // OAuth2 Sandbox Mockup
  if (type === 'AUTH') {
    if (rotation === 0) {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          {/* Status Bar */}
          <div className="bg-[#1e1e24] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#3b82f6] tracking-wide" translate="no">OAuth2.0 安全沙箱</span>
            <span className="text-[9px] text-[#656c75] font-mono">AUTH-NET-GUARD</span>
          </div>

          {/* Vulnerability status indicator button state */}
          <div className="p-3 shrink-0">
            <div className="w-full bg-[#15171e] border border-[#ef4444] rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs text-[#ef4444] font-medium">
              <span>潜在威胁探测中...</span>
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </div>

          {/* Main analysis display */}
          <div className="flex-grow overflow-y-auto px-3 space-y-3 pb-3">
            <div className="bg-[#15171e] border border-white/5 rounded-xl p-3 space-y-2 text-left">
              <span className="text-white font-bold text-xs block">安全分析仪表盘</span>
              <span className="text-[9.5px] text-[#9ca3af] block">防护方案: 令牌防窃听 & SQL校验</span>
              
              <div className="inline-block bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/25 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1">
                成功阻断入侵
              </div>

              <div className="bg-[#1f2937] p-2.5 rounded-lg border border-white/5 mt-2">
                <code className="text-[#ef4444] text-[9.5px] font-mono break-all leading-tight">GET /api/user?id=admin'--</code>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    } else if (rotation === 1) {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          <div className="bg-[#1e1e24] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#3b82f6] tracking-wide" translate="no">OAuth2.0 安全沙箱</span>
            <span className="text-[9px] text-[#656c75] font-mono">AUTH-NET-GUARD</span>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
            <div className="bg-[#12253a] border border-[#3b82f6] rounded-2xl p-5 max-w-[240px] space-y-3.5 shadow-lg">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/45">
                <div className="absolute inset-0 bg-[#3b82f6]/10 rounded-full animate-ping" />
                <Shield className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[#f0fdf4] font-bold text-sm">安全策略执行</h4>
                <p className="text-[#9ca3af] text-[10px]">认证令牌安全校验中</p>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          <div className="bg-[#1e1e24] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#3b82f6] tracking-wide" translate="no">OAuth2.0 安全沙箱</span>
            <span className="text-[9px] text-[#656c75] font-mono">AUTH-NET-GUARD</span>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
            <div className="bg-[#111c14] border border-[#10b981] rounded-2xl p-5 max-w-[240px] space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center mx-auto text-[#10b981]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[#10b981] font-bold text-sm">安全验证完毕</h4>
                <p className="text-[#9ca3af] text-[10.5px]">防御哨兵节点已进入拦截模式</p>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    }
  }

  // Swagger API scanner mockup
  if (type === 'AI') {
    if (rotation === 0) {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          {/* Status Bar */}
          <div className="bg-[#1b1c1e] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#ec4899] tracking-wide" translate="no">Swagger 接口规格扫描</span>
            <span className="text-[9px] text-[#656c75] font-mono">SWAGGER-SCANNER</span>
          </div>

          <div className="p-3 shrink-0">
            <div className="w-full bg-[#1a1215] border border-[#ec4899] rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs text-[#ec4899] font-medium">
              <span>解析中: ProductController.cs</span>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ec4899]" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-3 space-y-3 pb-3">
            <div className="bg-[#17181f] border border-white/5 rounded-xl p-3 space-y-2 text-left">
              <span className="text-white font-bold text-xs block">Swagger 规格验证看板</span>
              <span className="text-[9.5px] text-[#9ca3af] block">已发现 4 项核心接口路径</span>

              <div className="inline-block bg-[#ec4899]/15 text-[#ec4899] border border-[#ec4899]/25 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1">
                匹配校验率 100%
              </div>

              <div className="bg-[#1f2937] p-2.5 rounded-lg border border-white/5 mt-1">
                <code className="text-[#60a5fa] text-[9.5px] font-mono leading-tight">GET  /api/v1/products</code>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    } else if (rotation === 1) {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          <div className="bg-[#1b1c1e] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#ec4899] tracking-wide" translate="no">Swagger 接口规格扫描</span>
            <span className="text-[9px] text-[#656c75] font-mono">SWAGGER-SCANNER</span>
          </div>

          <div className="flex-grow overflow-y-auto p-3 space-y-3 pb-3">
            <div className="bg-[#2d1d24]/80 border border-[#ec4899] rounded-xl p-3 space-y-2 text-left">
              <span className="text-[#fecdd3] font-bold text-xs block">匹配 JSON Schema 元标签</span>
              <div className="bg-[#1f141a] rounded-lg p-2.5 font-mono text-[9px] leading-relaxed space-y-0.5 text-left select-all">
                <p className="text-[#ec4899]">"type": "object",</p>
                <p className="text-[#60a5fa]">"required": ["id", "name"],</p>
                <p className="text-[#93c5fd]">"properties": &#123;</p>
                <p className="text-[#fbcfe8] pl-2">"id": &#123; "type": "int" &#125;</p>
                <p className="text-[#93c5fd]">&#125;</p>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
          <div className="bg-[#1b1c1e] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <span className="text-[10px] font-bold text-[#ec4899] tracking-wide" translate="no">Swagger 接口规格扫描</span>
            <span className="text-[9px] text-[#656c75] font-mono">SWAGGER-SCANNER</span>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center p-4 text-center">
            <div className="bg-[#111c14] border border-[#10b981] rounded-2xl p-5 max-w-[240px] space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center mx-auto text-[#10b981]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[#10b981] font-bold text-sm">结构校验一致</h4>
                <p className="text-[#9ca3af] text-[10.5px]">代码元注解匹配 REST 约束项</p>
              </div>
            </div>
          </div>

          <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      );
    }
  }

  // Android AVD Core Mockup
  if (rotation === 0) {
    return (
      <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
        {/* Android Top Nav Bar */}
        <div className="bg-[#1b1d1f] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
          <span className="text-[10px] font-bold text-[#656c75] tracking-wide">Android AVD Core 01</span>
          <span className="text-[9px] text-[#ff8c00] font-mono">USB-COM:5037</span>
        </div>

        {/* Input Bar */}
        <div className="p-3 shrink-0">
          <div className="w-full bg-[#1c2024] border border-[#ff8c00] rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs text-[#fcfcfc] font-mono">
            <span>instacart app organic apples</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff8c00] animate-pulse" />
          </div>
        </div>

        {/* App Content container */}
        <div className="flex-1 overflow-y-auto px-3 space-y-3 pb-3">
          <div className="bg-[#1b1c1e] border border-white/5 rounded-xl p-3 space-y-2 text-left">
            <span className="text-white font-bold text-xs block">Instacart Shopping</span>
            <span className="text-[10px] text-[#a0aec0] block">RL Goal: Item "Honeycrisp Apples"</span>
            <span className="inline-block bg-[#059669] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
              API Active
            </span>
          </div>

          {/* Grid list of food items */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#181a1c] p-2 rounded-lg border border-white/5 text-left relative flex flex-col justify-between">
              <div className="bg-[#2d3748] h-12 rounded-md mb-1.5" />
              <span className="text-[10px] text-white font-medium block truncate">Honeycrisp Apple</span>
              <span className="text-[#059669] text-[9.5px] font-bold block">$1.99 / lb</span>
              <div className="mt-1.5 bg-[#ff8c00] text-[#121415] text-[8px] font-extrabold px-1.5 py-0.5 rounded text-center w-max">
                Action
              </div>
            </div>

            <div className="bg-[#181a1c] p-2 rounded-lg border border-white/5 text-left select-none opacity-60">
              <div className="bg-[#2d3748] h-12 rounded-md mb-1.5" />
              <span className="text-[10px] text-white font-medium block truncate">Gala Apples (Bg)</span>
              <span className="text-[#059669] text-[9.5px] font-bold block">$2.49 / lb</span>
            </div>
          </div>

          {/* Metrics log footer */}
          <div className="bg-[#1e2227] border border-[#2e353f] p-2 rounded-lg text-left select-none relative mt-1">
            <span className="text-[#ffe08b] text-[9px] font-mono">Reward: +0.25 (Search phase complete)</span>
          </div>
        </div>

        <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
          <div className="w-8 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    );
  } else if (rotation === 1) {
    return (
      <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
        <div className="bg-[#1b1d1f] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
          <span className="text-[10px] font-bold text-[#656c75] tracking-wide">Android AVD Core 01</span>
          <span className="text-[9px] text-[#ff8c00] font-mono">USB-COM:5037</span>
        </div>

        <div className="flex-grow overflow-y-auto p-3 space-y-3 pb-3">
          <div className="bg-[#1b1c1e] border border-[#2c2f33] rounded-xl p-3 space-y-2 text-left relative">
            <div className="bg-[#2d3748] h-[100px] rounded-lg mb-2" />
            <span className="text-white font-bold text-xs block">Fresh Organic Honeycrisp</span>
            <span className="text-[#a0aec0] text-[9px] block">Origin: Washington State, US</span>
            <span className="text-[#10b981] text-sm font-bold block">$1.99 / lb</span>
            
            <div className="bg-[#ff8c00] border border-[#f59e0b] rounded-lg py-2 text-[#121415] text-[11px] font-extrabold text-center relative mt-2 shrink-0">
              ADD TO CART
              {/* Simulated click pointer bubble */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping" />
                <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
              </div>
            </div>
          </div>

          <div className="bg-[#111215] border border-[#ffe08b] p-2.5 rounded-lg text-left select-none relative">
            <span className="text-[#10b981] text-[10px] font-bold block">Reward: +1.00 (Objective Met!)</span>
            <span className="text-[#718096] text-[8.5px] font-mono block">Goal status: SUCCESS</span>
            <span className="text-[#718096] text-[8.5px] font-mono block">Step 48: Action clicked Cart (x=210, y=312)</span>
          </div>
        </div>

        <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
          <div className="w-8 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full bg-[#121415] text-[#d4d4d4] flex flex-col font-sans relative overflow-hidden" translate="no">
        <div className="bg-[#1b1d1f] px-3 py-2 flex items-center justify-between border-b border-white/5 select-none shrink-0">
          <span className="text-[10px] font-bold text-[#656c75] tracking-wide">Android AVD Core 01</span>
          <span className="text-[9px] text-[#ff8c00] font-mono">USB-COM:5037</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-3">
          <div className="bg-[#111c14] border border-[#10b981] rounded-2xl p-4 text-center shadow-lg space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center mx-auto text-[#10b981]">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[#10b981] font-bold text-sm">步数周期完结</h4>
              <p className="text-[#9ca3af] text-[10.5px]">累计强化收益值: +2.50</p>
            </div>
          </div>

          <div className="bg-[#1b1c1e] border border-[#2c2f33] rounded-xl p-3 text-left space-y-2">
            <span className="text-white font-bold text-[11px] block border-b border-white/5 pb-1 select-none">Agent Policy Settings</span>
            <ul className="text-[9.5px] text-[#cbd5e0] space-y-1 leading-normal font-sans">
              <li>RL Algorithm: <span className="text-[#ffe08b] font-mono font-bold">PPO (Clip)</span></li>
              <li>Learning rate: <span className="font-mono">0.0003</span></li>
              <li>Gamma: <span className="font-mono">0.99</span></li>
            </ul>
            <div className="bg-[#111215] border border-white/10 rounded p-2 text-[9px] text-[#718096] font-mono space-y-1">
              <span className="text-[#ff8c00] font-bold block">Observation Space Specs</span>
              <span>Screen: 280x500 Visual Image</span>
              <span className="block">XML Tree Hierarchies Enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-[#090a0a] h-4 flex items-center justify-center shrink-0">
          <div className="w-8 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    );
  }
}
