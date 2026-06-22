import { useState } from 'react';
import { Check, Clock, Copy, DollarSign, Pause, Play } from 'lucide-react';
import { formatMoney } from '@/lib/salary';
import { useSalaryEarned } from '@/hooks/useSalaryEarned';
import { useAppStore } from '@/store/useAppStore';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function SalaryTracker() {
  const [running, setRunning] = useState(true);
  const settings = useAppStore((s) => s.salarySettings);
  const setSalarySettings = useAppStore((s) => s.setSalarySettings);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const computed = useSalaryEarned({ enabled: running });

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const now = new Date();
  const nowText = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto flex flex-col pb-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            工资显示器
          </h1>
          <p className="text-zinc-500 mt-2">
            实时显示今天已经获得的税后工资，输入月薪与工作天数即可计算。
          </p>
        </div>
        <button
          onClick={() => setRunning((v) => !v)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? '暂停' : '继续'}
        </button>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium">
              <Clock className="w-4 h-4" />
              {nowText}
            </div>
            <div className="text-emerald-100 text-sm font-medium">今天已获得（税后，元）</div>
            <div className="text-5xl md:text-6xl font-black font-mono tracking-tight">
              {formatMoney(computed.earned)}
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 min-w-[220px]">
            <button
              onClick={() => handleCopy('earned', computed.earned.toFixed(2))}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-sm"
            >
              {copiedId === 'earned' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedId === 'earned' ? '已复制' : '复制金额'}
            </button>
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between text-xs text-emerald-50/90 mb-2">
                <span>{computed.isWorkday ? '今日进度' : '非工作日'}</span>
                <span>{computed.isWorkday ? `${Math.round(computed.progress * 100)}%` : '0%'}</span>
              </div>
              <div className="h-2 rounded-full bg-black/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/80"
                  style={{ width: `${clamp(computed.progress * 100, 0, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">输入参数</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">月薪（税前，元）</label>
              <input
                type="number"
                value={settings.monthlyGross}
                onChange={(e) => setSalarySettings({ monthlyGross: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">每月工作天数</label>
              <input
                type="number"
                value={settings.workDaysPerMonth}
                onChange={(e) => setSalarySettings({ workDaysPerMonth: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">上班时间</label>
              <input
                type="time"
                value={settings.workStart}
                onChange={(e) => setSalarySettings({ workStart: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">下班时间</label>
              <input
                type="time"
                value={settings.workEnd}
                onChange={(e) => setSalarySettings({ workEnd: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">午休开始</label>
              <input
                type="time"
                value={settings.breakStart}
                onChange={(e) => setSalarySettings({ breakStart: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">午休时长（分钟）</label>
              <input
                type="number"
                value={settings.breakMinutes}
                onChange={(e) => setSalarySettings({ breakMinutes: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">五险一金（每月，元）</label>
              <input
                type="number"
                value={settings.socialInsurance}
                onChange={(e) => setSalarySettings({ socialInsurance: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">专项附加扣除（每月，元）</label>
              <input
                type="number"
                value={settings.specialDeduction}
                onChange={(e) => setSalarySettings({ specialDeduction: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={settings.onlyWeekdays}
              onChange={(e) => setSalarySettings({ onlyWeekdays: e.target.checked })}
              className="rounded text-emerald-500 focus:ring-emerald-500"
            />
            仅在周一至周五计入“今天已获得”
          </label>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">计算结果</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <div className="text-xs font-medium text-zinc-500 mb-2">月应纳税所得额（估算）</div>
              <div className="text-xl font-black font-mono text-zinc-900 dark:text-white">{formatMoney(computed.taxable)}</div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <div className="text-xs font-medium text-zinc-500 mb-2">个税（估算，元）</div>
              <div className="text-xl font-black font-mono text-zinc-900 dark:text-white">{formatMoney(computed.tax)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <div className="text-xs font-medium text-zinc-500 mb-2">税后月到手（元）</div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-500">{formatMoney(computed.net)}</div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <div className="text-xs font-medium text-zinc-500 mb-2">税后日薪（元/天）</div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-500">{formatMoney(computed.dailyNet)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <div className="text-xs font-medium text-zinc-500 mb-2">税后时薪（元/小时）</div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-500">{formatMoney(computed.perHour)}</div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <div className="text-xs font-medium text-zinc-500 mb-2">税后单价（元/分钟）</div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-500">{formatMoney(computed.perMinute)}</div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 leading-relaxed">
            说明：税后计算为简化估算，默认使用「5000 元起征点 + 月度税率表」；实际到手金额可能受地区社保、公积金、年终奖、补贴等影响。
          </div>
        </div>
      </div>
    </div>
  );
}
