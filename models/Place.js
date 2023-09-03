import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Id of user owner of a place must be provided'],
    },
    title: {
      type: String,
      required: [true, 'Title name must be provided'],
      maxLength: [30, 'Title cannot be more than 30 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description must be provided'],
      maxLength: [300, 'Description cannot be more than 300 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address must be provided'],
      maxLength: [50, 'Address cannot be more than 50 characters'],
    },
    photos: {
      type: [{ url: String, name: String }],
      required: [true, 'Provided photos for a new place'],
    },
    perks: {
      type: [String],
    },
    extraInfo: {
      type: String,
    },
    checkIn: {
      type: String,
      required: [true, 'Provide checkIn time'],
    },
    checkOut: {
      type: String,
      required: [true, 'Provide checkOut time'],
    },
    maxGuests: {
      type: Number,
      required: [true, 'Provide max guests'],
    },
    price: {
      type: Number,
      required: [true, 'Provide price per night'],
    },
  },
  { timestamps: true }
);

const PlaceModel = mongoose.model('Place', PlaceSchema);

export default PlaceModel;
