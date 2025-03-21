import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../component/AllContext/AllContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PostTrip() {
  const { token, url, user, getUserInformation } = useAppContext();
  const navigate = useNavigate();

  const [tripDetails, setTripDetails] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    seatsAvailable: "",
    vehicle: "",
    description: "",
    mobileNumber: "",
    email: "",
    pickupPoints: [{ location: "", price: "" }], 
  });

  useEffect(() => {
    getUserInformation();
  }, []);

  if (!token) {
    return (
      <div className="text-center text-red-500 text-lg mt-10">
        You must be logged in to post a trip.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripDetails({ ...tripDetails, [name]: value });
  };

  const handlePickupChange = (index, field, value) => {
    const updatedPickupPoints = [...tripDetails.pickupPoints];
    updatedPickupPoints[index][field] = value;
    setTripDetails({ ...tripDetails, pickupPoints: updatedPickupPoints });
  };

  const addPickupPoint = () => {
    setTripDetails({
      ...tripDetails,
      pickupPoints: [...tripDetails.pickupPoints, { location: "", price: "" }],
    });
  };

  const removePickupPoint = (index) => {
    const updatedPickupPoints = tripDetails.pickupPoints.filter((_, i) => i !== index);
    setTripDetails({ ...tripDetails, pickupPoints: updatedPickupPoints });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/api/trips/post-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...tripDetails,
          userId: user._id,
        }),
      });

      if (response.ok) {
        toast.success("Trip posted successfully! 🎉");
        setTimeout(() => navigate("/"), 3000);
      } else {
        toast.error("Failed to post trip. Please try again!");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl w-full">
        <h2 className="text-center text-3xl font-bold">🚗 Post a Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Origin", name: "origin", type: "text" },
              { label: "Destination", name: "destination", type: "text" },
              { label: "Date", name: "date", type: "date" },
              { label: "Time", name: "time", type: "time" },
              { label: "Seats Available", name: "seatsAvailable", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-semibold">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={tripDetails[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border rounded-lg"
                />
              </div>
            ))}

            <div>
              <label className="block font-semibold">Vehicle Type</label>
              <select
                name="vehicle"
                value={tripDetails.vehicle}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select a vehicle</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Van">Van</option>
                <option value="Bus">Bus</option>
              </select>
            </div>
          </div>

          {/* Pickup Points */}
          <div className="space-y-4">
            <label className="block font-semibold">Pickup Points & Price</label>
            {tripDetails.pickupPoints.map((pickup, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center">
                <input
                  type="text"
                  placeholder="Pickup Point"
                  value={pickup.location}
                  onChange={(e) => handlePickupChange(index, "location", e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={pickup.price}
                  onChange={(e) => handlePickupChange(index, "price", e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePickupPoint(index)}
                    className="text-red-500 font-bold"
                  >
                    ❌ Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addPickupPoint} className="text-blue-600 font-bold">
              ➕ Add More Pickup Point
            </button>
          </div>

          {/* Contact & Description */}
          <div className="grid grid-cols-2 gap-6">
            {[{ label: "Mobile Number", name: "mobileNumber", type: "tel" },
              { label: "Email", name: "email", type: "email" }].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-semibold">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={tripDetails[name]}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border rounded-lg w-full"
                />
              </div>
            ))}
          </div>

          <textarea
            name="description"
            value={tripDetails.description}
            onChange={handleChange}
            placeholder="Trip details..."
            required
            className="w-full px-4 py-3 border rounded-lg"
          ></textarea>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">
            🚀 Post Trip
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostTrip;