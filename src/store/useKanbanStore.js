// src/store/useKanbanStore.js
// ─────────────────────────────────────────────────────────────────────────────
// Zustand store holds UI state that is shared across components:
//   • global search query
//   • which task dialog is open and in what mode (create / edit)
// Async server state (tasks list) lives in React Query – not here.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";

const useKanbanStore = create((set) => ({
  // ── Search ──────────────────────────────────────────────────────────────────
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  // ── Task Dialog ─────────────────────────────────────────────────────────────
  // mode: "create" | "edit" | null
  dialogMode: null,
  // The task being edited (null when creating)
  editingTask: null,
  // Pre-selected column when opening the "create" dialog from a column header
  defaultColumn: "backlog",

  openCreateDialog: (column = "backlog") =>
    set({ dialogMode: "create", editingTask: null, defaultColumn: column }),

  openEditDialog: (task) =>
    set({ dialogMode: "edit", editingTask: task, defaultColumn: task.column }),

  closeDialog: () =>
    set({ dialogMode: null, editingTask: null }),
}));

export default useKanbanStore;
