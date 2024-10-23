import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';
import './pokedex.css';
import { RefreshCw } from 'lucide-react';

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [matchingList, setMatchingList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [offsetForSearching, setOffsetForSearching] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ID-asc");
  const [morePokemon, setMorePokemon] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const limit = 20; // Number of Pokémon per page
  const abortControllerRef = useRef(null); // Ref to store the current AbortController
  const typingTimeoutRef = useRef(null);  // Ref to track the typing timeout

  console.log("rendering Pokedex...");

  // Function to fetch Pokemon list (non-search)
  const fetchPokemonList = async (offsetValue = 0, shouldShuffle = false, sortOrder = "") => {
    console.log("fetchPokemonList() called, offset:", offsetValue, "shouldShuffle:", shouldShuffle);
    try {
      const response = await fetch(`/api/pokemon?limit=${limit + 1}&offset=${offsetValue}&sort=${sortOrder}&shuffle=${shouldShuffle}`);
      const newPokemonList = await response.json();
      console.log("newPokemonList:", newPokemonList)
      if (newPokemonList.length > limit) {
        setPokemonList((prevList) => [...prevList, ...newPokemonList.slice(0, limit)]);
      } else {
        setMorePokemon(false);
        setPokemonList((prevList) => [...prevList, ...newPokemonList]);
      }
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
  };

  // Function to fetch Pokemon list (search)
  const fetchMatchingList = async (query, offsetValue = 0, sortOrder = "") => {
    console.log("fetchMatchingList() called");

    // Cancel the previous fetch request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController instance
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    console.log("offsetForSearching:", offsetValue);
    try {
      const response = await fetch(`/api/pokemon/search/${query}?limit=${limit + 1}&offset=${offsetValue}&sort=${sortOrder}`, {
        signal: abortController.signal, // Pass the signal to the fetch request
      });

      if (response.ok) {
        const newMatchingList = await response.json();
        console.log("searchTerm:", query, "| newMatchingList:", newMatchingList)
        if (newMatchingList.length > limit) {
          setMatchingList(prevList => [...prevList, ...newMatchingList.slice(0, limit)]);
        } else {
          setMorePokemon(false);
          setMatchingList(prevList => [...prevList, ...newMatchingList]);
        }
      } else {
        setMatchingList([]);
        setMorePokemon(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error searching Pokémon:", error);
      }
    }
  };

  const searchPokemon = async (userInput) => {
    console.log("searchPokemon() called, userInput:", userInput);
    setIsTyping(true); // User has started typing
    clearTimeout(typingTimeoutRef.current); // Clear the previous timeout

    setSearchTerm(userInput);
    setSortOrder("ID-asc");
    setOffset(0);
    setOffsetForSearching(0);
    setPokemonList([]);
    setMatchingList([]);
    setMorePokemon(true);

    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false); // User has stopped typing
      setIsFetching(true); // Actual search starts

      if (userInput === "") {
        await fetchPokemonList(0, false, "ID-asc");
      } else {
        await fetchMatchingList(userInput, 0, "ID-asc");
      }
      setIsFetching(false); // Search completes
  
    }, 300); // 300ms delay before performing the search
  };

  const sortPokemon = async (sortOrderValue) => {
    console.log("sortPokemon() called", "sort by:", sortOrderValue);

    setSortOrder(sortOrderValue);
    setOffset(0);
    setOffsetForSearching(0);
    setPokemonList([]);
    setMatchingList([]);
    setMorePokemon(true);
    setIsFetching(true);
    if (searchTerm === "") {
      await fetchPokemonList(0, false, sortOrderValue);
    } else {
      await fetchMatchingList(searchTerm, 0, sortOrderValue);
    }
    setIsFetching(false);
  };

  const shufflePokemon = async () => {
    console.log("shufflePokemon() called");
    setSearchTerm("");
    setSortOrder("random");
    setOffset(0);
    setPokemonList([]);
    setMorePokemon(true);
    setIsShuffling(true);
    setIsFetching(true);
    await fetchPokemonList(0, true, ""); // Request a reshuffle
    setIsFetching(false);
    setIsShuffling(false);
  };

  const loadMorePokemon = async () => {
    console.log("loadMorePokemon() called");
    setIsLoading(true);
    setIsFetching(true);
    if (searchTerm === "") {
      setOffset((prevOffset) => prevOffset + limit);
      await fetchPokemonList(offset + limit, false, sortOrder);
    } else {
      setOffsetForSearching((prevOffset) => prevOffset + limit);
      await fetchMatchingList(searchTerm, offsetForSearching + limit, sortOrder)
    }
    setIsFetching(false);
    setIsLoading(false);
  };

  const resetAll = () => {
    setPokemonList([]);
    setMatchingList([]);
    setSearchTerm("");
    setOffset(0);
    setOffsetForSearching(0);
    setMorePokemon(true);
  }

  // Effect to restore the scroll position when coming back from profile
  useEffect(() => {
    const savedScrollPosition = location.state?.scrollPosition || 0;
    window.scrollTo(0, savedScrollPosition);
  }, [location.state]);

  useEffect(() => {
    console.log("useEffect() for passed state");

    const initialOffset = location.state?.offset || 0; // Default to 0 if offset doesn't exist
    setOffset(initialOffset); // Set the offset for pagination

    // Check if navigating back from the profile page
    if (location.state?.from === 'profile') {
      console.log("Navigating back from profile page");
      if (!location.state.searchTerm) {
        setPokemonList(location.state.pokemonList); // Use the passed Pokemon list
      } else {
        setMatchingList(location.state.matchingList);
        setOffsetForSearching(location.state.offsetForSearching);
        setSearchTerm(location.state.searchTerm);
        setMorePokemon(location.state.morePokemon);
      }

      // Restore the scroll position
      const savedScrollPosition = location.state.scrollPosition || 0;
      console.log("Restoring scroll position:", savedScrollPosition);
      setTimeout(() => {
        window.scrollTo(0, savedScrollPosition);
      }, 100);
    } else {
      console.log("Fetching default Pokemon list");
      resetAll();
      const fetchData = async () => {
          setIsFetching(true);
          await fetchPokemonList(initialOffset, false, "ID-asc"); // Fetch the default Pokemon list
          setIsFetching(false);
        }
      fetchData();
    }

    // Clear location.state on page reload
    const handleBeforeUnload = () => {
      // Clear location state before unloading the page
      if (location.state?.from) {
        navigate('/', { replace: true, state: {} }); // Replace the current state with an empty object
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // cleanup function to ensure that the event listener is removed when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.state, navigate]);

  const pokemonListProps = { pokemonList, offset, searchTerm, morePokemon, isFetching }
  const searchResultsProps = { matchingList, offsetForSearching, searchTerm, morePokemon, isTyping, isFetching };

  return (
    <div>
      <header>
        <img alt="pokemon logo" className="logo" src={logo} />
      </header>
      <main>
        <Search searchTerm={searchTerm} onSearch={searchPokemon} />
        <Sort sortOrder={sortOrder} onSort={sortPokemon} />
        <Shuffle isShuffling={isShuffling} onShuffle={shufflePokemon} />
        {/* Pokémon List or Search Results */}
        {!searchTerm ? (
          <PokemonList {...pokemonListProps} />
        ) : (
          <SearchResults {...searchResultsProps} />
        )}
        {morePokemon && !isFetching && !isTyping && (<LoadMore isLoading={isLoading} onLoadMore={loadMorePokemon} />)}
      </main>
    </div>
  );
};

// Search bar
const Search = ({ searchTerm, onSearch }) => (
  <div className="search-container">
    <input
      className="search-box"
      type="text"
      placeholder="Search..."
      value={searchTerm} // Set input value to the search term
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

// Sort options
const Sort = ({ sortOrder, onSort }) => (
  <div className="sort-container flex justify-end mr-8 sm:mr-12 md:mr-16">
    <label htmlFor="sortOrder" className="text-lg font-bold mr-2 text-green-600">
      Sort by:
    </label>
    <select
      id="sortOrder"
      value={sortOrder}
      onChange={(e) => { onSort(e.target.value) }} // Update sort order on change
    >
      <option value="ID-asc">ID (Ascending)</option>
      <option value="ID-desc">ID (Descending)</option>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="likes">Likes</option>
      <option value="dislikes">Dislikes</option>
      <option value="random" disabled>Random</option>
    </select>
  </div>
);

// Shuffle button
const Shuffle = ({ isShuffling, onShuffle }) => (
  <div className="w-full flex justify-center">
    <button
      onClick={onShuffle}
      disabled={isShuffling}
      className={`inline-flex items-center justify-center space-x-2 px-6 py-3 font-semibold text-white rounded-lg shadow-lg transition-all
      ${isShuffling ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
    >
      <RefreshCw size={14} className={isShuffling ? "animate-spin" : ""} />
      <span>{isShuffling ? "Loading..." : "Surprise Me!"}</span>
    </button>
  </div>
);

// Pokémon List component (non-search)
const PokemonList = ({ pokemonList, offset, searchTerm, morePokemon, isFetching }) => {
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
        pokemonList: pokemonList,
        searchTerm: searchTerm,
        morePokemon: morePokemon,
        scrollPosition: currentScrollPosition
      }
    });
  };

  return (
    <div>
      {isFetching ? (
        <div className="flex justify-center mt-8">
          <p className="text-center text-2xl text-gray-600">Loading Pokémon... 🐾</p>
        </div>
      ) : (
        <ul className="pokemon-list">
          {pokemonList.map(pokemon => (
            <li key={pokemon.name} className="pokemon-item">
              <button
                onClick={() => handlePokemonClick(pokemon)}
              >
                <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
                <p className="font-semibold text-lg">{pokemon.name}</p>
                <p className="text-gray-500">ID: {pokemon.id}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
};

// Search Results component
const SearchResults = ({ matchingList, offsetForSearching, searchTerm, morePokemon, isTyping, isFetching }) => {
  const navigate = useNavigate();

  const handlePokemonClick = (pokemon) => {
    // Capture the current scroll position before navigating
    const currentScrollPosition = window.scrollY;
    console.log("captured currentScrollPosition:", currentScrollPosition);

    // Navigate to the Pokemon profile page, passing the current state
    navigate(`/pokemon/${pokemon.name}`, {
      state: {
        from: 'pokedex',
        offsetForSearching: offsetForSearching,
        matchingList: matchingList,
        searchTerm: searchTerm,
        morePokemon: morePokemon,
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
        matchingList && matchingList.length > 0 ? (
          <ul className="pokemon-list">
            {matchingList.map(pokemon => (
              <li key={pokemon.name} className="pokemon-item">
                <button
                  onClick={() => handlePokemonClick(pokemon)}
                >
                  <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
                  <p>{pokemon.name}</p>
                  <p>ID: {pokemon.id}</p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !isTyping && (
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
      )};
    </div>
  )
};

// Load more button
const LoadMore = ({ isLoading, onLoadMore }) => (
  <button
    onClick={onLoadMore}
    disabled={isLoading}
    className={`block mx-auto my-12 px-6 py-3 font-semibold text-white rounded-lg shadow-lg transition-all
        ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
  >
    {isLoading ? "Loading..." : "Load More Pokémon"}
  </button>
);

export default Pokedex;