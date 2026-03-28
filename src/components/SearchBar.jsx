// ─────────────────────────────────────────────────────────────────────────────
// Debounced search bar connected to Zustand. Filters tasks across all columns.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import { InputAdornment, TextField, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useKanbanStore from "../store/useKanbanStore";

// Debounce helper
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar() {
  const { setSearchQuery } = useKanbanStore();
  const [localValue, setLocalValue] = useState("");
  const debounced = useDebounce(localValue, 350);

  // Push debounced value to global store → triggers React Query refetch
  useEffect(() => {
    setSearchQuery(debounced);
  }, [debounced, setSearchQuery]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    setSearchQuery("");
  }, [setSearchQuery]);

  return (
    <TextField
      placeholder="Search tasks by title or description…"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      size="small"
      variant="outlined"
      sx={{
        width: { xs: "100%", sm: 360 },
        "& .MuiOutlinedInput-root": {
          color: "#f1f5f9",
          borderRadius: 3,
          background: "rgba(30,41,59,0.8)",
          backdropFilter: "blur(8px)",
          fontSize: "0.85rem",
          "& fieldset": { borderColor: "rgba(148,163,184,0.2)" },
          "&:hover fieldset": { borderColor: "rgba(148,163,184,0.4)" },
          "&.Mui-focused fieldset": { borderColor: "#6366f1" },
        },
        "& .MuiInputAdornment-root": { color: "#64748b" },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 18, color: "#64748b" }} />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <Tooltip title="Clear search">
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ color: "#64748b", "&:hover": { color: "#f1f5f9" } }}
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
