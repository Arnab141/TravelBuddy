const TripModel = require('../model/TripModel');
const TripParticipantModel = require('../model/TripParticipantModel');
const UserModel = require('../model/UserModel');

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
    
    const tripId = result._id;
    const users = [{ userId: userId, host: true }];
    const tripParticipant = new TripParticipantModel({
      tripId,
      users
    });
    await tripParticipant.save();

    res.status(201).json({ trip: result, tripParticipant });
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

// Join a trip
const joinTrip = async (req, res) => {
  try {
    const { tripId, userId } = req.body;

    const trip = await TripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const tripParticipant = await TripParticipantModel.findOne({ tripId });
    if (!tripParticipant) {
      return res.status(404).json({ msg: "Trip participants not found" });
    }

    // Check if user is already a participant
    const isParticipant = tripParticipant.users.some(participant => participant.userId.toString() === userId);
    if (isParticipant) {
      return res.status(400).json({ msg: "User is already a participant" });
    }

    // Add user to participants
    tripParticipant.users.push({ userId, host: false });
    await tripParticipant.save();
    
    // Add user to trip participants and update the seatsAvailable
    const updatedTrip = await TripModel.findByIdAndUpdate(
      tripId,
      {
        $push: { participants: { userId, joinedAt: Date.now() } }, 
        $inc: { seatsAvailable: -1 }
      },
      { new: true } 
    );  

    res.status(200).json({ msg: "User joined the trip", tripParticipant });
  } catch (error) {
    console.error("joinTrip:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

//Get trip by ID
const getTripById = async (req, res) => {
  try {
    console.log(req.params.id);
    const trip = await TripModel.findById(req.params.id).populate('userId', 'name email');
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error("getTripById:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = { postTrip, requestTrip, allTrips, joinTrip, getTripById };