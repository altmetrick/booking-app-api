import express from 'express';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { upload } from '../middleware/upload.js';
import { validateCreatePlaceInput, validateRequest } from '../middleware/validation.js';

import {
  getAllPlaces,
  getPlace,
  getAllUserPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  uploadPhotoByLink,
  uploadPhotos,
  deletePhotoByName,
} from '../controllers/places.js';

const router = express.Router();

router.post('/photo-by-link', verifyJWT, uploadPhotoByLink);
router.delete('/photos/:photoName', verifyJWT, deletePhotoByName);

// upload.array('$Name', 4) - name should be the same as in <input type type="file" name="$Name" ../>
// and when appending on the client  filesData.append(`$Name`, newImgFiles[i]);
router.post('/photos', verifyJWT, upload.array('photos', 5), uploadPhotos);

// '/places'
router.get('/me', verifyJWT, getAllUserPlaces);
router.post('/me', validateCreatePlaceInput, validateRequest, verifyJWT, createPlace);
router.patch('/me/:id', verifyJWT, updatePlace);
router.delete('/me/:id', verifyJWT, deletePlace);

router.get('/', getAllPlaces);
router.get('/:id', getPlace);

export default router;
