import React from 'react';

function Usercard({ trip }) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row mb-6">
      {/* Left Section - User Image */}
      <div className="sm:w-1/3 w-full flex justify-center items-center bg-gray-100 p-4">
        <img
          src={trip.userImage || "https://via.placeholder.com/150"}
          alt="User"
          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-4 border-gray-300"
        />
      </div>

      {/* Right Section - Trip Details */}
      <div className="p-6 w-full sm:w-2/3">
        {/* User's Name + Trip Route */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{trip.userName}</h2>
        <p className="text-xl font-semibold text-blue-600 mb-4">
          {trip.origin} <span className="text-gray-500">→</span> {trip.destination}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <p><strong>Date:</strong> {trip.date}</p>
          <p><strong>Time:</strong> {trip.time}</p>
          <p><strong>Seats:</strong> {trip.seatsAvailable}</p>
          <p><strong>Price:</strong> {trip.pricePerSeat}</p>
          <p><strong>Vehicle:</strong> {trip.vehicle}</p>
          <p><strong>Pickup:</strong> {trip.pickupPoint}</p>
          <p><strong>Mobile:</strong> {trip.mobileNumber}</p>
          <p><strong>Email:</strong> {trip.email}</p>
          <p><strong>Joined:</strong> {trip.join_person.count} ({trip.join_person.names.join(', ')})</p>
        </div>
        <p className="mt-2"><strong>Description:</strong> {trip.description}</p>

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:${trip.mobileNumber}`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center">
            <i className="fa fa-phone mr-2"></i> Call
          </a>
          <a href={`mailto:${trip.email}`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center">
            <i className="fa fa-envelope mr-2"></i> Mail
          </a>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition duration-300 flex items-center">
            <i className="fa fa-comments mr-2"></i> Chat
          </button>
          {/* Join Trip Button */}
          <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 flex items-center">
            <i className="fa fa-user-plus mr-2"></i> Join Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default Usercard;
