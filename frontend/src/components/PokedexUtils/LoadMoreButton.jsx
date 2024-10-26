import React from "react";

const LoadMoreButton = ({ isLoading, onLoadMore }) => (
  <button
    onClick={onLoadMore}
    disabled={isLoading}
    className={`block mx-auto my-12 px-6 py-3 font-semibold text-white rounded-lg shadow-lg transition-all
        ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
  >
    {isLoading ? "Loading..." : "Load More Pokémon"}
  </button>
);

export default LoadMoreButton;