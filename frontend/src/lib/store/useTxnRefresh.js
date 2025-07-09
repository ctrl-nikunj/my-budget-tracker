import { create } from "zustand";

export const useTxnRefresh = create((set) => ({
  refreshTxn: 0,
  triggerTxnRefresh: () =>
    set((state) => ({ refreshTxn: state.refreshTxn + 1 })),
}));
