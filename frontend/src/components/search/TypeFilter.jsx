import React from "react";

const TypeFilter = ({ types, selectedType, onTypeChange }) => {
  return (
    <div>
      <label className="text-lg font-semibold mr-2 text-gray-700">Filter by:</label>
      {/* Dropdown for type selection */}
      <select 
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ width: "auto" }}
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="">All Types</option>
        {types
          .filter((type) => type.name !== "unknown") // Exclude 'unknown' type
          .map((type) => (
            <option key={type.name} value={type.name}>
              {type.name}
            </option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;