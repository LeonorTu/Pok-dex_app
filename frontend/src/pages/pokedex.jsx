import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import './pokedex.css';
import SearchBar from '../components/PokedexUtils/SearchBar'
import TypeFilter from '../components/PokedexUtils/TypeFilter'
import SortOptions from '../components/PokedexUtils/SortOptions'
import ShuffleButton from '../components/PokedexUtils/ShuffleButton'
import PokemonList from '../components/PokedexUtils/PokemonList'
import SearchResults from '../components/PokedexUtils/SearchResults'
import LoadMoreButton from '../components/PokedexUtils/LoadMoreButton'

/* Pokedex handles data-fetching and manages state,
while its child components (under PokedexUtils) renders the UI */

const Pokedex = () => {
  const [displayedList, setDisplayedList] = useState([]);
  const [offset, setOffset] = useState(0); // For pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ID-asc");
  const [morePokemon, setMorePokemon] = useState(true); // Whether there is more pokemon to load
  const [isShuffling, setIsShuffling] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Is fetching data or not
  const [isLoading, setIsLoading] = useState(false); // For loading state of load more button
  const [pokemonTypes, setPokemonTypes] = useState([]); // List of Pokémon types
  const [selectedType, setSelectedType] = useState(""); // Currently selected type

  const navigate = useNavigate();
  const location = useLocation();

  const limit = 20; // Number of Pokémon per page
  const abortControllerRef = useRef(null); // Ref to store the current AbortController

  // console.log("rendering Pokedex...");

    const fetchPokemonList = async (type, query, offsetValue = 0, sortOrderValue = "", shouldShuffle = false) => {
    // Cancel the previous fetch request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController instance
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setIsLoading(true);
      let response;
      if (type) {
        console.log("fetching by type...")
        response = await fetch(`/api/pokemon/type/${type}?limit=${limit + 1}&offset=${offsetValue}&sort=${sortOrderValue}&searchTerm=${query}`, {
          signal: abortController.signal, // Pass the signal to the fetch request
        })
      } else if (query) {
        console.log("fetching by query...")
        response = await fetch(`/api/pokemon/search/${query}?limit=${limit + 1}&offset=${offsetValue}&sort=${sortOrderValue}&type=${type}`, {
          signal: abortController.signal,
        });
      } else {
        console.log("fetching...")
        response = await fetch(`/api/pokemon?limit=${limit + 1}&offset=${offsetValue}&sort=${sortOrderValue}&shuffle=${shouldShuffle}`);
      }
      setIsLoading(false);
      if (response.ok) {
        const fetchedPokemon = await response.json();
        // console.log("fetched pokemon:", fetchedPokemon);
        if (fetchedPokemon.length > limit) {
          setDisplayedList((prevList) => [...prevList, ...fetchedPokemon.slice(0, limit)]);
        } else {
          setMorePokemon(false);
          setDisplayedList((prevList) => [...prevList, ...fetchedPokemon]);
        }
      } else {
        setDisplayedList([]);
        setMorePokemon(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching Pokémon:", error);
      }
    }
  }

  const fetchPokemonTypes = async () => {
    try {
      const response = await fetch("/api/pokemon/type/");
      const types = await response.json();
      setPokemonTypes(types);
    } catch (error) {
      console.error("Error fetching Pokémon types:", error);
    }
  };

  const searchPokemon = async (userInput) => {
    console.log("searchPokemon() called, userInput:", userInput);
    setSearchTerm(userInput);
    setOffset(0);
    setDisplayedList([]);
    setMorePokemon(true);
    setIsFetching(true);
    await fetchPokemonList(selectedType, userInput, 0, sortOrder, false)
    setIsFetching(false);
  };

  const handleTypeChange = async (selectedType) => {
    console.log("handleTypeChange() called, selectedType:", selectedType)
    setSelectedType(selectedType);
    setOffset(0);
    setDisplayedList([]);
    setMorePokemon(true);
    setIsFetching(true);
    await fetchPokemonList(selectedType, searchTerm, 0, sortOrder, false);
    setIsFetching(false);
  };

  const sortPokemon = async (sortOrderValue) => {
    console.log("sortPokemon() called", "sort by:", sortOrderValue);

    setSortOrder(sortOrderValue);
    setOffset(0);
    setDisplayedList([]);
    setMorePokemon(true);
    setIsFetching(true);
    await fetchPokemonList(selectedType, searchTerm, 0, sortOrderValue, false);
    setIsFetching(false);
  };

  const resetAll = () => {
    setDisplayedList([]);
    setOffset(0);
    setSelectedType("");
    setSearchTerm("");
    setMorePokemon(true);
  }

  const shufflePokemon = async () => {
    console.log("shufflePokemon() called");
    setSortOrder("ID-asc");
    resetAll();
    setIsShuffling(true);
    setIsFetching(true);
    await fetchPokemonList("", "", 0, "", true);
    setIsFetching(false);
    setIsShuffling(false);
  };

  const loadMorePokemon = async () => {
    console.log("loadMorePokemon() called");
    setIsFetching(true);
    setOffset((prevOffset) => prevOffset + limit);
    fetchPokemonList(selectedType, searchTerm, offset + limit, sortOrder, false);
    setIsFetching(false);
  };

  // Fetch all Pokémon types on component mount
  useEffect(() => {
    fetchPokemonTypes();
  }, []);

  useEffect(() => {
    // console.log("useEffect() for passed state");

    const initialOffset = location.state?.offset || 0; // Default to 0 if offset doesn't exist
    setOffset(initialOffset); // Set the offset for pagination
    const restoredList = location.state?.displayedList;

    // Check if navigating back from the profile page
    if (location.state?.from === 'profile' && restoredList.length) {
      console.log("Navigating back from profile page");
      setSelectedType(location.state.selectedType);
      setSortOrder(location.state.sortOrder);
      if (!location.state.searchTerm) {
        setDisplayedList(restoredList); // Use the passed Pokemon list
      } else {
        setDisplayedList(restoredList);
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
        await fetchPokemonList("", "", initialOffset, "ID-asc", false);
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

  const pokemonListProps = { displayedList, offset, searchTerm, morePokemon, isFetching, selectedType, sortOrder }
  const searchResultsProps = { displayedList, offset, searchTerm, morePokemon, isFetching, selectedType, sortOrder };

  return (
    <div>
      <header>
        <img alt="pokemon logo" className="logo" src={logo} />
      </header>
        <SearchBar onSearch={searchPokemon} lastSubmittedTerm={searchTerm} />
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 px-20 mb-6">
          <ShuffleButton isShuffling={isShuffling} onShuffle={shufflePokemon}/>
          <div className="flex items-center gap-2">
            <TypeFilter
              types={pokemonTypes}
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              className="min-w-[150px]"
            />
            <SortOptions sortOrder={sortOrder} onSort={sortPokemon} className="min-w-[100px]" />
          </div>
        </div>
        {/* Pokémon List or Search Results */}
        {!searchTerm ? (
          <PokemonList {...pokemonListProps} />
        ) : (
          <SearchResults {...searchResultsProps} />
        )}
        {morePokemon && !isFetching && (<LoadMoreButton isLoading={isLoading} onLoadMore={loadMorePokemon} />)}
    </div>
  );
};

export default Pokedex;