import mongoose from 'mongoose';

const connectDB = (url) =>
  mongoose
    .set({ strictQuery: true })
    .connect(url)
    .then(() => console.log('CONNECTED TO THE DB...'))
    .catch((err) => console.log(err));

export default connectDB;
