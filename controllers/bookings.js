import Booking from '../models/Booking.js';
import Place from '../models/Place.js';
import { createError } from '../utils/create-error.js';

export const getAllBookings = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const bookings = await Booking.find({ bookedBy: userId }).populate('place').exec();

    return res.status(200).json({ bookings });
  } catch (err) {
    next(err);
  }

  return res.json({ bookings: 'All bookings' });
};

export const getOneBooking = async (req, res, next) => {
  const { id } = req.params;

  return res.json({ booking: `Booking with id: ${id}` });
};

export const createBooking = async (req, res, next) => {
  const { userId } = req.user;
  const { place, checkIn, checkOut, name, phone, price } = req.body;

  try {
    const foundPlace = await Place.findById(place);
    // check if place exists;
    if (!foundPlace) {
      return next(createError({ status: 404, message: 'Place does not exists!' }));
    }

    // Check if the user is the owner of the place
    // if (foundPlace.owner.toString() === userId) {
    //   return next(createError({status: 403, message: 'You cannot book your won place'}));
    // }

    // Update the foundPlaces bookingRanges prop with new booking range;
    const newRange = { start: checkIn, end: checkOut };
    foundPlace.bookingRanges.push(newRange);
    const updatedPlace = await foundPlace.save();

    const booking = await Booking.create({
      place: foundPlace,
      bookedBy: userId,
      checkIn,
      checkOut,
      name,
      phone,
      price,
    });

    return res.status(200).json({ booking, message: 'Booked successfully!' });
  } catch (err) {
    return next(err);
  }
};

export const deleteBooking = (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  return res.json({ message: `Booking with id ${id} deleted` });
};
