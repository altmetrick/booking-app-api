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

    return res.json({ message: `Photo - ${photoName} is deleted.` });
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
  res.json({ message: 'Got all places' });
};

export const getPlace = async (req, res, next) => {
  const { id } = req.params;
  res.json({ message: `got place with id: ${id}` });
};

//For authorized users
//for protected route : '/places/me
export const getAllUserPlaces = async (req, res, next) => {
  const { userId } = req.user;
  res.json({ message: `get all user places` });
};

//// -----

// title,
//       description,
//       address,
//       photos,
//       perks,
//       extraInfo,
//       checkIn,
//       checkOut,
//       maxGuests,

export const createPlace = async (req, res, next) => {
  const { userId } = req.user;
  const { title, description, address, photos, perks, extraInfo, checkIn, checkOut, maxGuests } =
    req.body;

  res.json({
    message: `create place`,
    newPlace: {
      title,
      description,
      address,
      photos,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    },
  });
};

////----

export const updatePlace = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;
  res.json({ message: `update users place id:${id}` });
};

export const deletePlace = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;
  res.json({ message: `delete users place id:${id}` });
};
