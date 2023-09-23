import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import * as path from 'path';
import * as fs from 'fs';

import { validationResult } from 'express-validator';

import imageDownloader from 'image-downloader';
import { createError } from '../utils/create-error.js';
import Place from '../models/Place.js';

//

//'places/photos'
export const uploadPhotoByLink = async (req, res, next) => {
  const { photoUrl } = req.body;

  if (!photoUrl || photoUrl.length < 5) {
    return next(createError({ status: 400, message: 'Url for the photo must be provided!' }));
  }
  //here using imageDownloader to download photo by provided Url by client:
  const newPhotoName = 'photo' + Date.now() + '.jpg';
  const options = {
    url: photoUrl,
    dest: path.join(__dirname, '..', 'uploads', newPhotoName),
  };
  try {
    const result = await imageDownloader.image(options);

    //when image is uploaded we need to send back an url for this image on client
    //dynamically creating new photoUrl, as host, protocol will change when app will be deployed
    const host = req.headers.host;
    const photoUrl = `${req.protocol}://${host}/api/uploads/${newPhotoName}`;

    //also sending photo name, so we'll be able to use it as 'id' for deleting the photo from storage
    return res.json({ photo: { url: photoUrl, name: newPhotoName } });
  } catch (err) {
    return next(createError({ status: 500, message: err.message }));
  }
};

export const deletePhotoByName = async (req, res, next) => {
  const { photoName } = req.params;

  if (!photoName) {
    return next(createError({ status: 400, message: 'Photo name must be provided!' }));
  }

  const imagePath = path.join(__dirname, '..', 'uploads', photoName);

  try {
    // check if photo exists
    if (!fs.existsSync(imagePath)) {
      return next(createError({ status: 404, message: 'Image not found!' }));
    }
    //delete photo from server storage
    await fs.unlinkSync(imagePath);

    // also need to update a Place which has deleted image in its photos array
    await Place.updateMany(
      { 'photos.name': photoName }, // Find places with the specific photoName in their photos array
      { $pull: { photos: { name: photoName } } } // Remove the reference to the deleted image
    );

    return res.json({ message: `Photo - ${photoName} is deleted.`, name: photoName });
  } catch (err) {
    next(createError({ status: 500, message: err.message }));
  }
};

export const uploadPhotos = async (req, res, next) => {
  //const photoDocsJson = JSON.parse(req.body.photosDocs);

  //read files which is provided by multer middleware to req object
  const { files } = req;

  //creating [{url: string, name: string}] of uploaded images;
  const host = req.headers.host;
  //mapping files to create photos objects with urls of uploaded images
  const photos = files.map((file) => ({
    url: `${req.protocol}://${host}/api/uploads/${file.filename}`,
    name: file.filename,
  }));

  return res.json({ photos, message: 'Photo uploaded' });
};

// route '/places
//For all users
export const getAllPlaces = async (req, res, next) => {
  try {
    const queryObject = { ...req.query };

    if (req.query.address) {
      queryObject.address = { $regex: req.query.address, $options: 'i' };
    }

    //Filter ranges
    // /price?price[gt]=100&price[lt]=500  // req.params.price / {gt: '100', lt: '500'} => {$gt: '100', $lt: '500'}
    const removeFields = ['page', 'limit', 'sort'];
    removeFields.forEach((param) => delete queryObject[param]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    console.log(queryStr);

    let result = Place.find(JSON.parse(queryStr));

    //Sort
    //field: val:  -1 for descending (3, 2, 1) order and 1 for ascending ( 1, 2, 3)
    if (req.query.sort) {
      const sortList = req.query.sort.split(',').join(' ');
      result = result.sort(sortList);
    }

    //Pagination - implementing pagination using skip and limit methods
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    //Note that we await places after all operations with the result (filter, sort...)
    const places = await result;

    //Counting all places that match our filters
    //it is necessary to create pagination on front-end
    const count = await Place.countDocuments(JSON.parse(queryStr));

    return res.status(200).json({ places, count });
  } catch (err) {
    return next(err);
  }
};

export const getPlace = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(createError({ status: 400, message: 'Id of the place must be provided!' }));
  }

  try {
    const place = await Place.findOne({ _id: id });

    if (!place) {
      return next(createError({ status: 404, message: `Place with id: ${id} does not exist!` }));
    }

    return res.status(200).json({ place });
  } catch (err) {
    return next(err);
  }
};

//For authorized users
//for protected route : '/places/me
export const getAllUserPlaces = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const places = await Place.find({ owner: userId }).exec();

    return res.status(200).json({ places });
  } catch (err) {
    return next(err);
  }
};

export const createPlace = async (req, res, next) => {
  const { userId } = req.user;
  const {
    title,
    description,
    address,
    photos,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  try {
    const place = await Place.create({
      owner: userId,
      title,
      description,
      address,
      photos,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    return res.status(200).json({
      message: `New place was created.`,
      place,
    });
  } catch (err) {
    return next(err);
  }
};

export const updatePlace = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { placeData } = req.body;

  if (!placeData) {
    return next({ status: 400, message: 'Provide place data to update' });
  }

  try {
    const foundPlace = await Place.findById(id);

    if (!foundPlace) {
      return next(createError({ status: 404, message: `Place with id: ${id} does not exist` }));
    }
    if (foundPlace.owner.toString() !== userId) {
      return next(createError({ status: 404, message: `It is not your place!` }));
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      { _id: id },
      { ...placeData },
      { new: true, runValidators: true }
    ).exec();

    return res.status(200).json({ place: updatedPlace, message: 'Place successfully updated!' });
  } catch (err) {
    return next(err);
  }
};

export const deletePlace = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const foundPlace = await Place.findById(id);

    if (!foundPlace) {
      return next(createError({ status: 404, message: `Place with id: ${id} does not exist` }));
    }
    if (foundPlace.owner.toString() !== userId) {
      return next(createError({ status: 404, message: `It is not your place!` }));
    }

    //Before deleting a  place from the DB, delete all it's photos from the storage

    const photos = foundPlace.toObject().photos;
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const imagePath = path.join(__dirname, '..', 'uploads', photo.name);
      // check if photo exists
      if (!fs.existsSync(imagePath)) {
        continue;
      }
      //delete photo from server storage
      await fs.unlinkSync(imagePath);
    }

    const deletedPlace = await Place.findByIdAndDelete({ _id: id }).exec();

    return res.status(200).json({ id, message: 'Place successfully deleted!' });
  } catch (err) {
    return next(err);
  }
};
