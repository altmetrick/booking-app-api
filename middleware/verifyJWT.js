import jwt from 'jsonwebtoken';
import { createError } from '../utils/create-error.js';

export const verifyJWT = (req, res, next) => {
  let token;

  // 1 we need to check whether client sent token on header or on cookies
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];

    // check cookies
  } else if (req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return next(createError({ status: 403, message: 'Forbidden!' }));
  }

  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      //return res.status(403).json({ message: 'Forbidden' });
      return next(createError({ status: 403, message: 'Forbidden!' }));
    }

    req.user = decoded;
    return next();
  });
};
