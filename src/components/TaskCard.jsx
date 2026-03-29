// src/components/TaskCard.jsx
// ─────────────────────────────────────────────────────────────
// Draggable task card rendered inside each column.
// Uses @hello-pangea/dnd Draggable wrapper.
// ─────────────────────────────────────────────────────────────

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import useKanbanStore from "../store/useKanbanStore";
import { COLUMN_MAP } from "../utils/columns";

const TaskCard = ({ task, index }) => {
  const openEditModal = useKanbanStore((s) => s.openEditModal);
  const openDeleteConfirm = useKanbanStore((s) => s.openDeleteConfirm);
  const col = COLUMN_MAP[task.column];

  // Format relative date
  const relativeDate = (ts) => {
    const diff = Date.now() - ts;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          elevation={snapshot.isDragging ? 8 : 1}
          sx={{
            mb: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: snapshot.isDragging ? col.color : "divider",
            transition: "box-shadow 0.2s, border-color 0.2s, transform 0.15s",
            transform: snapshot.isDragging ? "rotate(2deg)" : "none",
            bgcolor: snapshot.isDragging ? col.lightBg : "background.paper",
            "&:hover": {
              borderColor: col.color,
              "& .action-btns": { opacity: 1 },
            },
          }}
        >
          <CardContent sx={{ p: "12px 14px !important" }}>
            {/* Header row: drag handle + title + actions */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
              {/* Drag handle */}
              <Box
                {...provided.dragHandleProps}
                sx={{
                  color: "text.disabled",
                  cursor: "grab",
                  mt: 0.3,
                  flexShrink: 0,
                  "&:active": { cursor: "grabbing" },
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </Box>

              {/* Title */}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  flex: 1,
                  lineHeight: 1.35,
                  fontSize: "0.85rem",
                  color: "text.primary",
                }}
              >
                {task.title}
              </Typography>

              {/* Action buttons – shown on hover */}
              <Box
                className="action-btns"
                sx={{
                  opacity: 0,
                  transition: "opacity 0.2s",
                  display: "flex",
                  gap: 0.25,
                  flexShrink: 0,
                }}
              >
                <Tooltip title="Edit task" arrow>
                  <IconButton
                    size="small"
                    onClick={() => openEditModal(task)}
                    sx={{ p: 0.5, color: "text.secondary" }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete task" arrow>
                  <IconButton
                    size="small"
                    onClick={() => openDeleteConfirm(task.id)}
                    sx={{ p: 0.5, color: "error.light" }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Description */}
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  ml: 3,
                  fontSize: "0.78rem",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {task.description}
              </Typography>
            )}

            {/* Footer: date chip */}
            <Box sx={{ mt: 1.25, ml: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={relativeDate(task.createdAt)}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  bgcolor: col.lightBg,
                  color: col.color,
                  fontWeight: 600,
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
