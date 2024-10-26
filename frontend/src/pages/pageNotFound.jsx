import React from 'react';

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
    <img
      src="/img/pikachu_detective.png"
      alt="Pikachu Detective"
      className="w-80 h-80 mb-6"
    />
      <h1 className="text-5xl text-gray-600 leading-tight text-center mb-6">
        Page not found!
      </h1>
      <p className="text-2xl text-gray-600 leading-8 text-center">
        Sorry! The page you're looking for is not found. <br />
      </p>
    </div>
  );
};

export default PageNotFound;
