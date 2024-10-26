import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import HolyLoader from "holy-loader";

// Create Context
const AuthContext = createContext();

// AuthProvider component to wrap your app and provide the auth state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // To hold user details
  const [authLoading, setLoading] = useState(true); // New loading state
 const navigate = useNavigate(); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        //console.log("Checking login status...");
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        //console.log("response:", response);
        const data = await response.json();
        if (data.loggedIn) {
          setIsAuthenticated(true);
          //console.log("data.user:", data.user);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false); // Authentication status checked
      }
    };

    checkLoginStatus();
  }, []);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/user/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout, user, setUser, authLoading }}
    >
      {authLoading && <HolyLoader />} {/* Render the loader when loading */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
