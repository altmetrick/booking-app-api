import { body, validationResult } from 'express-validator';
import { createError } from '../utils/create-error.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    return next(createError({ status: 400, message: errorMessages }));
  }

  return next();
};

export const validateCreatePlaceInput = [
  body('title').notEmpty().withMessage('Title is required!'),
  body('description').notEmpty().withMessage('Description is required!'),
  body('address').notEmpty().withMessage('Address is required!'),
  body('photos')
    .isArray({ min: 2, max: 5 })
    .withMessage('Photos are required as array min 2, max 5 length!'),
  body('perks').isArray().withMessage('Perks need to be empty array or array of strings'),
  body('extraInfo').notEmpty().withMessage('Extra info is required'),
  body('checkIn').notEmpty().withMessage('Check in  is required'),
  body('checkOut').notEmpty().withMessage('Check out is required'),
  body('maxGuests').notEmpty().withMessage('Amount of max guests is required'),
  body('price').notEmpty().withMessage('Price per night is required'),
];

export const validateCreateBookingInput = [
  body('place').notEmpty().withMessage('Place id is required'),
  body('checkIn').notEmpty().withMessage('Check-in date is required'),
  body('checkOut').notEmpty().withMessage('Checkout date is required'),
  body('name').notEmpty().withMessage('User(tenant) full name is required'),
  body('phone').notEmpty().withMessage('User(tenant) phone number is required'),
];
