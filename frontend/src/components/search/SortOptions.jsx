import React from "react";

const SortOptions = ({ sortOrder, onSort }) => (
  <div>
    <label className="text-lg font-semibold mr-2 text-gray-700">Sort by:</label>
    <select
      id="sortOrder"
      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={sortOrder}
      onChange={(e) => { onSort(e.target.value) }} // Update sort order on change
    >
      <option value="ID-asc">ID (Ascending)</option>
      <option value="ID-desc">ID (Descending)</option>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="likes">Most likes</option>
      <option value="dislikes">Most dislikes</option>
    </select>
  </div>
);

export default SortOptions;