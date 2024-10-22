import React from "react";
import {NavLink} from "react-router-dom"

const Navbar = () => {
	return (
		<nav className="h-12 bg-[#1C79C0] shadow-lg"> {/* Pokémon blue background color */}
		<div className="font-sans text-white text-2xl py-2 flex justify-between items-center px-4 md:px-10">
			<NavLink
			  to="/"
			  className={({ isActive }) =>
				isActive ? 'text-white font-bold' : 'hover:text-yellow-400 transition duration-300'
			  }
			>
			  Pokedex
			</NavLink>
			<NavLink
			  to="/Profile"
			  className={({ isActive }) =>
				isActive ? 'text-white font-bold' : 'hover:text-yellow-400 transition duration-300'
			  }
			>
			  My Profile
			</NavLink>
			<NavLink
			  to="/Login"
			  className={({ isActive }) =>
				isActive ? 'text-white font-bold' : 'hover:text-yellow-400 transition duration-300'
			  }
			>
			  Login | Signup
			</NavLink>
			<NavLink
			  to="/Community"
			  className={({ isActive }) =>
				isActive ? 'text-white font-bold' : 'hover:text-yellow-400 transition duration-300'
			  }
			>
			  Community
			</NavLink>
		  </div>
		</nav>
	  );
	};

export default Navbar