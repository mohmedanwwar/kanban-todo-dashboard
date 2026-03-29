// src/components/SearchBar.jsx
// Global search bar – debounced so we don't hammer the mock API
// on every keystroke.

import React, { useState, useCallback } from "react";
import { InputAdornment, TextField, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useKanbanStore from "../store/useKanbanStore";

// Simple debounce helper
function useDebounce(fn, delay) {
  const timer = React.useRef(null);
  return useCallback(
    (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}

const SearchBar = () => {
  const setSearchQuery = useKanbanStore((s) => s.setSearchQuery);
  const [localValue, setLocalValue] = useState("");

  const debouncedSet = useDebounce(setSearchQuery, 300);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    debouncedSet(e.target.value);
  };

  const handleClear = () => {
    setLocalValue("");
    setSearchQuery("");
  };

  return (
    <TextField
      size="small"
      placeholder="Search tasks…"
      value={localValue}
      onChange={handleChange}
      sx={{
        width: { xs: "100%", sm: 280 },
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          bgcolor: "background.paper",
          fontSize: "0.85rem",
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <Tooltip title="Clear search">
              <IconButton size="small" onClick={handleClear} edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default SearchBar;
