import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const handleSearchChange = (event) => {
    // Dispatch custom event for Astro script to listen to
    const searchEvent = new CustomEvent('recipeSearch', {
      detail: { value: event.target.value }
    });
    window.dispatchEvent(searchEvent);
  };

  return (
    <TextField
      label="Search"
      type="search"
      onChange={handleSearchChange}
      variant="outlined"
      className="search"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <FaSearch />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchBar;
