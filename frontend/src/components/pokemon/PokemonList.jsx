import React from "react";
import { useNavigate } from "react-router-dom";

// Pokémon List component (non-search)
const PokemonList = ({
  displayedList,
  offset,
  searchTerm,
  morePokemon,
  isFetching,
  selectedType,
  sortOrder,
}) => {
  const navigate = useNavigate();

  const handlePokemonClick = (pokemon) => {
    // Capture the current scroll position before navigating
    const currentScrollPosition = window.scrollY;
    console.log("captured currentScrollPosition:", currentScrollPosition);

    // Navigate to the Pokemon profile page, passing the current state
    navigate(`/pokemon/${pokemon.name}`, {
      state: {
        from: "pokedex",
        offset: offset,
        displayedList: displayedList,
        searchTerm: searchTerm,
        morePokemon: morePokemon,
        selectedType: selectedType,
        sortOrder: sortOrder,
        scrollPosition: currentScrollPosition,
      },
    });
  };

  return (
    <div>
      {isFetching ? (
        <div className="flex justify-center mt-8">
          <p className="text-center text-2xl text-gray-600">
            Loading Pokémon... 🐾
          </p>
        </div>
      ) : displayedList && displayedList.length > 0 ? (
        <ul className="pokemon-list">
          {displayedList.map((pokemon) => (
            <li key={pokemon.name} className="pokemon-item">
              <button onClick={() => handlePokemonClick(pokemon)}>
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <p className="font-semibold text-lg">{pokemon.name}</p>
                <p className="text-gray-500">ID: {pokemon.id}</p>
                <p className="text-gray-500">
                  Types: {pokemon.types.join(", ")}
                </p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center mt-8">
          <p className="text-center text-2xl text-gray-600 font-semibold">
            No Pokémon found! 🤔
          </p>
          <p className="text-center text-xl text-gray-500 mt-2">
            Try filter or sort pokemon differently! 🌟
          </p>
        </div>
      )
      }
    </div>
  );
};

export default PokemonList;