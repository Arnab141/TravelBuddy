import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AllContext/AllContext';
import './Usercard.css';
import user_icon from '../../assets/client_image/user_icon.jpeg'

function Usercard({ trip: initialTrip }) {
  const { token, url, user, getUserInformation } = useAppContext();
  
  const [trip, setTrip] = useState(initialTrip);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoin = async () => {
    try {
      const response = await fetch(`${url}/api/trips/join-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tripId: trip._id, userId: user._id }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        alert(result.msg);
        return; // Stop execution if joining the trip fails
      }
  
      alert('Successfully joined the trip');
  
      // ✅ Corrected state update
      const updatedTrip = { ...trip, seatsAvailable: trip.seatsAvailable - 1 };
      setTrip(updatedTrip);
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  useEffect(()=>{
    getUserInformation();
  },[]);

  return (
    <div>
      {/* Trip Card */}
      <div className="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition transform hover:scale-105" onClick={() => setIsModalOpen(true)}>
        <img 
          src={trip.userId.profileImage || user_icon} 
          alt="User" 
          className="w-20 h-20 rounded-full mx-auto border-2 border-gray-300"
        />
        <div className="text-center mt-3">
          <h3 className="text-lg font-semibold text-gray-800">{trip.userId.name || 'Unknown User'}</h3>
          <p className="text-sm text-gray-600"><strong>Origin:</strong> {trip.origin}</p>
          <p className="text-sm text-gray-600"><strong>Destination:</strong> {trip.destination}</p>
          <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600">View Details</button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Trip Details</h2>
              <button className="text-gray-600 hover:text-red-500 text-xl" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            <p><strong>Host Name:</strong> {trip.userId.name}</p>
            <p><strong>Origin:</strong> {trip.origin}</p>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {trip.time}</p>
            <p><strong>Seats Available:</strong> {trip.seatsAvailable}</p> {/* ✅ This will now update dynamically */}
            <p><strong>Price Per Seat:</strong> {trip.pricePerSeat}</p>
            <p><strong>Vehicle:</strong> {trip.vehicle}</p>
            <p><strong>Pickup Point:</strong> {trip.pickupPoint}</p>
            <p><strong>Description:</strong> {trip.description}</p>

            {/* Contact Section */}
            <div className="mt-4">
              <p><strong>Phone:</strong> <a href={`tel:${trip.mobileNumber}`} className="text-blue-500">{trip.mobileNumber}</a></p>
              <p><strong>Email:</strong> <a href={`mailto:${trip.email}`} className="text-blue-500">{trip.email}</a></p>
            </div>

            {/* Participants */}
            <p className="mt-3"><strong>Participants:</strong> 
              {trip.participants.length > 0 ? (
                trip.participants.map((participant, index) => (
                  <span key={participant.userId._id}> {participant.userId.name}{index !== trip.participants.length - 1 ? ', ' : ''}</span>
                ))
              ) : (
                <span> No one has joined yet.</span>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Chat</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleJoin}>Join Trip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usercard;
