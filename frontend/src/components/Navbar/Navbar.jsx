import { NavLink } from "react-router-dom";
import React, { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../../AuthContext"; // Update with your actual path

const Navbar = ({ handlePokedexClick }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <nav className="h-12 bg-[#1C79C0] shadow-lg">
      {" "}
      {/* Pokémon blue background color */}
      <div className="h-full font-sans text-white text-2xl flex justify-between items-center px-4 md:px-10">
        <NavLink
          to="/"
          onClick={handlePokedexClick}
          className={({ isActive }) =>
            isActive
              ? "text-white font-bold"
              : "hover:text-yellow-400 transition duration-300"
          }
        >
          Pokédex
        </NavLink>
        <NavLink
          to="/Community"
          className={({ isActive }) =>
            isActive
              ? "text-white font-bold"
              : "hover:text-yellow-400 transition duration-300"
          }
        >
          Community
        </NavLink>

        {!isAuthenticated && (
          <NavLink to="/Login" className="hover:text-white">
            Login | Signup
          </NavLink>
        )}

        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
              <p className="text-2lg text-center mr-2">{user.name}</p>
              <img
                src={`data:image/jpeg;base64,${user.profile_pic}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white" // Circle profile image
              />
            </button>
            {dropdownOpen && (
              // <div className="absolute flex flex-col right-0 bg-[#1C79C0] shadow-lg rounded-lg mt-2 p-4">
              <div className="absolute w-[150px] grid right-0 bg-[#1C79C0] shadow-lg rounded-lg mt-2 p-4">
                <NavLink
                  to="/Profile"
                  className="block text-white text-lg font-semibold hover:text-yellow-400 transition duration-300"
                >
                  My Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="text-lg text-left text-slate-900 font-bold hover:text-slate-400 focus:outline-none rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
