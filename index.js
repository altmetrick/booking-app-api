import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import * as path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import multer from 'multer';

import connectDB from './db/connect.js';

import allRoutes from './routes/index.js';

const app = express();
//
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

//Middleware
app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//serve uploaded images as static so it will be possible for client
//get images by 'BASE_URL/api/uploads/imageName'
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'hello world' });
});

app.use('/api', allRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      err.status = 400;
      err.message = 'Upload failed, amount of photos should be les than 5!';
    }
    err.message = err.code;
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error!';

  return res.status(status).json({ message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
