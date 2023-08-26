import express from 'express';
import { verifyJWT } from '../middleware/verifyJWT.js';

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
router.delete('/photo-by-link/:photoName', verifyJWT, deletePhotoByName);

router.post('/photo', verifyJWT, uploadPhotos);

// '/places'
router.get('/me', verifyJWT, getAllUserPlaces);
router.post('/me', verifyJWT, createPlace);
router.patch('/me/:id', verifyJWT, updatePlace);
router.delete('/me/:id', verifyJWT, deletePlace);

router.get('/', getAllPlaces);
router.get('/:id', getPlace);

export default router;
