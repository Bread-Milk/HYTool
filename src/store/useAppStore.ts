import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  clearRecentTools: () => void;
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
    }),
    {
      name: 'toolbox-storage',
    }
  )
);
