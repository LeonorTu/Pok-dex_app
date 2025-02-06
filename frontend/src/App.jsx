import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import './styles/index.css'
import ErrorBoundary from './ErrorBoundary'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Pokedex from './pages/Pokedex'
import Login from './pages/Login'
import Profile from './pages/UserProfile'
import PokemonProfile from './pages/PokemonProfile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Community from './pages/CommunityPage'
import PageNotFound from './pages/PageNotFound'
import ViewOnlyProfile from './pages/ViewOnlyProfile'
import { AuthProvider } from './AuthContext' // Import AuthProvider

const App = () => {
  const [pokedexKey, setPokedexKey] = useState(0) // State to manage the Pokedex key

  const handlePokedexClick = () => {
    setPokedexKey((prevKey) => prevKey + 1) // Increment key to force re-render
  }

  return (
    <Router>
      <AuthProvider>
        <div id='root'>
          <Navbar handlePokedexClick={handlePokedexClick} />
          <main>
            <Routes>
              <Route
                exact
                path='/'
                element={
                  <ErrorBoundary>
                    <Pokedex key={pokedexKey} />
                  </ErrorBoundary>
                }
              />
              <Route path='/Login' element={<Login />} />
              <Route path='/Profile' element={<Profile />} />
              <Route path='/pokemon/:name' element={<PokemonProfile />} />
              <Route path='/privacy-policy' element={<PrivacyPolicy />} />
              <Route path='/terms' element={<TermsOfService />} />
              <Route path='/Community' element={<Community />} />
              <Route path='*' element={<PageNotFound />} />
              <Route path='/users/:name' element={<ViewOnlyProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
