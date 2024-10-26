import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-lg text-gray-700 mb-4">
        Thank you for using the Pokédex App! This Privacy Policy outlines how we collect, use, and protect your information when you interact with our app. Please note that this is a student project and not intended for commercial use.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Information We Collect</h2>
      <p className="text-lg text-gray-700 mb-4">
        We only collect your data that is essential for the functionality of the app: (1) username; (2) email address; (3) password; and (4) your favorite Pokémon.
      </p>
      <h2 className="text-2xl font-semibold mt-4">How We Use Your Information</h2>
      <p className="text-lg text-gray-700 mb-4">
        The information collected is used solely to enhance your experience within the app, such as personalizing content and managing user accounts.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Data Protection</h2>
      <p className="text-lg text-gray-700 mb-4">
        We take reasonable steps to protect your information. However, this is a student project, and we recommend that you do not provide any sensitive or personally identifiable information.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Third-Party APIs</h2>
      <p className="text-lg text-gray-700 mb-4">
        Our app uses the PokéAPI (https://pokeapi.co/) to provide Pokémon-related data. We do not guarantee the accuracy, availability, or reliability of this data, and we are not responsible for any issues that may arise from using third-party services.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Changes to This Privacy Policy</h2>
      <p className="text-lg text-gray-700 mb-4">
        We may update this Privacy Policy from time to time for any reason. Any changes will be posted on this page, and by continuing to use the app, you agree to be bound by the revised policy.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
      <p className="text-lg text-gray-700 mb-4">
        If you have any questions or concerns about this Privacy Policy, feel free to contact us at: info@pokeapp.hive.fi.
      </p>
      <p className="text-center mt-6">
        <a href="/" className="text-blue-600 hover:underline">Back to Home</a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
