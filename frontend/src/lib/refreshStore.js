import { create } from "zustand";

export const useRefreshStore = create((set) => ({
  refreshTxn: 0,
  refreshReminders: 0,
  refreshFds: 0,

  triggerTxnRefresh: () =>
    set((state) => ({ refreshTxn: state.refreshTxn + 1 })),
  triggerRemindersRefresh: () =>
    set((state) => ({ refreshReminders: state.refreshReminders + 1 })),
  triggerFdsRefresh: () =>
    set((state) => ({ refreshFds: state.refreshFds + 1 })),
}));
