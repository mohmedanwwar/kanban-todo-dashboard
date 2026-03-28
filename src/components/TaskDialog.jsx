// ─────────────────────────────────────────────────────────────────────────────
// Modal dialog for creating and editing tasks.
// Controlled by Zustand (dialogMode / editingTask / defaultColumn).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useKanbanStore from "../store/useKanbanStore";
import { useCreateTask, useUpdateTask, COLUMNS } from "../hooks/useTasks";

const EMPTY_FORM = { title: "", description: "", column: "backlog" };

export default function TaskDialog() {
  const { dialogMode, editingTask, defaultColumn, closeDialog } =
    useKanbanStore();

  const isOpen = Boolean(dialogMode);
  const isEdit = dialogMode === "edit";

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const isBusy = createMutation.isPending || updateMutation.isPending;

  // ── Sync form when dialog opens ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (isEdit && editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        column: editingTask.column,
      });
    } else {
      setForm({ ...EMPTY_FORM, column: defaultColumn });
    }
    setErrors({});
  }, [isOpen, isEdit, editingTask, defaultColumn]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.length > 80) errs.title = "Max 80 characters";
    if (form.description.length > 400)
      errs.description = "Max 400 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: editingTask.id, changes: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      closeDialog();
    } catch (err) {
      console.error("Task save failed:", err);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={!isBusy ? closeDialog : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(148,163,184,0.15)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          pb: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#f1f5f9" }}
        >
          {isEdit ? "✏️ Edit Task" : "✨ New Task"}
        </Typography>
        <IconButton
          size="small"
          onClick={closeDialog}
          disabled={isBusy}
          sx={{ color: "#94a3b8" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Body */}
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          {/* Title */}
          <TextField
            label="Task Title"
            value={form.title}
            onChange={handleChange("title")}
            error={Boolean(errors.title)}
            helperText={errors.title || `${form.title.length}/80`}
            fullWidth
            autoFocus
            variant="outlined"
            inputProps={{ maxLength: 80 }}
            sx={inputSx}
          />

          {/* Description */}
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange("description")}
            error={Boolean(errors.description)}
            helperText={errors.description || `${form.description.length}/400`}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            inputProps={{ maxLength: 400 }}
            sx={inputSx}
          />

          {/* Column selector */}
          <TextField
            select
            label="Column"
            value={form.column}
            onChange={handleChange("column")}
            fullWidth
            variant="outlined"
            sx={inputSx}
          >
            {COLUMNS.map((col) => (
              <MenuItem key={col.id} value={col.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: col.color,
                      display: "inline-block",
                    }}
                  />
                  <span>{col.label}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={closeDialog}
          disabled={isBusy}
          sx={{ color: "#94a3b8", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isBusy}
          variant="contained"
          startIcon={isBusy ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            },
          }}
        >
          {isBusy ? "Saving…" : isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Shared MUI input styling ───────────────────────────────────────────────────
const inputSx = {
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#a5b4fc" },
  "& .MuiOutlinedInput-root": {
    color: "#f1f5f9",
    "& fieldset": { borderColor: "rgba(148,163,184,0.25)" },
    "&:hover fieldset": { borderColor: "rgba(148,163,184,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
  "& .MuiFormHelperText-root": { color: "#64748b" },
  "& .MuiSelect-icon": { color: "#94a3b8" },
  "& .MuiMenuItem-root": { color: "#f1f5f9" },
};
