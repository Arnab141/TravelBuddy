const TripModel = require('../model/TripModel');
const TripRequestModel = require('../model/TripRequestModel');
const UserModel = require('../model/UserModel');
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const postTrip = async (req, res) => {
  try {
    const { userId, origin, destination, date, time, seatsAvailable, pricePerSeat, vehicle, pickupPoint, description, mobileNumber, email } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const trip = new TripModel({
      userId,
      origin,
      destination,
      date,
      time,
      seatsAvailable,
      pricePerSeat,
      vehicle,
      pickupPoint,
      description,
      mobileNumber,
      email
    });

    const result = await trip.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("postTrip:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Request a trip
const requestTrip = async (req, res) => {
  try {
    const { userId, origin, destination, date, time, seatsAvailable, pricePerSeat, vehicle, pickupPoint, description, mobileNumber, email } = req.body;

    const trip = new TripModel({
      userId,
      origin,
      destination,
      date,
      time,
      seatsAvailable,
      pricePerSeat,
      vehicle,
      pickupPoint,
      description,
      mobileNumber,
      email
    });

    const result = await trip.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("requestTrip:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all trips
const allTrips = async (req, res) => {
  try {
    const trips = await TripModel.find().populate('userId', 'name email');
    res.status(200).json(trips);
  } catch (error) {
    console.error("allTrips:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { postTrip, requestTrip, allTrips };