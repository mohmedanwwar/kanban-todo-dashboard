// src/hooks/useTasksQuery.js
// ─────────────────────────────────────────────────────────────
// React Query wrappers around the mock API.
// All cache keys include column + page + search so each
// combination is independently cached and invalidated.
// ─────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ── Switch API source here ─────────────────────────────────────
// Option A (default): localStorage mock — no server needed
import { fetchTasks, createTask, updateTask, deleteTask, moveTask } from "../utils/mockApi";
// Option B: json-server on http://localhost:4000
// Run: json-server --watch db.json --port 4000
// Then comment out Option A above and uncomment the line below:
// import { fetchTasks, createTask, updateTask, deleteTask, moveTask } from "../utils/realApi";

export const TASKS_KEY = "tasks";

// ── Query: paginated task list per column ─────────────────────
export function useTasksQuery({ column, page, search }) {
  return useQuery({
    queryKey: [TASKS_KEY, column, page, search],
    queryFn: () => fetchTasks({ column, page, limit: 5, search }),
    keepPreviousData: true, // smooth pagination – don't flash empty state
    staleTime: 30_000,      // treat data as fresh for 30 s
  });
}

// ── Mutation: create ──────────────────────────────────────────
export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

// ── Mutation: update ──────────────────────────────────────────
export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => updateTask(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

// ── Mutation: delete ──────────────────────────────────────────
export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

// ── Mutation: move (drag-and-drop) ────────────────────────────
export function useMoveTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, column }) => moveTask(id, column),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}
