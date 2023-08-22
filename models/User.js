import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name must be provided'],
      maxLength: [25, 'User name cannot be more than 25 characters'],
    },
    email: {
      type: String,
      required: [true, 'User email must be provided'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password must be provided'],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
