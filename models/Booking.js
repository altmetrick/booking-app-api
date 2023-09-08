import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Places',
      required: [true, 'Provide place id'],
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provide user(tenant) id'],
    },
    checkIn: {
      type: String,
      required: [true, 'Provide check-in date'],
    },
    checkOut: {
      type: String,
      required: [true, 'Provide checkout date'],
    },
    name: {
      type: String,
      required: [true, 'Provide your full name'],
      maxLength: [50, 'Name cannot be more than 50 characters'],
    },
    phone: {
      type: Number,
      required: [true, 'Provide your phone'],
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model('Booking', BookingSchema);

export default BookingModel;
