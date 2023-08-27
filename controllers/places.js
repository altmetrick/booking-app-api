import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import * as path from 'path';
import * as fs from 'fs';

import imageDownloader from 'image-downloader';
import { createError } from '../utils/create-error.js';

//

//'places/photos'
export const uploadPhotoByLink = async (req, res, next) => {
  const { photoUrl } = req.body;

  if (!photoUrl || photoUrl.length < 5) {
    return next(createError({ status: 400, message: 'Url for the photo must be provided!' }));
  }
  //here using imageDownloader to download photo by provided Url by client:
  //and sending back url to the stored photo so client could render the photo
  const newPhotoName = 'photo' + Date.now() + '.jpg';
  const options = {
    url: photoUrl,
    dest: path.join(__dirname, '..', 'uploads', newPhotoName),
  };
  try {
    //dynamically creating new photoUrl, as host, protocol will change when app will be deployed
    const host = req.headers.host;
    const photoUrl = `${req.protocol}://${host}/api/uploads/${newPhotoName}`;

    await imageDownloader.image(options);
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
  // - check if the file (photoName) is existing in uploads folder

  //
  try {
    await fs.unlinkSync(path.join(__dirname, '..', 'uploads', photoName));
    return res.json({ message: `Image with name ${photoName} is deleted.` });
  } catch (err) {
    next(createError({ status: 500, message: err.message }));
  }
};

export const uploadPhotos = async (req, res, next) => {
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
  //single file
  // const {file} = req
  // ... host
  // const photo = {
  //   url: `${req.protocol}://${host}/api/uploads/${file.filename}`,
  //   name: file.filename,
  // };
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
