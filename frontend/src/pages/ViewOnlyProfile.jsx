import React from "react";
import background from "../assets/profile_bg.png";
import UserLikedPokemon from "../components/UserLikedPokemon";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../AuthContext";
import UserDislikedPokemon from "../components/UserDislikedPokemon";
import defaultProfilePic from "../assets/no_profile_pic.jpg";

const ViewOnlyProfile = () => {
  const { name } = useParams();
  const [userData, setUserData] = useState({
    user_id: -1,
    name: "Loading...",
    bio: "loading...",
    profile_pic: null,
  });
  const [likedPokemons, setLikedPokemons] = useState({
    user_id: -1,
    liked_pokemons: [],
  });
  const [dislikedPokemons, setDislikedPokemons] = useState({
    user_id: -1,
    disliked_pokemons: [],
  });
  const { isAuthenticated, user, authLoading } = useContext(AuthContext);

  const navigate = useNavigate();

  const fetchProfile = () => {
    fetch(`/api/profile/users/${name}`)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user list"));
  };

  const fetchLikedPokemon = () => {
    if (userData.user_id != -1) {
      fetch(`/api/user/${userData.user_id}/liked_pokemons`)
        .then((response) => response.json())
        .then((data) => setLikedPokemons(data))
        .catch((error) => console.error("Error fetching liked pokemons' list"));
    }
  };

  const fetchDislikedPokemon = () => {
    if (userData.user_id != -1) {
      fetch(`/api/user/${userData.user_id}/disliked_pokemons`)
        .then((response) => response.json())
        .then((data) => setDislikedPokemons(data))
        .catch((error) =>
          console.error("Error fetching disliked pokemons' list")
        );
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      fetchProfile();
      fetchLikedPokemon();
      fetchDislikedPokemon();
      console.log("User data:", userData);
      console.log("LIKED POKEMON IN FRONTEND", likedPokemons.liked_pokemons);
    }
  }, [isAuthenticated, navigate, authLoading, userData.user_id]);

  const BioElement = () => {
    return <p className="m-3 text-lg">{userData.bio}</p>;
  };

  const RenderProfilePic = () => {
    console.log("rendering profile pic");
      return (
        <img
        src={`data:image/jpeg;base64,${userData.profile_pic}`}
        alt="User Profile"
          className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-rose-900 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
        />
      );
  };

  return (
      <section className="w-full overflow-hidden dark:bg-gray-900">
        <div className="flex flex-col">
          <img
            src={background}
            alt="pokemon in the background"
            className="w-full xl:h-[36rem] lg:h-[32rem] md:h-[28rem] sm:h-[24rem] xs:h-[20rem]"
          />
          <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
            <RenderProfilePic />
            <h1 className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-mono">
              {userData.name}
            </h1>
          </div>
          <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
            <div className="w-fit text-gray-700 dark:text-gray-400 text-md">
              <BioElement />
            </div>
          </div>
        </div>
        <h1 className="mb-10 font-bold w-full max-w-md m-auto rounded-lg opacity-90 border-8  bg-slate-800 text-center text-5xl py-6 text-white border-pink-950">
          Pokemon that I like:
        </h1>
        <UserLikedPokemon likedPokemon={likedPokemons.liked_pokemons} />
        <h1 className="mb-10 font-bold w-full max-w-md m-auto rounded-lg opacity-90 border-8  bg-slate-800 text-center text-5xl py-6 my-6 text-white border-pink-950">
          Pokemon that I dislike:
        </h1>
        <UserDislikedPokemon
          dislikedPokemon={dislikedPokemons.disliked_pokemons}
        />
      </section>
  );
};

export default ViewOnlyProfile;
