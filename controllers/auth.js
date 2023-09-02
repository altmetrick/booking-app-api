import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/create-error.js';

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  //data validation
  if (!name || !email || !password) {
    return next(
      createError({ status: 400, message: 'User name, email, and password are required!' })
    );
  }

  //checking if provided email is unique
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    return next(createError({ status: 409, message: `Email ${email} is already taken.` }));
  }

  //creating a new user in the db
  try {
    //- encrypting password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });

    //- creating and sending access token in cookie for just registered user

    const payload = {
      userId: newUser._id.toString(),
      email: newUser.email.toString(),
    };
    const accessToken = await jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: '5d',
    });

    return res
      .cookie('access_token', accessToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', // cookie will be sent from client on different domain
      })
      .status(200)
      .json({
        user: { name: newUser.name, email: newUser.email },
        message: `User ${newUser.name} successfully registered`,
      });
  } catch (err) {
    return next(createError({ status: 500, message: err.message }));
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError({ status: 400, message: 'Email and password are required!' }));
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return next(
        createError({ status: 404, message: 'Invalid credentials! -not found user by email' })
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      return next(
        createError({ status: 401, message: 'Invalid credentials -password is not correct' })
      );
    }

    const payload = {
      userId: foundUser._id,
      email: foundUser.email,
    };
    const accessToken = await jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: '5d',
    });

    return res
      .cookie('access_token', accessToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', // cookie will be sent from client to api on different domain
      })
      .status(200)
      .json({
        user: { name: foundUser.name, email: foundUser.email },
        message: `User ${foundUser.name} successfully loged-in`,
      });
  } catch (err) {
    return next(createError({ status: 500, message: err.message }));
  }
};
export const logout = async (req, res, next) => {
  res.clearCookie('access_token', { httpOnly: true, sameSite: 'None', secure: true });
  return res.status(200).json({ message: 'Logout success!' });
};

export const isLoggedIn = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.json({ isLoggedIn: false });
  }

  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err) => {
    if (err) {
      return res.json({ isLoggedIn: false });
    }

    return res.json({ isLoggedIn: true });
  });
};
