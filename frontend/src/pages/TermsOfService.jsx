import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Terms of Service</h1>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to the Pokédex App! By using this app, you agree to these Terms of Service. Please note that this app is a student project and not intended for commercial purposes.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Use of the App</h2>
      <p className="text-lg text-gray-700 mb-4">
        The Pokédex App is intended for educational and non-commercial use only. The app allows users to view Pokémon data and related information, which is retrieved from a third-party API PokéAPI (https://pokeapi.co/). Registered users may like specific Pokémon, and get personalized experience. Users can also explore the favorite Pokémon of others, fostering community among Pokémon enthusiasts. Any data collected, such as usernames and favorite Pokémon, is for enhancing user experience and is not shared with third parties.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Third-Party APIs</h2>
      <p className="text-lg text-gray-700 mb-4">
        The app fetches Pokémon data from PokéAPI. We do not guarantee the accuracy, availability, or reliability of this data, and we are not responsible for any issues that may arise from using third-party services.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Limitation of Liability</h2>
      <p className="text-lg text-gray-700 mb-4">
        Since this app is for educational purposes and provided "as is," we are not liable for any issues, data inaccuracies, or damages arising from its use. Use the app at your own risk.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Changes to the App</h2>
      <p className="text-lg text-gray-700 mb-4">
        We may modify or discontinue the app at any time without prior notice.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
      <p className="text-lg text-gray-700 mb-4">
        If you have any questions regarding these Terms of Service, please contact us at: info@pokeapp.hive.fi.
      </p>
      <p className="text-center mt-6">
        <a href="/" className="text-blue-600 hover:underline">Back to Home</a>
      </p>
    </div>
  );
};

export default TermsOfService;
