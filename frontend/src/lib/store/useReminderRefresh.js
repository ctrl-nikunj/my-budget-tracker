import { create } from "zustand";

export const useRemindersRefresh = create((set) => ({
  refreshReminders: 0,
  triggerRemindersRefresh: () =>
    set((state) => ({ refreshReminders: state.refreshReminders + 1 })),
}));
