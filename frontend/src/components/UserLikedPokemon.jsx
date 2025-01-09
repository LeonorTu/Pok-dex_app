import React from 'react'

const UserLikedPokemon = ({ likedPokemon }) => {
  if (likedPokemon.length == 0) {
    return (
      <section className='justify-center items-center grid columns-3'>
        <p className='px-4 text-white text-center pb-3 pt-3 font-bold opacity-80 rounded-lg border-double text-2xl font-mono border-yellow-950 border-4 bg-slate-800'>
          No liked pokemon yet
        </p>
      </section>
    )
  }

  return (
    <section className='justify-center items-center grid columns-3'>
      <ul className='grid grid-cols-8 mx-24 px-10 text-center list-inside font-bold opacity-80 rounded-lg border-double text-3xl font-mono border-yellow-950 border-4 bg-slate-800'>
        {likedPokemon.map((pokemon) => {
          return (
            <li className='p-3 items-center italic text-white' key={pokemon}>
              <a href={`/pokemon/${pokemon}`}>{pokemon}</a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default UserLikedPokemon
