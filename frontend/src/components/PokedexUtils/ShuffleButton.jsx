import React from "react";
import { RefreshCw } from 'lucide-react';

const ShuffleButton = ({ isShuffling, onShuffle }) => (
  <div>
    <button
      onClick={onShuffle}
      disabled={isShuffling}
      className={`inline-flex items-center justify-center space-x-2 px-6 py-3 font-semibold text-white rounded-lg shadow-lg transition-all duration-200
      ${isShuffling ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
    >
      <RefreshCw size={16} className={isShuffling ? "animate-spin" : ""} />
      <span>{isShuffling ? "Loading..." : "Surprise Me!"}</span>
    </button>
  </div>
);

export default ShuffleButton;