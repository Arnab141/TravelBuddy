import React, { useState } from 'react';

function RequestTrip() {
  const [tripDetails, setTripDetails] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seatsNeeded: '',
    description: '',
    mobileNumber: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripDetails({
      ...tripDetails,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/request-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripDetails)
      });
      if (response.ok) {
        alert('Trip request submitted successfully');
        setTripDetails({
          origin: '',
          destination: '',
          date: '',
          time: '',
          seatsNeeded: '',
          description: '',
          mobileNumber: '',
          email: ''
        });
      } else {
        alert('Failed to submit trip request');
      }
    } catch (error) {
      console.error('Error submitting trip request:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-gray-100 py-12 px-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">Request a Trip</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <input type="text" name="origin" value={tripDetails.origin} onChange={handleChange} required
              className="input-field" placeholder="Origin" />
            <input type="text" name="destination" value={tripDetails.destination} onChange={handleChange} required
              className="input-field" placeholder="Destination" />
            <input type="date" name="date" value={tripDetails.date} onChange={handleChange} required
              className="input-field" />
            <input type="time" name="time" value={tripDetails.time} onChange={handleChange} required
              className="input-field" />
            <input type="number" name="seatsNeeded" value={tripDetails.seatsNeeded} onChange={handleChange} required
              className="input-field" placeholder="Seats Needed" />
            <input type="tel" name="mobileNumber" value={tripDetails.mobileNumber} onChange={handleChange} required
              className="input-field" placeholder="Mobile Number" />
            <input type="email" name="email" value={tripDetails.email} onChange={handleChange} required
              className="input-field" placeholder="Email" />
            <textarea name="description" value={tripDetails.description} onChange={handleChange} required
              className="input-field resize-none h-24" placeholder="Description"></textarea>
          </div>
          <button type="submit"
            className="w-full py-2 px-4 text-white font-medium rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Request Trip
          </button>
        </form>
      </div>
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s ease-in-out;
        }
        .input-field:focus {
          border-color: #2563eb;
          box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
        }
      `}</style>
    </div>
  );
}

export default RequestTrip;
