import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
  useEffect,
} from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";

interface CustomizedInputBaseProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const CustomizedInputBase: React.FC<CustomizedInputBaseProps> = ({
  onSearch,
  placeholder = "Поиск",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [temporaryBorderColor, setTemporaryBorderColor] = useState<
    string | null
  >(null);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!searchTerm.trim()) {
        setTemporaryBorderColor("#ff3030");
        setTimeout(() => {
          setTemporaryBorderColor(null);
        }, 500);
      } else {
        handleSearch();
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      setTemporaryBorderColor("#ff3030");
      setTimeout(() => {
        setTemporaryBorderColor(null);
      }, 500);
    } else {
      handleSearch();
    }
  };

  useEffect(() => {
    setTemporaryBorderColor(null);
  }, [searchTerm]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
        border: 1,
        borderRadius: 2,
        borderColor: temporaryBorderColor ? temporaryBorderColor : "#535bf2",
      }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default CustomizedInputBase;
