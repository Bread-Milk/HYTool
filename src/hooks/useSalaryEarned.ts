import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { computeSalary } from '@/lib/salary';

export function useSalaryEarned(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const settings = useAppStore((s) => s.salarySettings);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);

  return useMemo(() => computeSalary(now, settings), [now, settings]);
}

