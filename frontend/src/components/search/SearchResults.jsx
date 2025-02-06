import React from "react";
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ displayedList, offset, searchTerm, morePokemon, isTyping, isFetching, selectedType, sortOrder }) => {
  const navigate = useNavigate();

  const handlePokemonClick = (pokemon) => {
    // Capture the current scroll position before navigating
    const currentScrollPosition = window.scrollY;
    console.log("captured currentScrollPosition:", currentScrollPosition);

    // Navigate to the Pokemon profile page, passing the current state
    navigate(`/pokemon/${pokemon.name}`, {
      state: {
        from: 'pokedex',
        offset: offset,
        displayedList: displayedList,
        searchTerm: searchTerm,
        morePokemon: morePokemon,
        selectedType: selectedType,
        sortOrder: sortOrder,
        scrollPosition: currentScrollPosition
      }
    });
  };

  return (
    <div>
      {isFetching ? (
        <div className="flex justify-center mt-8">
          <p className="text-center text-2xl text-gray-600">Searching for Pokémon... 🔍</p>
        </div>
      ) : (
        // Display search results or "No Pokémon" message only after search completes
        displayedList && displayedList.length > 0 ? (
          <ul className="pokemon-list">
            {displayedList.map(pokemon => (
              <li key={pokemon.name} className="pokemon-item">
                <button
                  onClick={() => handlePokemonClick(pokemon)}
                >
                  <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
                  <p>{pokemon.name}</p>
                  <p>ID: {pokemon.id}</p>
                  <p className="text-gray-500">Types: {pokemon.types.join(', ')}</p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center mt-8">
            <p className="text-center text-2xl text-gray-600 font-semibold">
              No Pokémon matched your search! 🤔
            </p>
            <p className="text-center text-xl text-gray-500 mt-2">
              Try a different name or spelling! 🌟
            </p>
          </div>
        )
      )
      };
    </div>
  )
};

export default SearchResults;