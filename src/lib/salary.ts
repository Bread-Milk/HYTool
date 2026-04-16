import type { SalarySettings } from '@/store/useAppStore';

function toMinutesOfDay(time: string) {
  const [h, m] = time.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  const start = Math.max(aStart, bStart);
  const end = Math.min(aEnd, bEnd);
  return Math.max(0, end - start);
}

export function formatMoney(n: number) {
  if (!Number.isFinite(n)) return '0.00';
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function calcMonthlyTax(taxable: number) {
  const x = Math.max(0, taxable);
  const brackets = [
    { upTo: 3000, rate: 0.03, quick: 0 },
    { upTo: 12000, rate: 0.1, quick: 210 },
    { upTo: 25000, rate: 0.2, quick: 1410 },
    { upTo: 35000, rate: 0.25, quick: 2660 },
    { upTo: 55000, rate: 0.3, quick: 4410 },
    { upTo: 80000, rate: 0.35, quick: 7160 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.45, quick: 15160 },
  ];
  const b = brackets.find((t) => x <= t.upTo)!;
  return x * b.rate - b.quick;
}

export function computeSalary(now: Date, settings: SalarySettings) {
  const gross = Number(settings.monthlyGross);
  const workDays = Number(settings.workDaysPerMonth);
  const si = Number(settings.socialInsurance);
  const sd = Number(settings.specialDeduction);

  const start = toMinutesOfDay(settings.workStart);
  const end = toMinutesOfDay(settings.workEnd);
  const bStart = toMinutesOfDay(settings.breakStart);
  const bMin = Number(settings.breakMinutes);

  const safeGross = Number.isFinite(gross) ? gross : 0;
  const safeWorkDays = Number.isFinite(workDays) ? workDays : 0;
  const safeSi = Number.isFinite(si) ? si : 0;
  const safeSd = Number.isFinite(sd) ? sd : 0;
  const safeBMin = Number.isFinite(bMin) ? bMin : 0;

  const taxable = safeGross - 5000 - safeSi - safeSd;
  const tax = calcMonthlyTax(taxable);
  const net = safeGross - safeSi - Math.max(0, tax);

  const workMinutes = start == null || end == null ? 0 : Math.max(0, end - start);
  const breakOver =
    bStart == null || start == null || end == null
      ? 0
      : overlap(bStart, bStart + Math.max(0, safeBMin), start, end);
  const paidMinutes = Math.max(0, workMinutes - breakOver);

  const dailyNet = safeWorkDays > 0 ? Math.max(0, net) / safeWorkDays : 0;
  const perMinute = paidMinutes > 0 ? dailyNet / paidMinutes : 0;
  const perHour = perMinute * 60;

  const day = now.getDay();
  const isWeekday = day >= 1 && day <= 5;
  if (settings.onlyWeekdays && !isWeekday) {
    return {
      taxable: Math.max(0, taxable),
      tax: Math.max(0, tax),
      net: Math.max(0, net),
      dailyNet,
      perHour,
      perMinute,
      paidMinutes,
      earned: 0,
      progress: 0,
      isWorkday: false,
    };
  }

  const m = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  if (paidMinutes <= 0 || start == null || end == null) {
    return {
      taxable: Math.max(0, taxable),
      tax: Math.max(0, tax),
      net: Math.max(0, net),
      dailyNet,
      perHour,
      perMinute,
      paidMinutes,
      earned: 0,
      progress: 0,
      isWorkday: true,
    };
  }

  const bEnd = bStart == null ? null : bStart + Math.max(0, safeBMin);
  const seg1Start = start;
  const seg1End = bStart == null ? end : clamp(bStart, start, end);
  const seg2Start = bEnd == null ? end : clamp(bEnd, start, end);
  const seg2End = end;

  const elapsed = overlap(seg1Start, seg1End, start, m) + overlap(seg2Start, seg2End, start, m);
  const paidElapsed = clamp(elapsed, 0, paidMinutes);

  const earned = paidElapsed * perMinute;
  const progress = paidMinutes > 0 ? paidElapsed / paidMinutes : 0;

  return {
    taxable: Math.max(0, taxable),
    tax: Math.max(0, tax),
    net: Math.max(0, net),
    dailyNet,
    perHour,
    perMinute,
    paidMinutes,
    earned,
    progress,
    isWorkday: true,
  };
}
