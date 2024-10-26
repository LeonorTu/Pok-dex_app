import React, { useState } from "react";

const SearchBar = React.memo(({ onSearch, lastSubmittedTerm }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Only call onSearch if the current inputValue is not empty and is different from the lastSubmittedTerm
      if (inputValue && inputValue !== lastSubmittedTerm) {
        onSearch(inputValue);
      }
    }
  };

  return (
    <div className="search-container">
      <input
        className="search-box"
        type="text"
        placeholder="Search ..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // Update the inputValue state on input change
        onKeyDown={handleKeyDown}
      />
    </div>
  );
});

export default SearchBar;