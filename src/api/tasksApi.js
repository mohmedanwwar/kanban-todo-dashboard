// ─────────────────────────────────────────────────────────────────────────────
// Mock API that persists tasks to localStorage.
// Swap fetchTasks / createTask / updateTask / deleteTask with real axios calls
// when you have a backend (e.g. json-server at http://localhost:4000/tasks).
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "kanban_tasks";

// ── Seed data shown on first load ─────────────────────────────────────────────
const SEED_TASKS = [
  {
    id: uuidv4(),
    title: "Design System Setup",
    description: "Define color tokens, typography scale, and component library.",
    column: "done",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Database Schema",
    description: "Design ERD and write migration scripts for PostgreSQL.",
    column: "done",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: uuidv4(),
    title: "API Authentication",
    description: "Implement JWT access tokens and refresh token rotation.",
    column: "review",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Dashboard UI",
    description: "Build the main Kanban board with drag-and-drop support.",
    column: "in_progress",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Unit Tests",
    description: "Write Jest tests for all API service functions.",
    column: "in_progress",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Mobile Responsive Layout",
    description: "Ensure the board works perfectly on small screens.",
    column: "backlog",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Dark Mode Support",
    description: "Add theme toggle persisted to user preferences.",
    column: "backlog",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "CI/CD Pipeline",
    description: "Set up GitHub Actions for lint, test, and deploy steps.",
    column: "backlog",
    createdAt: new Date().toISOString(),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  // First visit – persist seed data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TASKS));
  return SEED_TASKS;
};

const save = (tasks) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch tasks with optional filtering and pagination.
 * @param {object} params
 * @param {string}  params.search   – filter by title / description (case-insensitive)
 * @param {string}  params.column   – filter by column id
 * @param {number}  params.page     – 1-based page number
 * @param {number}  params.limit    – items per page
 * @returns {{ tasks: Task[], total: number, totalPages: number }}
 */
export const fetchTasks = async ({
  search = "",
  column = "",
  page = 1,
  limit = 10,
} = {}) => {
  await delay(250);
  let tasks = load();

  if (search) {
    const q = search.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  if (column) {
    tasks = tasks.filter((t) => t.column === column);
  }

  // Sort newest first
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = tasks.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = tasks.slice(start, start + limit);

  return { tasks: paginated, total, totalPages };
};

/**
 * Create a new task.
 * @param {{ title: string, description: string, column: string }} data
 * @returns {Task}
 */
export const createTask = async (data) => {
  await delay(300);
  const tasks = load();
  const newTask = {
    id: uuidv4(),
    title: data.title.trim(),
    description: data.description?.trim() ?? "",
    column: data.column ?? "backlog",
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(newTask);
  save(tasks);
  return newTask;
};

/**
 * Update an existing task (partial update).
 * @param {string} id
 * @param {Partial<Task>} changes
 * @returns {Task}
 */
export const updateTask = async (id, changes) => {
  await delay(250);
  const tasks = load();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error(`Task ${id} not found`);
  tasks[idx] = { ...tasks[idx], ...changes };
  save(tasks);
  return tasks[idx];
};

/**
 * Delete a task by id.
 * @param {string} id
 */
export const deleteTask = async (id) => {
  await delay(200);
  const tasks = load().filter((t) => t.id !== id);
  save(tasks);
};
