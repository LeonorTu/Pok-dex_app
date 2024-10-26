import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import HolyLoader from "holy-loader";

const Community = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersPerPage, setUsersPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageUsersState, setCurrentPageUsersState] = useState([]);
  const { isAuthenticated, user, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  let totalPages;

  if (userList.length <= usersPerPage) {
    totalPages = 1;
  } else {
    totalPages = Math.floor(userList.length / usersPerPage);
  }

  const [currentPage, setCurrentPage] = useState(totalPages);

  const fetchUsers = async () => {
    try
    {
      setLoading(true);
      const response = await fetch("/api/profile")
      const data = await response.json()
      setLoading(false)
      setUserList(data)
      recalculateCurrentPageUsers(data)
    }
    catch (error)
    {
      console.error("Error fetching user list");
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate, authLoading, user]);

  const filterUsers = async () => {
    try
    {
      setLoading(true);
      const response = await fetch(
        "/api/profile/search?" +
          new URLSearchParams({
            name: searchQuery,
          })
      )
      const data = await response.json()
      setLoading(false)
      setUserList(data)
      recalculateCurrentPageUsers(data)
    }
    catch
    {
      console.error("Error filtering users")
    }
  }

  useEffect(() => {
    if (searchQuery.length == 0) {
      fetchUsers();
    } else {
      filterUsers(searchQuery);
    }
  }, [searchQuery, currentPage]);

  const recalculateCurrentPageUsers = (userArray) => {
    let shownUsersStart;

    if (currentPage == 1) {
      shownUsersStart = 0;
    } else {
      shownUsersStart = (currentPage - 1) * usersPerPage;
    }

    let shownUsersEnd = currentPage * usersPerPage;

    const currentPageUsers = userArray.slice(shownUsersStart, shownUsersEnd);
    setCurrentPageUsersState(currentPageUsers)

  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const Pagination = ({ usersPerPage, length, currentPage }) => {
    const paginationNumbers = [];

    for (let i = 1; i <= Math.ceil(length / usersPerPage); i++) {
      paginationNumbers.push(i);
    }

    const handlePagination = ({ pageNumber }) => {
      setCurrentPage(pageNumber);
    };

    return (
      <div className="text-4xl items-center flex justify-center m-10">
        {paginationNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={
              currentPage === pageNumber
                ? "text-rose-700 border-pink-950 border-2 p-2 m-3 rounded-lg bg-rose-300"
                : "text-rose-400 border-pink-950 border-2 p-2 m-2 rounded-md bg-rose-100"
            }
            onClick={() => handlePagination({ pageNumber })}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    );
  };

  return (
      <section>
        <h1 className="text-rose-900 font-pokemon text-center text-7xl my-10">
          Our community
        </h1>
        <div className="flex justify-center">
          <h2 className="mx-4 font-mono text-rose-950">
            Search users by name:{" "}
          </h2>
          <form >
            <input
              name="searchField"
              value={searchQuery}
              onChange={handleSearch}
              className="bg-rose-200 content-center"
              type="text"
            />
          </form>
        </div>
        <div className="">
          { (loading) && <HolyLoader/>  }
          { (!loading && userList.length === 0) && <h2 className="text-5xl m-10 p-10 text-center font-pokemon">No matches found</h2>}
          {
            (!loading && userList.length > 0) &&
            (
              <ul className="m-20 grid grid-cols-4 gap-40">
                {currentPageUsersState.map((user) => {

                  return (
                    <li className="max-w-64 max-h-64 flex justify-center items-center p-5 text-center text-3xl" key={user.name}>
                      <a href={"/users/" + user.name}>
                        {user.name}
                        <br />
                        <br />
                        <img className="" src={`data:image/jpeg;base64,${user.profile_pic}`} />
                      </a>
                    </li>
                  );
                  })}
                </ul>
            )
          }
        </div>
        {(!loading) &&
          <Pagination
            currentPage={currentPage}
            length={userList.length}
            usersPerPage={usersPerPage}
          />
        }
      </section>
  );
};

export default Community;
