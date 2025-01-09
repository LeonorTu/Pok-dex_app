import React from 'react'
import { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom' // for redirecting to profile page
import AuthContext from '../AuthContext' // for checking if user is authenticated

const RegistrationForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pwordVisibility, setPwordVisibility] = useState(false)

  const { setIsAuthenticated, setUser } = useContext(AuthContext) // Get auth state from context
  const navigate = useNavigate() // direct to profile page after login

  const handleUsername = (event) => {
    setUsername(event.target.value)
  }
  const attemptRegistration = (event) => {
    event.preventDefault()
    const newUser = {
      username: username,
      password: password,
    }
    fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message)
          })
        }
        return response.json()
      })
      .then((data) => {
        if (data) {
          setIsAuthenticated(true)
          navigate('/profile')
          setUser(data.user)
        }
      })
      .catch((error) => alert(error.message))
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  return (
    <section className='border-t-4 border-yellow-700'>
      <header className='pt-4 w-full text-center font-bold text-pink-950 text-2xl'>
        Don't have an account yet?
        <br />
        Register here
      </header>
      <form onSubmit={attemptRegistration}>
        <div>
          <label className='block mb-2 text-black' htmlFor='register-username'>
            Username:
          </label>
          <input
            autoComplete='off'
            id='register-username'
            className='w-full p-2 mb-6 text-pink-700 border-b-2 border-yellow-700 outline-none focus:bg-gray-300'
            value={username}
            onChange={handleUsername}
          />
        </div>
        <div>
          <label className='block mb-2 text-black' htmlFor='register-password'>
            Password:
          </label>
          <input
            autoComplete='off'
            id='register-password'
            className='w-full p-2 mb-6 text-pink-700 border-b-2 border-yellow-700 outline-none focus:bg-gray-300'
            type={pwordVisibility ? 'text' : 'password'}
            value={password}
            onChange={handlePassword}
          />
        </div>
        <div>
          <label htmlFor='show-password-register'>Show password? </label>
          <input
            id='show-password-register'
            type='checkbox'
            value={pwordVisibility}
            onChange={() => setPwordVisibility((previous) => !previous)}
          />
        </div>
        <button
          className='w-full text-2xl bg-yellow-700 hover:bg-yellow-950 text-white font-bold my-3 py-2 px-4 mb-6 rounded'
          type='submit'
        >
          Register
        </button>
      </form>
    </section>
  )
}

export default RegistrationForm
