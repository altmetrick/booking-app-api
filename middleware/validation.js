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
  body('title').notEmpty().withMessage('Title must be provided!'),
  body('description').notEmpty().withMessage('Description must be provided!'),
  body('address').notEmpty().withMessage('Address must be provided!'),
  body('photos')
    .isArray({ min: 2, max: 5 })
    .withMessage('Photos must be provided as array min 2, max 5 length!'),
  body('perks').isArray().withMessage('Perks must be empty array or array of strings'),
  body('extraInfo').notEmpty().withMessage('Extra info must be provided'),
  body('checkIn').notEmpty().withMessage('Check in  must be provided'),
  body('checkOut').notEmpty().withMessage('Check out must be provided'),
  body('maxGuests').notEmpty().withMessage('Amount of max guests must be provided'),
];
