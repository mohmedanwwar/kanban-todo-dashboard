// ─────────────────────────────────────────────────────────────────────────────
// Individual task card. Integrated with @dnd-kit/sortable for drag-and-drop.
// Supports edit and delete actions.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
  Skeleton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useKanbanStore from "../store/useKanbanStore";
import { useDeleteTask, COLUMNS } from "../hooks/useTasks";

// ── TaskCard ──────────────────────────────────────────────────────────────────
export default function TaskCard({ task }) {
  const { openEditDialog } = useKanbanStore();
  const deleteMutation = useDeleteTask();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const colMeta = COLUMNS.find((c) => c.id === task.column);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(task.id);
    setConfirmOpen(false);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 2.5,
          background: isDragging
            ? "rgba(99,102,241,0.15)"
            : "rgba(30,41,59,0.9)",
          border: "1px solid",
          borderColor: isDragging
            ? "rgba(99,102,241,0.6)"
            : "rgba(148,163,184,0.12)",
          backdropFilter: "blur(8px)",
          cursor: "grab",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "rgba(148,163,184,0.3)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <CardContent sx={{ p: "12px !important" }}>
          {/* Drag handle + actions row */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            {/* Drag handle */}
            <Box
              {...attributes}
              {...listeners}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#475569",
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
                "&:hover": { color: "#94a3b8" },
                mr: 0.5,
              }}
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>

            {/* Column chip */}
            <Chip
              label={colMeta?.label}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                backgroundColor: `${colMeta?.color}22`,
                color: colMeta?.color,
                border: `1px solid ${colMeta?.color}44`,
                flexGrow: 1,
                mx: 0.5,
              }}
            />

            {/* Edit & Delete */}
            <Stack direction="row" spacing={0.25}>
              <Tooltip title="Edit task">
                <IconButton
                  size="small"
                  onClick={() => openEditDialog(task)}
                  sx={{ color: "#6366f1", "&:hover": { color: "#818cf8" } }}
                >
                  <EditIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  onClick={() => setConfirmOpen(true)}
                  sx={{ color: "#f43f5e", "&:hover": { color: "#fb7185" } }}
                >
                  <DeleteIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Title */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              color: "#f1f5f9",
              fontSize: "0.85rem",
              lineHeight: 1.4,
              mb: 0.5,
              wordBreak: "break-word",
            }}
          >
            {task.title}
          </Typography>

          {/* Description */}
          {task.description && (
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.5,
                fontSize: "0.75rem",
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* Date */}
          <Typography
            variant="caption"
            sx={{ color: "#334155", display: "block", mt: 1, fontSize: "0.68rem" }}
          >
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Typography>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#1e293b",
            border: "1px solid rgba(148,163,184,0.15)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>
          Delete Task?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#94a3b8" }}>
            <strong style={{ color: "#f1f5f9" }}>{task.title}</strong> will be
            permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{ color: "#94a3b8", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ── Skeleton placeholder shown while loading ──────────────────────────────────
export function TaskCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        borderRadius: 2.5,
        background: "rgba(30,41,59,0.5)",
        border: "1px solid rgba(148,163,184,0.08)",
      }}
    >
      <CardContent sx={{ p: "12px !important" }}>
        <Skeleton variant="text" width="60%" sx={{ bgcolor: "#1e293b", mb: 0.5 }} />
        <Skeleton variant="text" width="90%" sx={{ bgcolor: "#1e293b" }} />
        <Skeleton variant="text" width="75%" sx={{ bgcolor: "#1e293b" }} />
      </CardContent>
    </Card>
  );
}
