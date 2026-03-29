// src/components/KanbanColumn.jsx
// ─────────────────────────────────────────────────────────────
// One column of the board. Wraps a react-query paginated list
// inside a @hello-pangea/dnd Droppable zone.
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import {
  Box,
  Typography,
  IconButton,
  Skeleton,
  Pagination,
  Tooltip,
  Badge,
  Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TaskCard from "./TaskCard";
import { useTasksQuery } from "../hooks/useTasksQuery";
import useKanbanStore from "../store/useKanbanStore";

const TaskSkeleton = () => (
  <Box sx={{ mb: 1.5 }}>
    <Skeleton variant="rounded" height={90} sx={{ borderRadius: 2 }} />
  </Box>
);

const KanbanColumn = ({ column }) => {
  const [page, setPage] = useState(1);
  const searchQuery = useKanbanStore((s) => s.searchQuery);
  const openCreateModal = useKanbanStore((s) => s.openCreateModal);

  // Reset to page 1 when search changes
  React.useEffect(() => { setPage(1); }, [searchQuery]);

  const { data, isLoading, isFetching } = useTasksQuery({
    column: column.id,
    page,
    search: searchQuery,
  });

  const tasks = data?.tasks ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "85vw", sm: 280, md: 300 },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        bgcolor: "grey.50",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* ── Column header ─────────────────────────────────── */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid",
          borderColor: column.color,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">{column.icon}</Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, fontSize: "0.9rem", color: "text.primary" }}
          >
            {column.label}
          </Typography>
          <Badge
            badgeContent={total}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: column.color,
                color: "#fff",
                fontSize: "0.65rem",
                minWidth: 18,
                height: 18,
                fontWeight: 700,
              },
            }}
          >
            <Box sx={{ width: 8 }} />
          </Badge>
        </Box>

        {/* Add task button */}
        <Tooltip title={`Add to ${column.label}`} arrow>
          <IconButton
            size="small"
            onClick={() => openCreateModal(column.id)}
            sx={{
              color: column.color,
              "&:hover": { bgcolor: column.lightBg },
              transition: "background 0.2s",
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Droppable task list ───────────────────────────── */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 1.5,
              minHeight: 120,
              transition: "background 0.2s",
              bgcolor: snapshot.isDraggingOver ? column.lightBg : "transparent",
            }}
          >
            {/* Loading skeletons */}
            {isLoading && [1, 2, 3].map((k) => <TaskSkeleton key={k} />)}

            {/* Task cards */}
            {!isLoading &&
              tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}

            {/* Empty state */}
            {!isLoading && tasks.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.disabled",
                  fontSize: "0.8rem",
                }}
              >
                <Typography variant="body2" color="text.disabled">
                  {searchQuery ? "No results found" : "No tasks yet"}
                </Typography>
                {!searchQuery && (
                  <Typography
                    variant="caption"
                    color={column.color}
                    sx={{ cursor: "pointer", mt: 0.5, display: "block" }}
                    onClick={() => openCreateModal(column.id)}
                  >
                    + Add first task
                  </Typography>
                )}
              </Box>
            )}

            {/* Refetching indicator */}
            {isFetching && !isLoading && (
              <Skeleton variant="rounded" height={6} sx={{ borderRadius: 1, mb: 1 }} />
            )}

            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {/* ── Pagination ────────────────────────────────────── */}
      {totalPages > 1 && (
        <Box
          sx={{
            px: 1,
            py: 1,
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            siblingCount={0}
            sx={{
              "& .MuiPaginationItem-root": { fontSize: "0.7rem", minWidth: 24, height: 24 },
              "& .Mui-selected": { bgcolor: `${column.color} !important`, color: "#fff" },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default KanbanColumn;
