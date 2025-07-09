import { create } from "zustand";

export const useFdsRefresh = create((set) => ({
  refreshFds: 0,
  triggerFdsRefresh: () =>
    set((state) => ({ refreshFds: state.refreshFds + 1 })),
}));
