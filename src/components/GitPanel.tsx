import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  RefreshCw, 
  ArrowUp, 
  Check, 
  Settings, 
  History, 
  Lock, 
  Plus, 
  AlertCircle, 
  Terminal, 
  Globe, 
  User, 
  Mail, 
  FileText, 
  CheckCircle2, 
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface GitFile {
  name: string;
  status: string; // 'modified' | 'untracked' | 'added' | 'deleted' | 'renamed'
  staged: boolean;
  rawType: string;
}

interface CommitLog {
  hash: string;
  author: string;
  relativeTime: string;
  message: string;
}

interface GitStatusData {
  initialized: boolean;
  branch: string;
  remoteUrl: string;
  userName: string;
  userEmail: string;
  files: GitFile[];
  commits: CommitLog[];
}

function renderDiff(diffString: string | null, hasConflict = false) {
  if (!diffString) return <div className="text-on-surface/40 italic p-4 text-xs">没有差异内容</div>;
  const lines = diffString.split('\n');

  if (!hasConflict) {
    return (
      <pre className="font-mono text-[10px] leading-relaxed whitespace-pre overflow-x-auto p-3.5 bg-neutral-900 border border-outline/10 text-neutral-200 rounded-xl max-h-[460px] select-text">
        {lines.map((line, i) => {
          let className = 'text-on-surface/85';
          if (line.startsWith('+') && !line.startsWith('+++')) {
            className = 'text-emerald-400 bg-emerald-950/25 px-1 py-0.5 rounded-sm block w-full border-l-2 border-emerald-500';
          } else if (line.startsWith('-') && !line.startsWith('---')) {
            className = 'text-rose-400 bg-rose-950/25 px-1 py-0.5 rounded-sm block w-full border-l-2 border-rose-500';
          } else if (line.startsWith('@@')) {
            className = 'text-blue-400 font-semibold block w-full bg-blue-950/10 py-0.5';
          } else if (line.startsWith('diff --git') || line.startsWith('index ')) {
            className = 'text-amber-400 block w-full font-bold pt-1.5 border-t border-outline/10';
          } else if (line.startsWith('commit ') || line.startsWith('Author:') || line.startsWith('Date:')) {
            className = 'text-purple-400 block w-full font-semibold';
          }
          return (
            <code key={i} className={className}>
              {line || '\n'}
            </code>
          );
        })}
      </pre>
    );
  }

  let inOursBlock = false;
  let inTheirsBlock = false;

  return (
    <pre className="font-mono text-[10.5px] leading-relaxed whitespace-pre overflow-x-auto p-3.5 bg-neutral-950 border border-outline/15 text-neutral-200 rounded-xl max-h-[460px] select-text">
      {lines.map((line, i) => {
        let className = 'text-on-surface/85 block w-full px-1';
        let customElement = null;

        if (line.startsWith('<<<<<<<')) {
          inOursBlock = true;
          inTheirsBlock = false;
          className = 'text-blue-400 bg-blue-950/40 font-black border-y border-blue-500/50 py-1 my-1 block w-full';
          customElement = (
            <div key={i} className={className}>
              <span className="bg-blue-500 text-bg px-1.5 py-0.5 rounded text-[8.5px] font-black mr-2 uppercase">▼ 当前更改</span>
              {line}
            </div>
          );
        } else if (line.startsWith('=======')) {
          inOursBlock = false;
          inTheirsBlock = true;
          className = 'text-amber-400 bg-amber-950/45 font-black border-y border-amber-500/50 py-1 my-1 block w-full';
          customElement = (
            <div key={i} className={className}>
              <span className="bg-amber-500 text-bg px-1.5 py-0.5 rounded text-[8.5px] font-black mr-2 uppercase">▲ 传入更改</span>
              {line}
            </div>
          );
        } else if (line.startsWith('>>>>>>>')) {
          inOursBlock = false;
          inTheirsBlock = false;
          className = 'text-neutral-400 bg-neutral-900 border-y border-neutral-700/50 py-1 my-1 block w-full';
          customElement = (
            <div key={i} className={className}>
              <span className="bg-neutral-650 text-white px-1.5 py-0.5 rounded text-[8.5px] font-black mr-2 uppercase">◀ 冲突边界</span>
              {line}
            </div>
          );
        } else {
          if (inOursBlock) {
            className = 'bg-blue-950/15 text-blue-300 font-medium px-2 py-0.5 border-l-2 border-blue-500 block w-full';
          } else if (inTheirsBlock) {
            className = 'bg-amber-950/15 text-amber-300 font-medium px-2 py-0.5 border-l-2 border-amber-500 block w-full';
          } else if (line.startsWith('+') && !line.startsWith('+++')) {
            className = 'text-emerald-400 bg-emerald-950/20 px-1 py-0.5 block w-full border-l border-emerald-500';
          } else if (line.startsWith('-') && !line.startsWith('---')) {
            className = 'text-rose-400 bg-rose-950/20 px-1 py-0.5 block w-full border-l border-rose-500';
          }
        }

        if (customElement) return customElement;
        return (
          <code key={i} className={className}>
            {line || '\n'}
          </code>
        );
      })}
    </pre>
  );
}

interface GitPanelProps {
  onClose: () => void;
}

export default function GitPanel({ onClose }: GitPanelProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusData, setStatusData] = useState<GitStatusData | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'changes' | 'history' | 'preferences'>('changes');
  
  // Forms & configs
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [remoteUrl, setRemoteUrl] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>(() => {
    return localStorage.getItem('git_access_token') || '';
  });
  const [targetBranch, setTargetBranch] = useState<string>('main');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Status feedback banners
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Branch management & detailed commit Diff states
  const [branches, setBranches] = useState<string[]>([]);
  const [showBranchSelector, setShowBranchSelector] = useState<boolean>(false);
  const [newBranchName, setNewBranchName] = useState<string>('');
  const [selectedCommitDiff, setSelectedCommitDiff] = useState<string | null>(null);
  const [selectedCommitHash, setSelectedCommitHash] = useState<string | null>(null);
  const [showDiffModal, setShowDiffModal] = useState<boolean>(false);

  // GPG commitment signing, visual push loader & conflict resolution states
  const [gpgSign, setGpgSign] = useState<boolean>(false);
  const [pushProgress, setPushProgress] = useState<number | null>(null);
  const [pushSuccessState, setPushSuccessState] = useState<boolean>(false);
  const [viewingFileName, setViewingFileName] = useState<string | null>(null);
  const [viewingFileDiff, setViewingFileDiff] = useState<string | null>(null);
  const [viewingFileHasConflict, setViewingFileHasConflict] = useState<boolean>(false);
  const [showFileDiffModal, setShowFileDiffModal] = useState<boolean>(false);

  const handleViewFileDiff = async (fileName: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/git/file-diff?file=${encodeURIComponent(fileName)}`);
      const data = await res.json();
      if (data.success) {
        setViewingFileName(fileName);
        setViewingFileDiff(data.diff);
        setViewingFileHasConflict(data.hasConflict || false);
        setShowFileDiffModal(true);
      } else {
        showFeedback('error', data.error || '获取文件差异失败。');
      }
    } catch (err: any) {
      showFeedback('error', '获取文件差异请求发生错误。');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveConflict = async (resolution: 'ours' | 'theirs' | 'both') => {
    if (!viewingFileName) return;
    setLoading(true);
    try {
      const res = await fetch('/api/git/resolve-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: viewingFileName, resolution })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message || '冲突已成功解决！');
        setShowFileDiffModal(false);
        setViewingFileName(null);
        setViewingFileDiff(null);
        setViewingFileHasConflict(false);
        await fetchGitStatus(true);
      } else {
        showFeedback('error', data.error || '解决合并冲突失败。');
      }
    } catch (err) {
      showFeedback('error', '发送解决冲突请求错误。');
    } finally {
      setLoading(false);
    }
  };

  // Load status on mount
  useEffect(() => {
    fetchGitStatus();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(prev => prev?.text === text ? null : prev);
    }, 6000);
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/git/branches');
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches || []);
        if (data.current) {
          setTargetBranch(data.current);
        }
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleCheckoutBranch = async (branchName: string, createNew = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/git/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: branchName, create: createNew })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message || `成功切换到分支 ${branchName}`);
        setShowBranchSelector(false);
        setNewBranchName('');
        await fetchGitStatus();
      } else {
        showFeedback('error', data.error || '切换分支失败。');
      }
    } catch (err: any) {
      showFeedback('error', '切换分支请求失败。');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDiff = async (hash: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/git/diff?hash=${hash}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCommitDiff(data.diff);
        setSelectedCommitHash(hash);
        setShowDiffModal(true);
      } else {
        showFeedback('error', data.error || '获取 Diff 失败。');
      }
    } catch (err: any) {
      showFeedback('error', '获取 Diff 请求失败。');
    } finally {
      setLoading(false);
    }
  };

  const fetchGitStatus = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/git/status');
      const data = await res.json();
      if (data.success) {
        setStatusData(data);
        if (data.initialized) {
          setRemoteUrl(data.remoteUrl || '');
          setUserName(data.userName || '');
          setUserEmail(data.userEmail || '');
          setTargetBranch(data.branch || 'main');
          fetchBranches();
        }
      } else {
        showFeedback('error', data.error || '获取 Git 状态失败。');
      }
    } catch (err: any) {
      showFeedback('error', err.message || '连接后端 Git 接口出错。');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const initializeRepository = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/git/init', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message || '本地 Git 仓库初始化完成！');
        await fetchGitStatus();
      } else {
        showFeedback('error', data.error || '初始化仓库失败。');
      }
    } catch (err: any) {
      showFeedback('error', '初始化请求失败，请检查网络。');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      // Save Access Token locally in browser
      localStorage.setItem('git_access_token', accessToken);

      const res = await fetch('/api/git/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          remoteUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', '版本控制配置同步成功！');
        await fetchGitStatus();
      } else {
        showFeedback('error', data.error || '同步配置失败。');
      }
    } catch (err: any) {
      showFeedback('error', '发送配置请求出错。');
    } finally {
      setLoading(false);
    }
  };

  const stageFile = async (filePath?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/git/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePaths: filePath ? [filePath] : [] // Empty list stages all files ('.')
        })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', filePath ? `已暂存：${filePath}` : '已一键暂存所有更改！');
        await fetchGitStatus(true);
      } else {
        showFeedback('error', data.error || '暂存操作失败。');
      }
    } catch (err: any) {
      showFeedback('error', '暂存请求传送失败。');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      showFeedback('error', '提交日志(Commit Message)不能为空！');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: commitMessage,
          gpgSign,
          authorEmail: userEmail,
          authorName: userName
        })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', data.message || '本地提交(Commit)生成成功！');
        setCommitMessage('feat: updates'); // reset
        await fetchGitStatus();
      } else {
        showFeedback('error', data.error || '代码提交失败。');
      }
    } catch (err: any) {
      showFeedback('error', '代码提交请求发送失败。');
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async () => {
    if (loading) return;
    setLoading(true);
    setPushSuccessState(false);
    setPushProgress(5);

    let currentProgress = 5;
    const intervalId = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += Math.floor(Math.random() * 15) + 3;
        if (currentProgress > 90) currentProgress = 90;
        setPushProgress(currentProgress);
      }
    }, 150);

    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remoteUrl,
          token: accessToken,
          branch: targetBranch
        })
      });
      const data = await res.json();
      clearInterval(intervalId);

      if (data.success) {
        setPushProgress(100);
        setPushSuccessState(true);
        showFeedback('success', `推送成功！代码已成功存储到 ${targetBranch} 分支！`);
        await fetchGitStatus(true);
        setTimeout(() => {
          setPushSuccessState(false);
          setPushProgress(null);
        }, 2200);
      } else {
        showFeedback('error', data.error || '推送代码到远程端点失败。');
        setPushProgress(null);
      }
    } catch (err: any) {
      clearInterval(intervalId);
      showFeedback('error', '推送指令执行出错，请检查配置。');
      setPushProgress(null);
    } finally {
      setLoading(false);
    }
  };

  // Separation of files
  const stagedFiles = statusData?.files?.filter(f => f.staged) || [];
  const unstagedFiles = statusData?.files?.filter(f => !f.staged) || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-surface relative select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-outline/30 bg-surface-bright shrink-0">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-on-surface">源代码管理</span>
          {statusData?.initialized && statusData.branch && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBranchSelector(!showBranchSelector)}
                className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors max-w-[120px] truncate"
                title="切换/新建 Git 分支"
              >
                <span className="truncate">{targetBranch || statusData.branch}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-70 shrink-0" />
              </button>

              {showBranchSelector && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setShowBranchSelector(false)} 
                  />
                  <div className="absolute left-0 mt-1.5 w-48 bg-surface-bright border border-outline/35 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] p-1 z-50 flex flex-col gap-1 max-h-64 overflow-y-auto">
                    <div className="px-2 py-1 text-[9px] text-on-surface/40 font-bold border-b border-outline/10 uppercase tracking-wider">
                      选择分支
                    </div>
                    {branches.length === 0 ? (
                      <div className="px-2 py-1.5 text-[10.5px] text-on-surface/50 italic">
                        未获取到本地分支
                      </div>
                    ) : (
                      branches.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleCheckoutBranch(b)}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-[10.5px] font-mono flex items-center justify-between transition-colors cursor-pointer ${
                            b === (targetBranch || statusData.branch)
                              ? 'bg-primary/15 text-primary font-bold'
                              : 'hover:bg-on-surface/5 text-on-surface/85'
                          }`}
                        >
                          <span className="truncate">{b}</span>
                          {b === (targetBranch || statusData.branch) && <Check className="w-3 h-3 text-primary shrink-0" />}
                        </button>
                      ))
                    )}
                    
                    {/* Create New Branch block */}
                    <div className="p-1 px-1.5 border-t border-outline/10 mt-1 space-y-1 text-left">
                      <div className="text-[9px] text-on-surface/40 font-bold">新建并切换分支:</div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newBranchName}
                          onChange={(e) => setNewBranchName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newBranchName.trim()) {
                              handleCheckoutBranch(newBranchName.trim(), true);
                            }
                          }}
                          placeholder="分支名称"
                          className="flex-1 text-[9.5px] px-1.5 py-0.5 bg-surface text-on-surface border border-outline/25 rounded outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newBranchName.trim()) {
                              handleCheckoutBranch(newBranchName.trim(), true);
                            }
                          }}
                          className="bg-primary hover:bg-primary-hover text-bg p-1 rounded font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 animate-none"
                          title="在当前提交新建并切至新分支"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => fetchGitStatus()} 
            disabled={loading}
            className="p-1.5 hover:bg-on-surface/10 rounded-md text-on-surface/60 hover:text-on-surface transition-colors cursor-pointer disabled:opacity-30"
            title="刷新 Git 状态"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-on-surface/10 rounded-md text-on-surface/60 hover:text-on-surface transition-colors cursor-pointer"
            title="关闭面板"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div className={`px-3.5 py-2 text-[10.5px] border-b text-left flex gap-1.5 items-start shrink-0 ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <AlertCircle className="w-3.5 h-3.5 uppercase shrink-0 mt-0.5" />
          <span className="flex-1">{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="shrink-0 p-0.5 hover:bg-on-surface/5 rounded">
            <X className="w-3 h-3 text-on-surface/40" />
          </button>
        </div>
      )}

      {/* Primary content area */}
      {!statusData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-on-surface/30 animate-spin" />
          <p className="text-xs text-on-surface/40">加载 Git 通道状态中...</p>
        </div>
      ) : !statusData.initialized ? (
        /* Not Initialized View */
        <div className="flex-1 flex flex-col justify-between p-5 text-left">
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/25 rounded-2xl p-4 space-y-2.5">
              <span className="inline-flex p-1.5 bg-primary/10 rounded-xl text-primary">
                <GitBranch className="w-5 h-5" />
              </span>
              <h3 className="text-xs font-black text-on-surface">创建 Git 版本库</h3>
              <p className="text-[11px] text-on-surface/60 leading-relaxed">
                当前项目目录未检测到活动 Git 仓库。初始化仓库后，即可记录代码修订节点，并推送到任何云端存储（如 GitHub）。
              </p>
            </div>
            
            <button
              onClick={initializeRepository}
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-bg font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>初始化本地 Git 仓库</span>
            </button>
          </div>
          
          <div className="text-[10px] text-on-surface/30 leading-snug border-t border-[var(--color-outline)]/10 pt-3">
            * 提示：初始化后，系统会自动为您生成符合标准的 <strong>.gitignore</strong>，防止 `node_modules` 等开发杂音入库。
          </div>
        </div>
      ) : (
        /* Initialized Full Control Console */
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-outline/30 bg-surface-bright/50 px-2 pt-1 shrink-0">
            <button
              onClick={() => setActiveSubTab('changes')}
              className={`flex-1 py-2 text-[11px] font-bold border-b-2 transition-all ${
                activeSubTab === 'changes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface/55 hover:text-on-surface/90'
              }`}
            >
              变更管理 ({statusData.files.length})
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`flex-1 py-2 text-[11px] font-bold border-b-2 transition-all ${
                activeSubTab === 'history'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface/55 hover:text-on-surface/90'
              }`}
            >
              提交历史
            </button>
            <button
              onClick={() => setActiveSubTab('preferences')}
              className={`flex-1 py-2 text-[11px] font-bold border-b-2 transition-all ${
                activeSubTab === 'preferences'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface/55 hover:text-on-surface/90'
              }`}
            >
              认证与配置
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            
            {/* 1. CHANGES TAB */}
            {activeSubTab === 'changes' && (
              <div className="space-y-4">
                
                {/* Commit Form Section */}
                <div className="bg-surface-bright/50 border border-outline/25 p-3 rounded-2xl space-y-3 text-left">
                  <span className="text-[10px] text-on-surface/50 font-bold block">提交消息</span>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="输入提交备忘记录..."
                    className="w-full text-[11px] p-2 bg-surface text-on-surface border border-outline/25 rounded-lg focus:border-primary outline-none"
                  />

                  {/* Professional Git & GPG Signature Custom Configurations */}
                  <div className="border-t border-outline/10 pt-2.5 space-y-2.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-on-surface/65 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-primary" />
                        <span>签署提交</span>
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gpgSign}
                          onChange={(e) => setGpgSign(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-outline/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface/80 after:border-outline/30 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                        <span className="text-[9px] text-on-surface/40 font-bold block">作者用户名</span>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="git-username"
                          className="w-full text-[10px] px-2 py-1 bg-surface text-on-surface border border-outline/20 rounded outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-on-surface/40 font-bold block">签署电子邮件</span>
                        <input
                          type="text"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full text-[10px] px-2 py-1 bg-surface text-on-surface border border-outline/20 rounded outline-none focus:border-primary font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-1 border-t border-outline/5">
                    <button
                      onClick={handleCommit}
                      disabled={loading || statusData.files.length === 0}
                      className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/20 hover:text-white border border-primary/30 text-primary rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 disabled:opacity-35 disabled:pointer-events-none"
                      title="保存现有更改到版本历史里"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>仅提交更改</span>
                    </button>
                    
                    <button
                      onClick={async () => {
                        await handleCommit();
                        await handlePush();
                      }}
                      disabled={loading || (statusData.files.length === 0 && !remoteUrl)}
                      className="flex-1 py-1.5 bg-primary hover:bg-primary-hover text-bg rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm disabled:opacity-35 disabled:pointer-events-none"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>提交并全量推送</span>
                    </button>
                  </div>
                </div>

                {/* File Change Categories */}
                <div className="space-y-3.5 select-text text-left">
                  
                  {/* Staged Changes (已暂存) */}
                  {stagedFiles.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10.5px] font-extrabold text-emerald-400">已暂存的更改 ({stagedFiles.length})</span>
                      </div>
                      <div className="space-y-1 border-l border-emerald-500/20 pl-2">
                        {stagedFiles.map((file, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleViewFileDiff(file.name)}
                            className="flex justify-between items-center py-1 text-[11px] hover:bg-on-surface/5 px-2 rounded-md group cursor-pointer"
                            title="点击对比查看工作区文件差异 & 解除冲突"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <FileText className="w-3.5 h-3.5 text-on-surface/40 group-hover:text-primary" />
                              <span className="font-mono truncate text-on-surface/80 group-hover:text-primary transition-colors" title={file.name}>{file.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">查看差异 →</span>
                              <span className="text-[10px] shrink-0 font-extrabold px-1 text-emerald-400 font-mono scale-90">
                                {file.status === 'untracked' ? '新加' : '已更改'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Changes (未暂存) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10.5px] font-extrabold text-on-surface/70">待暂存的变更 ({unstagedFiles.length})</span>
                      {unstagedFiles.length > 0 && (
                        <button
                          onClick={() => stageFile()}
                          disabled={loading}
                          className="text-[9.5px] text-primary hover:underline cursor-pointer font-bold flex items-center gap-0.5"
                        >
                          <Plus className="w-2.5 h-2.5" /> 暂存全部
                        </button>
                      )}
                    </div>
                    {unstagedFiles.length === 0 ? (
                      <p className="text-[11px] text-on-surface/35 py-3 text-center bg-on-surface/5 border border-dashed border-outline/10 rounded-xl">
                        未检测到新的文件变动
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {unstagedFiles.map((file, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 text-[11px] hover:bg-on-surface/5 px-2 rounded-md group">
                            <div 
                              onClick={() => handleViewFileDiff(file.name)}
                              className="flex items-center gap-1.5 truncate flex-1 cursor-pointer"
                              title="点击对比查看工作区文件差异 & 解除冲突"
                            >
                              <FileText className="w-3.5 h-3.5 text-on-surface/40 group-hover:text-primary" />
                              <span className="font-mono truncate text-on-surface group-hover:text-primary transition-colors" title={file.name}>{file.name}</span>
                              <span className="text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 font-bold font-sans">对比</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9.5px] shrink-0 font-extrabold px-1 rounded font-mono ${
                                file.status === 'untracked' 
                                  ? 'text-emerald-500 bg-emerald-500/10' 
                                  : file.status === 'deleted'
                                    ? 'text-rose-500 bg-rose-500/10'
                                    : 'text-amber-500 bg-amber-500/10'
                              }`}>
                                {file.status === 'untracked' ? 'U' : file.status === 'deleted' ? 'D' : 'M'}
                              </span>
                              <button
                                onClick={() => stageFile(file.name)}
                                className="hidden group-hover:flex p-0.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-bg rounded cursor-pointer"
                                title="暂存此文件变更"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* 2.0 Beautiful Cloud Sync & Git Push Panel */}
                <div className="bg-surface-bright/50 border border-outline/25 p-3 rounded-2xl space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] text-on-surface/50 font-bold uppercase tracking-wider">远程仓库同步</span>
                    </div>
                    {remoteUrl && (
                      <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                        已连接
                      </span>
                    )}
                  </div>

                  {remoteUrl ? (
                    <div className="space-y-2.5">
                      <div className="bg-surface/60 rounded-xl p-2.5 border border-outline/10 space-y-1.5">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-on-surface/40">目标仓库</span>
                          <span className="font-mono text-on-surface/85 truncate max-w-[170px] font-semibold" title={remoteUrl}>
                            {remoteUrl.replace(/https:\/\/|[a-zA-Z0-9_-]+@/g, '').replace(/\.git$/, '')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-on-surface/40">分支/Branch</span>
                          <span className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {targetBranch || statusData.branch || 'main'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-on-surface/40">推送认证</span>
                          <span className={`font-mono text-[10px] font-bold flex items-center gap-1 ${accessToken ? 'text-emerald-400' : 'text-amber-500'}`}>
                            <Lock className="w-2.5 h-2.5" />
                            {accessToken ? '已配置 Token' : '未提供 Token'}
                          </span>
                        </div>
                      </div>

                      {pushProgress !== null ? (
                        <div className="w-full py-4.5 flex flex-col items-center justify-center bg-surface-bright border border-primary/20 rounded-xl space-y-2.5 animate-pulse">
                          <div className="relative flex items-center justify-center w-12 h-12">
                            {pushSuccessState ? (
                              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <Check className="w-4.5 h-4.5 stroke-[3]" />
                              </div>
                            ) : (
                              <>
                                <svg className="w-12 h-12 transform -rotate-90">
                                  <circle
                                    className="text-on-surface/5"
                                    strokeWidth="3.5"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="20"
                                    cx="24"
                                    cy="24"
                                  />
                                  <circle
                                    className="text-primary transition-all duration-150"
                                    strokeWidth="4"
                                    strokeDasharray={2 * Math.PI * 20}
                                    strokeDashoffset={2 * Math.PI * 20 - (pushProgress / 100) * (2 * Math.PI * 20)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="20"
                                    cx="24"
                                    cy="24"
                                  />
                                </svg>
                                <span className="absolute text-[10px] font-black text-on-surface/90 font-mono">
                                  {pushProgress}%
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <p className="text-[10.5px] font-extrabold text-on-surface">
                              {pushSuccessState ? (
                                <span className="text-emerald-400 flex items-center gap-1 justify-center">
                                  <span>推送已完成！</span>
                                </span>
                              ) : (
                                <span className="text-primary">正在进行远程代码备份推送...</span>
                              )}
                            </p>
                            <p className="text-[9px] text-on-surface/40 font-mono mt-0.5">
                              {pushSuccessState ? `已提交到分支 ${targetBranch || 'main'}` : `正在发送加密数据包到 ${targetBranch || 'main'}`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handlePush}
                          disabled={loading}
                          className="w-full py-2 bg-primary hover:bg-primary-hover active:scale-[0.98] text-[11px] text-bg font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/5 disabled:opacity-45"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>立即推送至远程仓库</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-surface/40 border border-dashed border-outline/20 rounded-xl p-3 text-center space-y-2.5">
                      <p className="text-[10.5px] text-on-surface/50 leading-relaxed max-w-xs mx-auto">
                        尚未配置远程 GitHub / GitLab 仓库链接。配置后，可一键推送备份项目。
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('preferences')}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 hover:bg-primary/20 hover:text-white border border-primary/20 text-primary text-[10px] font-black rounded-lg cursor-pointer transition-all"
                      >
                        <Settings className="w-3 h-3" />
                        <span>前往配置远程 & 认证 →</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 2. HISTORY LIST TAB */}
            {activeSubTab === 'history' && (
              <div className="space-y-3 text-left">
                <span className="text-[10px] text-on-surface/50 font-bold block">本地及历史推送记录 ({statusData.commits.length})</span>
                {statusData.commits.length === 0 ? (
                  <p className="text-[11px] text-on-surface/35 py-6 text-center border border-dashed border-outline/10 rounded-xl">
                    还没有生成过任何代码提交历史。
                  </p>
                ) : (
                  <div className="space-y-2 select-text">
                    {statusData.commits.map((log, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleViewDiff(log.hash)}
                        className="w-full p-2.5 bg-surface-bright/40 border border-outline/15 rounded-xl hover:border-primary/40 hover:bg-on-surface/5 transition-all text-left flex flex-col gap-1 cursor-pointer group"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-mono text-[9.5px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold group-hover:underline">
                            {log.hash}
                          </span>
                          <span className="text-[9.5px] text-on-surface/40 font-mono">
                            {log.relativeTime}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-on-surface leading-snug group-hover:text-primary">
                          {log.message}
                        </p>
                        <div className="flex justify-between items-center w-full mt-1.5 text-[9px] text-on-surface/40 border-t border-outline/10 pt-1">
                          <span className="font-mono">提交者：{log.author}</span>
                          <span className="text-primary font-bold group-hover:translate-x-0.5 transition-transform">查看 Diff →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PREFERENCES TAB */}
            {activeSubTab === 'preferences' && (
              <div className="space-y-4 text-left">
                
                {/* Author configuration section */}
                <div className="bg-surface-bright/50 border border-outline/20 p-3 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-outline/10">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-extrabold text-on-surface">提交人签名配置</span>
                  </div>
                  
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[9.5px] text-on-surface/50 font-bold flex items-center gap-1">
                        用户名
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="例如：github_username"
                        className="w-full text-[10.5px] px-2.5 py-1.5 bg-surface text-on-surface border border-outline/25 rounded-lg outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] text-on-surface/50 font-bold flex items-center gap-1">
                        注册邮箱
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="例如：user@domain.com"
                        className="w-full text-[10.5px] px-2.5 py-1.5 bg-surface text-on-surface border border-outline/25 rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Remote origin & credential tokens section */}
                <div className="bg-surface-bright/50 border border-outline/20 p-3 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-outline/10">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-extrabold text-on-surface">远程仓库连接配置</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[9.5px] text-on-surface/50 font-bold">
                        仓库远程 HTTPS 链接
                      </label>
                      <input
                        type="text"
                        value={remoteUrl}
                        onChange={(e) => setRemoteUrl(e.target.value)}
                        placeholder="https://github.com/username/repo-name.git"
                        className="w-full text-[10.5px] px-2.5 py-1.5 bg-surface text-on-surface border border-outline/25 rounded-lg outline-none focus:border-primary font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] text-on-surface/50 font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 shrink-0" />
                        <span>个人访问密钥</span>
                      </label>
                      <input
                        type="password"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="GitHub Personal Access Token (ghp_***)"
                        className="w-full text-[10.5px] px-2.5 py-1.5 bg-surface text-on-surface border border-outline/25 rounded-lg outline-none focus:border-primary font-mono"
                        title="用于推送认证，只保存在本地浏览器"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] text-on-surface/50 font-bold">
                        目标推送分支
                      </label>
                      <input
                        type="text"
                        value={targetBranch}
                        onChange={(e) => setTargetBranch(e.target.value)}
                        placeholder="main"
                        className="w-full text-[10.5px] px-2.5 py-1.5 bg-surface text-on-surface border border-outline/25 rounded-lg outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveConfig}
                  disabled={loading}
                  className="w-full py-2 bg-primary hover:bg-primary-hover text-bg rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>保存并应用配置</span>
                </button>

              </div>
            )}

          </div>

        </div>
      )}

      {/* Diff Detail Sheet / Modal overlay */}
      {showDiffModal && (
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-md z-[100] flex flex-col animate-fade-in select-text">
          <div className="bg-surface border-b border-outline/30 px-3.5 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-mono px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                Commit: {selectedCommitHash}
              </span>
              <span className="text-[11px] font-extrabold text-on-surface">版本差异详情</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowDiffModal(false);
                setSelectedCommitDiff(null);
                setSelectedCommitHash(null);
              }}
              className="p-1 hover:bg-on-surface/10 rounded-md text-on-surface/60 hover:text-on-surface transition-colors cursor-pointer"
              title="关闭详情"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-neutral-950/90 text-left">
            <div className="flex items-center justify-between border-b border-outline/10 pb-2">
              <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-black block">差异详情</span>
              <button
                onClick={() => {
                  if (selectedCommitDiff) {
                    navigator.clipboard.writeText(selectedCommitDiff);
                    showFeedback('success', '版本差异内容已复制到剪贴板！');
                  }
                }}
                className="text-[10px] text-primary hover:underline font-bold"
              >
                复制全量差异
              </button>
            </div>
            {renderDiff(selectedCommitDiff)}
          </div>
        </div>
      )}

      {/* File Diff & Conflict Resolution Modal overlay */}
      {showFileDiffModal && (
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-md z-[100] flex flex-col animate-fade-in select-text">
          <div className="bg-surface border-b border-outline/30 px-3.5 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-black shadow-sm ${viewingFileHasConflict ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                {viewingFileHasConflict ? '检测到合并冲突' : '工作区差异对比'}
              </span>
              <span className="text-[11px] font-black font-mono text-on-surface truncate max-w-[120px]" title={viewingFileName || ''}>
                {viewingFileName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFileDiffModal(false);
                setViewingFileName(null);
                setViewingFileDiff(null);
                setViewingFileHasConflict(false);
              }}
              className="p-1 hover:bg-on-surface/10 rounded-md text-on-surface/60 hover:text-on-surface transition-colors cursor-pointer"
              title="关闭差异面板"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conflict Resolution Toolbar */}
          {viewingFileHasConflict && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2.5 space-y-2 text-left shrink-0">
              <div className="flex items-start gap-1.5 text-amber-500">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10.5px] font-bold">快照版本冲突提示</h4>
                  <p className="text-[9.5px] text-on-surface/75 leading-relaxed mt-0.5">
                    检测到本地代码行与传入版本存在无法自动合并的重叠冲突。请点击下方按钮快速裁定代码保留：
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleResolveConflict('ours')}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-[10px] rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3 h-3" />
                  <span>保留当前修改</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveConflict('theirs')}
                  className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-[10px] rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowUp className="w-3 h-3" />
                  <span>保留传入修改</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveConflict('both')}
                  className="px-2.5 py-1.5 bg-on-surface/10 hover:bg-on-surface/20 active:scale-95 text-on-surface font-extrabold text-[10px] rounded-lg cursor-pointer transition-all"
                  title="顺序保留两者内容"
                >
                  保留双方修改
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-neutral-950/90 text-left">
            <div className="flex justify-between items-center border-b border-outline/10 pb-2">
              <span className="text-[10px] text-on-surface/40 uppercase tracking-widest font-black block font-mono">
                {viewingFileHasConflict ? '冲突代码行渲染' : '工作区未提交变更'}
              </span>
              <span className="text-[9.5px] font-mono text-on-surface/40">
                双击可选择复制
              </span>
            </div>
            {renderDiff(viewingFileDiff, viewingFileHasConflict)}
          </div>
        </div>
      )}
    </div>
  );
}
