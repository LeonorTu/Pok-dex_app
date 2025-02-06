import React from "react";
import { Link } from 'react-router-dom'; // Use Link instead of <a> for routing

const Footer = () => {

	return (
    <footer>
      <p>&copy; 2024 Pokédex App. All rights reserved.</p>
      <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link>
    </footer>
  )
}

export default Footer;