import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Content.css';
import { useAppContext } from '../AllContext/AllContext';

function Content() {
  const { token, setShowLoginPopup } = useAppContext();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (!token) {
      setShowLoginPopup(true);
    } else {
      setShowLoginPopup(false);
      navigate(path);
    }
  };

  return (
    <section className="content container mx-auto text-center py-20 bg-gradient-to-r from-blue-50 to-gray-100 shadow-xl rounded-xl">
      {/* Heading */}
      <h2 className="text-6xl font-extrabold mb-8 text-gray-800 drop-shadow-md">
        Your Travel Options
      </h2>
      <p className="text-2xl text-gray-600 mb-10 font-medium">
        Choose how you want to travel with 
        <span className="text-blue-600 font-bold"> TravelBuddy</span>
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-8 mb-16 flex-wrap my-10">
        <button
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-5 px-12 rounded-xl transition duration-300 text-2xl shadow-lg transform hover:scale-110 mb-4"
          onClick={() => handleNavigation('/post-trip')}
        >
          🚗 Post a Trip
        </button>
        <button
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-5 px-12 rounded-xl transition duration-300 text-2xl shadow-lg transform hover:scale-110 mb-4"
          onClick={() => handleNavigation('/find-trip')}
        >
          🔍 Find a Trip
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-5 px-12 rounded-xl transition duration-300 text-2xl shadow-lg transform hover:scale-110 mb-4"
          onClick={() => handleNavigation('/request-trip')}
        >
          📩 Request a Trip
        </button>
      </div>

      {/* Additional Content */}
      <div className="text-left px-6 md:px-24" id="about">
        <h3 className="text-5xl font-bold mb-6 text-gray-900">
          Why Choose <span className="text-blue-600">TravelBuddy?</span>
        </h3>
        <ul className="list-disc list-inside text-2xl text-gray-700 mb-8 leading-relaxed">
          <li>🚘 Traveling alone can be costly, but carpooling makes it more affordable.</li>
          <li>📆 Post your trip details—date, time, and available seats.</li>
          <li>🤝 Find travelers going the same way and share the ride.</li>
          <li>📉 Seat availability updates automatically as people join.</li>
          <li>🎉 Travel together, split costs, and enjoy a stress-free journey!</li>
        </ul>

        {/* Benefits Section */}
        <h3 className="text-5xl font-bold mb-6 text-gray-900">
          Benefits of Using TravelBuddy
        </h3>
        <ul className="list-disc list-inside text-2xl text-gray-700 space-y-5">
          <li>💰 Save money by sharing travel costs.</li>
          <li>🤝 Meet new people and make lasting connections.</li>
          <li>🌍 Reduce your carbon footprint by carpooling.</li>
          <li>🔒 Travel safer with verified users.</li>
        </ul>
      </div>
    </section>
  );
}

export default Content;
