import { useMemo, useState } from 'react';
import { Check, Command, Copy, Search, Terminal } from 'lucide-react';

type CommandKind = 'CLI' | 'FLAG' | 'REPL';

type CommandOption = {
  flag: string;
  desc: string;
};

type CommandItem = {
  id: string;
  cmd: string;
  desc: string;
  kind: CommandKind;
  category: string;
  options: CommandOption[];
};

const commands: CommandItem[] = [
  {
    id: 'cli-start',
    cmd: 'claude',
    desc: '启动交互式会话（REPL）。',
    kind: 'CLI',
    category: 'CLI 会话',
    options: [],
  },
  {
    id: 'cli-start-with-query',
    cmd: 'claude "query"',
    desc: '启动交互式会话，并带上初始提问。',
    kind: 'CLI',
    category: 'CLI 会话',
    options: [],
  },
  {
    id: 'cli-print',
    cmd: 'claude -p "query"',
    desc: '打印模式：执行一次询问并退出，适合脚本化调用。',
    kind: 'CLI',
    category: 'CLI 会话',
    options: [
      { flag: '--output-format <text|json|stream-json>', desc: '指定输出格式（打印模式）' },
      { flag: '--max-turns <N>', desc: '限制 Agent 轮数（打印模式）' },
      { flag: '--max-budget-usd <金额>', desc: '限制 API 最大预算（打印模式）' },
    ],
  },
  {
    id: 'cli-pipe',
    cmd: 'cat file | claude -p "query"',
    desc: '通过管道输入文件内容，让 Claude 在打印模式下处理。',
    kind: 'CLI',
    category: 'CLI 会话',
    options: [],
  },
  {
    id: 'cli-continue',
    cmd: 'claude -c',
    desc: '在当前目录继续最近一次会话。',
    kind: 'CLI',
    category: 'CLI 会话续接',
    options: [],
  },
  {
    id: 'cli-continue-print',
    cmd: 'claude -c -p "query"',
    desc: '继续最近会话，并用打印模式执行一次询问。',
    kind: 'CLI',
    category: 'CLI 会话续接',
    options: [],
  },
  {
    id: 'cli-resume',
    cmd: 'claude -r "<session>" "query"',
    desc: '通过会话 ID 或会话名恢复会话并继续执行任务。',
    kind: 'CLI',
    category: 'CLI 会话续接',
    options: [
      { flag: '--fork-session', desc: '恢复会话后创建新会话 ID，不复用原会话' },
      { flag: '--name, -n "<name>"', desc: '为当前会话设置显示名（也可用于恢复）' },
    ],
  },
  {
    id: 'cli-update',
    cmd: 'claude update',
    desc: '更新 Claude Code 到最新版本。',
    kind: 'CLI',
    category: 'CLI 更新',
    options: [],
  },
  {
    id: 'cli-auth-login',
    cmd: 'claude auth login',
    desc: '登录并完成认证。',
    kind: 'CLI',
    category: 'CLI 认证',
    options: [
      { flag: '--email <email>', desc: '预填邮箱' },
      { flag: '--sso', desc: '强制 SSO 登录流程' },
      { flag: '--console', desc: '使用 Anthropic Console 计费（API Key）而非订阅计费' },
    ],
  },
  {
    id: 'cli-auth-logout',
    cmd: 'claude auth logout',
    desc: '退出登录并清除认证信息。',
    kind: 'CLI',
    category: 'CLI 认证',
    options: [],
  },
  {
    id: 'cli-auth-status',
    cmd: 'claude auth status',
    desc: '输出当前认证状态（默认 JSON）。',
    kind: 'CLI',
    category: 'CLI 认证',
    options: [{ flag: '--text', desc: '使用人类可读的文本输出' }],
  },
  {
    id: 'cli-agents',
    cmd: 'claude agents',
    desc: '列出所有已配置的 subagents（按来源分组）。',
    kind: 'CLI',
    category: 'CLI 扩展与集成',
    options: [],
  },
  {
    id: 'cli-auto-mode-defaults',
    cmd: 'claude auto-mode defaults',
    desc: '打印内置 auto mode 分类器规则（JSON）。',
    kind: 'CLI',
    category: 'CLI 扩展与集成',
    options: [],
  },
  {
    id: 'cli-mcp',
    cmd: 'claude mcp',
    desc: '配置 MCP（Model Context Protocol）服务器。',
    kind: 'CLI',
    category: 'CLI 扩展与集成',
    options: [],
  },
  {
    id: 'cli-plugin',
    cmd: 'claude plugin',
    desc: '管理 Claude Code 插件（别名：claude plugins）。',
    kind: 'CLI',
    category: 'CLI 扩展与集成',
    options: [{ flag: 'install <name>@<marketplace>', desc: '安装插件' }],
  },
  {
    id: 'cli-remote-control',
    cmd: 'claude remote-control',
    desc: '启动 Remote Control 服务，便于从 Claude.ai / 客户端远程控制。',
    kind: 'CLI',
    category: 'CLI 扩展与集成',
    options: [{ flag: '--name "<Project Name>"', desc: '给远程控制会话设置展示名称' }],
  },
  {
    id: 'flag-remote',
    cmd: 'claude --remote "task description"',
    desc: '在 claude.ai 上创建一个新的 Web Session（会话/任务），并将任务描述发送过去。',
    kind: 'FLAG',
    category: 'Web 会话',
    options: [],
  },
  {
    id: 'flag-teleport',
    cmd: 'claude --teleport',
    desc: '将一个 Web Session “传送”回本地终端继续执行。',
    kind: 'FLAG',
    category: 'Web 会话',
    options: [],
  },
  {
    id: 'flag-model',
    cmd: 'claude --model <sonnet|opus|full-model-name>',
    desc: '指定本次会话使用的模型。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-add-dir',
    cmd: 'claude --add-dir <path...>',
    desc: '增加额外工作目录（授予文件访问权限）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-bare',
    cmd: 'claude --bare',
    desc: '最小化启动：跳过 hooks/skills/plugins/MCP/auto-memory/CLAUDE.md 的自动发现（脚本调用更快）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-chrome',
    cmd: 'claude --chrome',
    desc: '启用 Chrome 浏览器集成，用于 Web 自动化与测试。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-no-chrome',
    cmd: 'claude --no-chrome',
    desc: '禁用 Chrome 浏览器集成。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-allowed-tools',
    cmd: 'claude --allowedTools "<rule...>"',
    desc: '指定无需确认即可执行的工具权限规则（用于减少弹窗）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-disallowed-tools',
    cmd: 'claude --disallowedTools "<rule...>"',
    desc: '从会话上下文中移除某些工具，使其不可用。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-debug',
    cmd: 'claude --debug "<categories>"',
    desc: '开启调试日志，可按分类过滤（如 "api,mcp" 或 "!statsig,!file"）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-debug-file',
    cmd: 'claude --debug-file <path>',
    desc: '将调试日志写入指定文件（隐式开启 debug）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-settings',
    cmd: 'claude --settings <path|json>',
    desc: '加载额外 settings（文件路径或 JSON 字符串）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-setting-sources',
    cmd: 'claude --setting-sources user,project,local',
    desc: '指定要加载的设置来源（逗号分隔）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-session-id',
    cmd: 'claude --session-id "<uuid>"',
    desc: '为会话指定固定 Session ID（需为有效 UUID）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-no-session-persistence',
    cmd: 'claude -p --no-session-persistence "query"',
    desc: '打印模式下禁用会话持久化（不落盘，无法恢复）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-mcp-config',
    cmd: 'claude --mcp-config <path|json...>',
    desc: '从 JSON 文件/字符串加载 MCP 配置（可传多个，空格分隔）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-strict-mcp-config',
    cmd: 'claude --strict-mcp-config',
    desc: '仅使用 --mcp-config 指定的 MCP 配置，忽略其它来源。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-tools',
    cmd: 'claude --tools "Bash,Edit,Read"',
    desc: '限制 Claude 在会话中可使用的工具集合。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-permission-mode',
    cmd: 'claude --permission-mode <default|acceptEdits|plan|auto|dontAsk|bypassPermissions>',
    desc: '指定权限模式作为会话起始状态。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-dangerously-skip-permissions',
    cmd: 'claude --dangerously-skip-permissions',
    desc: '跳过权限确认（等价于 bypassPermissions）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-output-format',
    cmd: 'claude -p "query" --output-format <text|json|stream-json>',
    desc: '打印模式输出格式。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-verbose',
    cmd: 'claude --verbose',
    desc: '输出更详细的过程日志。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-system-prompt',
    cmd: 'claude --system-prompt "<text>"',
    desc: '用自定义系统提示词完全替换默认系统提示词（谨慎使用）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-system-prompt-file',
    cmd: 'claude --system-prompt-file <file>',
    desc: '用文件内容替换默认系统提示词（谨慎使用）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-append-system-prompt',
    cmd: 'claude --append-system-prompt "<text>"',
    desc: '在默认系统提示词后追加自定义规则（推荐方式）。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-append-system-prompt-file',
    cmd: 'claude --append-system-prompt-file <file>',
    desc: '从文件读取追加的系统提示词内容。',
    kind: 'FLAG',
    category: '启动参数',
    options: [],
  },
  {
    id: 'flag-worktree',
    cmd: 'claude -w <name>',
    desc: '在隔离的 git worktree 中启动 Claude 进行并行任务。',
    kind: 'FLAG',
    category: '启动参数',
    options: [{ flag: '--tmux', desc: '为 worktree 创建 tmux 会话（需要环境支持）' }],
  },
  {
    id: 'repl-help',
    cmd: '/help',
    desc: '显示帮助及可用命令。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-clear',
    cmd: '/clear',
    desc: '清空会话历史并释放上下文（别名：/reset, /new）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-compact',
    cmd: '/compact [instructions]',
    desc: '压缩上下文，可指定压缩关注点。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-context',
    cmd: '/context',
    desc: '查看当前上下文使用情况与优化建议。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-cost',
    cmd: '/cost',
    desc: '显示 Token 使用情况。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-doctor',
    cmd: '/doctor',
    desc: '诊断并验证 Claude Code 安装与设置。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-terminal-setup',
    cmd: '/terminal-setup',
    desc: '安装/配置终端快捷键绑定（例如 Shift+Enter 多行输入）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-copy',
    cmd: '/copy [N]',
    desc: '复制最近一次（或第 N 次）助手回复到剪贴板；若有代码块可交互选择。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-effort',
    cmd: '/effort [low|medium|high|max|auto]',
    desc: '设置模型 effort level（部分值可能需特定模型/套餐）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-fast',
    cmd: '/fast [on|off]',
    desc: '开启/关闭 fast mode。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-config',
    cmd: '/config',
    desc: '打开设置界面（别名：/settings）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-model',
    cmd: '/model [model]',
    desc: '选择或切换模型。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-permissions',
    cmd: '/permissions',
    desc: '查看或更新权限设置（别名：/allowed-tools）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-plan',
    cmd: '/plan [description]',
    desc: '直接进入 plan mode，可带上任务描述。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-resume',
    cmd: '/resume [session]',
    desc: '通过会话 ID/名称恢复会话（别名：/continue）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-rename',
    cmd: '/rename [name]',
    desc: '重命名当前会话（不传 name 会自动生成）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-diff',
    cmd: '/diff',
    desc: '打开交互式 diff 查看器（包含 turn diff）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-export',
    cmd: '/export [filename]',
    desc: '导出当前对话为纯文本，可直接写入文件。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-exit',
    cmd: '/exit',
    desc: '退出 CLI（别名：/quit）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-mcp',
    cmd: '/mcp',
    desc: '管理 MCP 服务器连接和 OAuth 认证。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-plugin',
    cmd: '/plugin',
    desc: '管理插件。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-rewind',
    cmd: '/rewind',
    desc: '回退对话/代码到之前状态（别名：/checkpoint）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-tasks',
    cmd: '/tasks',
    desc: '列出并管理后台任务。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-status',
    cmd: '/status',
    desc: '打开状态页：版本、模型、账号、连接等。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-theme',
    cmd: '/theme',
    desc: '切换主题（包含暗色/亮色及 ANSI 主题）。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
  {
    id: 'repl-btw',
    cmd: '/btw <question>',
    desc: '提出侧边问题，不写入主对话历史。',
    kind: 'REPL',
    category: 'REPL 内置命令',
    options: [],
  },
];

export default function ClaudeCommands() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const categories = ['全部', ...Array.from(new Set(commands.map(c => c.category)))];

  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        cmd.cmd.toLowerCase().includes(q) ||
        cmd.desc.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.kind.toLowerCase().includes(q) ||
        cmd.options.some(opt => opt.flag.toLowerCase().includes(q) || opt.desc.toLowerCase().includes(q));
      const matchesCategory = activeCategory === '全部' || cmd.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <Terminal className="w-8 h-8 text-indigo-500" />
          Claude 终端命令速查
        </h1>
        <p className="text-zinc-500 mt-2">查询 Claude Code（CLI + / 斜杠命令）常用指令、参数和使用说明。</p>
      </div>

      <div className="shrink-0 space-y-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索命令或描述 (如 'auth', '清理上下文')..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-base focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-zinc-100 shadow-sm transition-shadow"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-6 min-h-0 space-y-4">
        {filteredCommands.length > 0 ? (
          filteredCommands.map((cmd) => (
            <div 
              key={cmd.id} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {cmd.kind}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
                      {cmd.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Command className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                    <code className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                      {cmd.cmd}
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                    {cmd.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(cmd.id, cmd.cmd)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copiedId === cmd.id
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {copiedId === cmd.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === cmd.id ? '已复制' : '复制命令'}
                </button>
              </div>

              {cmd.options.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">参数 / Options</div>
                  <ul className="space-y-2">
                    {cmd.options.map((opt, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 text-sm">
                        <code className="font-mono text-indigo-600 dark:text-indigo-400 shrink-0 sm:w-32 bg-zinc-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded inline-block">
                          {opt.flag}
                        </code>
                        <span className="text-zinc-600 dark:text-zinc-400">{opt.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Terminal className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <p>未找到匹配的终端命令</p>
          </div>
        )}
      </div>
    </div>
  );
}
