// src/hooks/useTasks.js
// ─────────────────────────────────────────────────────────────────────────────
// All React Query hooks for task CRUD + column-level pagination.
// React Query handles caching, background refetches, and optimistic updates.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasksApi";

// ── Constants ─────────────────────────────────────────────────────────────────
export const COLUMNS = [
  { id: "backlog",     label: "Backlog",     color: "#94a3b8" },
  { id: "in_progress", label: "In Progress", color: "#f59e0b" },
  { id: "review",      label: "Review",      color: "#a78bfa" },
  { id: "done",        label: "Done",        color: "#34d399" },
];

export const TASKS_PER_PAGE = 5;

// ── Query key factory ─────────────────────────────────────────────────────────
export const taskKeys = {
  all: ["tasks"],
  column: (column, page, search) => ["tasks", column, page, search],
};

// ── useColumnTasks ─────────────────────────────────────────────────────────────
/**
 * Fetches a single paginated column of tasks, filtered by search query.
 * @param {string} column   – column id
 * @param {number} page     – current page (1-based)
 * @param {string} search   – global search string
 */
export const useColumnTasks = (column, page, search) =>
  useQuery({
    queryKey: taskKeys.column(column, page, search),
    queryFn: () =>
      fetchTasks({ column, page, limit: TASKS_PER_PAGE, search }),
    keepPreviousData: true,      // smooth pagination (no flash)
    staleTime: 30_000,           // 30 s cache
  });

// ── useCreateTask ─────────────────────────────────────────────────────────────
export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
};

// ── useUpdateTask ─────────────────────────────────────────────────────────────
export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }) => updateTask(id, changes),
    // Optimistic update: instantly reflect column change in the cache
    onMutate: async ({ id, changes }) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const snapshots = {};
      qc.getQueriesData({ queryKey: taskKeys.all }).forEach(([key, data]) => {
        if (data?.tasks) snapshots[JSON.stringify(key)] = data;
      });
      qc.setQueriesData({ queryKey: taskKeys.all }, (old) => {
        if (!old?.tasks) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === id ? { ...t, ...changes } : t
          ),
        };
      });
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      // Roll back on error
      Object.entries(ctx.snapshots).forEach(([key, data]) => {
        qc.setQueryData(JSON.parse(key), data);
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
};

// ── useDeleteTask ─────────────────────────────────────────────────────────────
export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
};
