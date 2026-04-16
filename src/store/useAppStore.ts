import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

export type SalarySettings = {
  monthlyGross: string;
  workDaysPerMonth: string;
  workStart: string;
  workEnd: string;
  breakStart: string;
  breakMinutes: string;
  onlyWeekdays: boolean;
  socialInsurance: string;
  specialDeduction: string;
};

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  clearRecentTools: () => void;
  salarySettings: SalarySettings;
  setSalarySettings: (patch: Partial<SalarySettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      recentTools: [],
      addRecentTool: (toolId) => set((state) => {
        const filtered = state.recentTools.filter(id => id !== toolId);
        return {
          recentTools: [toolId, ...filtered].slice(0, 12) // Keep max 12 items
        };
      }),
      clearRecentTools: () => set({ recentTools: [] }),

      salarySettings: {
        monthlyGross: '20000',
        workDaysPerMonth: '22',
        workStart: '09:00',
        workEnd: '18:00',
        breakStart: '12:00',
        breakMinutes: '60',
        onlyWeekdays: true,
        socialInsurance: '0',
        specialDeduction: '0',
      },
      setSalarySettings: (patch) =>
        set((state) => ({
          salarySettings: { ...state.salarySettings, ...patch },
        })),
    }),
    {
      name: 'toolbox-storage',
    }
  )
);
