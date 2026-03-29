// src/utils/columns.js
// Column definitions – single source of truth for IDs, labels and colours.

export const COLUMNS = [
  {
    id: "backlog",
    label: "Backlog",
    color: "#6366f1",   // indigo
    lightBg: "#eef2ff",
    icon: "📋",
  },
  {
    id: "in_progress",
    label: "In Progress",
    color: "#f59e0b",   // amber
    lightBg: "#fffbeb",
    icon: "⚡",
  },
  {
    id: "review",
    label: "Review",
    color: "#8b5cf6",   // violet
    lightBg: "#f5f3ff",
    icon: "🔍",
  },
  {
    id: "done",
    label: "Done",
    color: "#10b981",   // emerald
    lightBg: "#ecfdf5",
    icon: "✅",
  },
];

export const COLUMN_MAP = Object.fromEntries(COLUMNS.map((c) => [c.id, c]));
