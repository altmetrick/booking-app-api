import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import * as path from 'path';
import * as fs from 'fs';
import imageDownloader from 'image-downloader';
import { createError } from '../utils/create-error.js';

console.log('__dirname', __dirname);
console.log(path.join(__dirname, '..'));

//'places/photos'
export const uploadPhotoByLink = async (req, res, next) => {
  const { photoUrl } = req.body;

  if (!photoUrl || photoUrl.length < 5) {
    return next(createError({ status: 400, message: 'Url for the photo must be provided!' }));
  }
  //here using imageDownloader to download photo by provided Url from the client:
  //and sending back stored photo name so client could render the photo:
  // <img src={`${API_BASE_URL}`/uploads/${imageName}}
  // API_BASE_URL - host name (on dev: http://localhost:5000/api) it will change when api is deployed somewhere
  const newPhotoName = 'photo' + Date.now() + '.jpg';
  const options = {
    url: photoUrl,
    dest: path.join(__dirname, '..', 'uploads', newPhotoName),
  };
  try {
    await imageDownloader.image(options);
    return res.json({ photoUrl: newPhotoName });
  } catch (err) {
    return next(createError({ status: 500, message: err.message }));
  }
};

export const deletePhotoByName = async (req, res, next) => {
  const { photoName } = req.params;

  if (!photoName) {
    return next(createError({ status: 400, message: 'Photo name must be provided!' }));
  }
  //
  try {
    await fs.unlinkSync(path.join(__dirname, '..', 'uploads', photoName));
    return res.json({ message: `Image with url ${photoName} is deleted.` });
  } catch (err) {
    next(createError({ status: 500, message: err.message }));
  }
};

export const uploadPhotos = async (req, res, next) => {};

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

export const createPlace = async (req, res, next) => {
  const { userId } = req.user;
  res.json({ message: `create place` });
};

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
