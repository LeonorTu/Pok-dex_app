import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/footer";
import Pokedex from "./pages/pokedex";
import Login from "./pages/login";
import Profile from "./pages/profile";
import PokemonProfile from "./pages/pokemon_profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Community from "./components/Community";
import PageNotFound from "./pages/pageNotFound";
import ViewOnlyProfile from "./pages/ViewOnlyProfile";
import { AuthProvider } from "./AuthContext"; // Import AuthProvider

const App = () => {
  const [pokedexKey, setPokedexKey] = useState(0); // State to manage the Pokedex key

  const handlePokedexClick = () => {
    setPokedexKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  return (
    <Router>
      <AuthProvider>
        <div id="root">
          <Navbar handlePokedexClick={handlePokedexClick} />
          <main>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <ErrorBoundary>
                    <Pokedex key={pokedexKey} />
                  </ErrorBoundary>
                }
              />
              <Route path="/Login" element={<Login />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/pokemon/:name" element={<PokemonProfile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/Community" element={<Community />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="/users/:name" element={<ViewOnlyProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
