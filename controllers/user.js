import User from '../models/User.js';

export const getUserInfo = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const foundUser = await User.findById(userId).select('name email');
    res.status(200).json({ user: foundUser });
  } catch (err) {
    return next(err);
  }
};

export const updateUserInfo = async (req, res, next) => {
  //Reading userId from previously decoded access token
  const { userId } = req.user;
  const { name, email } = req.body;

  if (!name && !email) {
    return next(createError({ status: 400, message: 'User name or email is required!' }));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { name, email },
      { new: true, runValidators: true }
    ).select('name email');

    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    return next(err);
  }
};
