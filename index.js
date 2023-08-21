require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

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

//Routes

app.get('/auth/register', (req, res) => {
  res.json({ message: 'hello world' });
});
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ message: 'hello world' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
