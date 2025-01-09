import React from 'react'
import UserLikedPokemon from '../components/UserLikedPokemon'
import { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../AuthContext'
import UserDislikedPokemon from '../components/UserDislikedPokemon'
import defaultProfilePic from '../img/no_profile_pic.jpg'

const Profile = () => {
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState('')
  const [ownData, setOwnData] = useState({
    id: 1,
    name: 'Loading...',
    bio: 'loading...',
    profile_pic: null,
  })
  const [likedPokemons, setLikedPokemons] = useState({
    user_id: -1,
    liked_pokemons: [],
  })
  const [dislikedPokemons, setDislikedPokemons] = useState({
    user_id: -1,
    disliked_pokemons: [],
  })
  const { isAuthenticated, user, authLoading, setUser } =
    useContext(AuthContext)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [profilePic, setProfilePic] = useState(null)

  const fetchProfile = () => {
    fetch('/api/profile/me')
      .then((response) => response.json())
      .then((data) => {
        setOwnData(data)
        console.log('Setting user data: ', data)
        setUser(data)
        setProfilePic(data.profile_pic)
      })
      .catch((error) => console.error('Error fetching user list'))
  }

  const fetchLikedPokemon = () => {
    if (ownData.user_id != undefined) {
      fetch(`/api/user/${ownData.user_id}/liked_pokemons`)
        .then((response) => response.json())
        .then((data) => setLikedPokemons(data))
        .catch((error) => console.error("Error fetching liked pokemons' list"))
    }
  }

  const fetchDislikedPokemon = () => {
    if (ownData.user_id != undefined) {
      fetch(`/api/user/${ownData.user_id}/disliked_pokemons`)
        .then((response) => response.json())
        .then((data) => setDislikedPokemons(data))
        .catch((error) =>
          console.error("Error fetching disliked pokemons' list")
        )
    }
  }

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login') // Redirect to login if not authenticated
    } else if (isAuthenticated && !authLoading && !editingBio) {
      console.log('Fetching profile')
      fetchProfile()
      fetchLikedPokemon()
      fetchDislikedPokemon()
    }
  }, [isAuthenticated, navigate, authLoading, profilePic])

  const RenderProfilePic = () => {
    console.log('rendering profile pic')
    if (ownData.profile_pic === null) {
      return (
        <img
          src={defaultProfilePic}
          alt='User Profile'
          className='rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-yellow-900 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]'
        />
      )
    } else {
      return (
        <img
          src={`data:image/jpeg;base64,${ownData.profile_pic}`}
          alt='User Profile'
          className='rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-yellow-900 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]'
        />
      )
    }
  }

  const handleBioEditing = (event) => {
    setEditingBio(true)
  }

  const updateBio = (event) => {
    setBio(event.target.value)
  }

  const handleBioSaving = async (event) => {
    try {
      if (editingBio == false) {
        return
      }
      const newBio = { bio: bio }
      const response = await fetch('api/profile/me/update/bio', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBio),
      })
      const data = await response.json()
      setOwnData((oldData) => {
        const newData = { ...oldData, bio: data.bio }
        return newData
      })
      setEditingBio(false)
    } catch (error) {
      console.error('Error updating bio')
    }
  }

  const handleFileChange = async (event) => {
    event.preventDefault() // Prevent the default form submission

    const file = event.target.files[0] // Get the selected file

    if (file) {
      const formData = new FormData()
      formData.append('profile_pic', file) // Append the file to FormData
      console.log('form data: ', formData)

      try {
        const response = await fetch('/api/profile/me/update/profile_pic', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setProfilePic(null)
      } catch (error) {
        console.error('Error uploading profile picture:', error)
        alert('Error uploading profile picture')
      }
    }
  }

  const handleButtonClick = (event) => {
    fileInputRef.current.click()
  }

  return (
    <section className='w-full overflow-hidden dark:bg-gray-900'>
      <div className='flex flex-col'>
        <div className='sm:w-[80%] xs:w-[90%] mx-auto flex'>
          <RenderProfilePic />
          <h1 className='w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-mono'>
            {ownData.name}
          </h1>
        </div>
        <div className='xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4'>
          <div className='w-fit text-gray-700 dark:text-gray-400 text-md'>
            {!editingBio ? (
              <p className='m-3 text-lg'>{ownData.bio}</p>
            ) : (
              <section className='text-lg'>
                <textarea
                  spellCheck='true'
                  name='new_bio'
                  onChange={updateBio}
                  className='bg-gray-300 resize'
                  cols={60}
                  defaultValue={ownData.bio}
                  maxLength={250}
                  rows={2}
                  type='text'
                />
              </section>
            )}
          </div>
          <div className='w-full my-auto py-6 flex flex-col justify-center gap-2'>
            <div className='w-full flex sm:flex-row xs:flex-col gap-2 justify-center'>
              <input
                type='file'
                name='profile_pic'
                accept='.jpg, .png, .gif'
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the input
                onChange={handleFileChange} // Handle file selection
              />
              <button
                type='button' // Set type to button to prevent default form submission
                onClick={handleButtonClick} // Open file dialog
                className='bg-yellow-900 hover:bg-yellow-950 text-white font-bold my-3 py-2 px-4 mb-6 rounded'
              >
                Change profile picture
              </button>

              <button
                type='button'
                onClick={handleBioSaving}
                className='bg-yellow-900 hover:bg-yellow-950 text-white font-bold my-3 py-2 px-4 mb-6 rounded'
              >
                Save bio changes
              </button>
              <button
                type='button'
                onClick={handleBioEditing}
                className='bg-yellow-900 hover:bg-yellow-950 text-white font-bold my-3 py-2 px-4 mb-6 rounded'
              >
                Edit bio
              </button>
            </div>
          </div>
        </div>
      </div>
      <h1 className='mb-10 font-bold w-full max-w-md m-auto rounded-lg opacity-90 border-8  bg-slate-800 text-center text-5xl py-6 text-white border-yellow-950'>
        Pokemon that I like:
      </h1>
      <UserLikedPokemon likedPokemon={likedPokemons.liked_pokemons} />
      <h1 className='mb-10 font-bold w-full max-w-md m-auto rounded-lg opacity-90 border-8  bg-slate-800 text-center text-5xl py-6 my-6 text-white border-yellow-950'>
        Pokemon that I dislike:
      </h1>
      <UserDislikedPokemon
        dislikedPokemon={dislikedPokemons.disliked_pokemons}
      />
    </section>
  )
}

export default Profile
