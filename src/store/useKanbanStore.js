// src/store/useKanbanStore.js
// ─────────────────────────────────────────────────────────────
// Zustand store for lightweight, synchronous UI state.
// React Query handles all server/cache state; Zustand manages:
//  • global search query
//  • which task is being edited / created
//  • drag-and-drop in-flight state
// ─────────────────────────────────────────────────────────────

import { create } from "zustand";

const useKanbanStore = create((set) => ({
  // ── Search ────────────────────────────────────────────────
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  // ── Task modal ────────────────────────────────────────────
  // null → closed | { mode:'create', column } | { mode:'edit', task }
  taskModal: null,
  openCreateModal: (column) => set({ taskModal: { mode: "create", column } }),
  openEditModal: (task) => set({ taskModal: { mode: "edit", task } }),
  closeModal: () => set({ taskModal: null }),

  // ── Delete confirmation ───────────────────────────────────
  deleteTarget: null, // task id
  openDeleteConfirm: (id) => set({ deleteTarget: id }),
  closeDeleteConfirm: () => set({ deleteTarget: null }),
}));

export default useKanbanStore;
