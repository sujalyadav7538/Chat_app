import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoute from './routes/Authroutes.js';

dotenv.config();

const app = express();

const Port = process.env.PORT || 3001;
const dataBaseUrl = process.env.DATABASEURL;

mongoose.connect(dataBaseUrl)
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));


const allowedOrigins=['http://localhost:5173']

app.use(cors({
    origin: (origin, callback) => {
        console.log(origin,allowedOrigins.includes(origin))
      if (allowedOrigins.includes(origin) || !origin) { 
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  
  // Handle preflight requests
  app.options('*', cors());


app.use(cookieParser());
app.use(express.json());

app.use('/auth', AuthRoute);

// Catch-all route for undefined routes
app.use((_, res) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  const { message = 'Internal Error', statusCode = 500 } = err;
  res.status(statusCode).json({
    message,
    success: false,
    statusCode
  });
});

app.listen(Port, () => {
  console.log('Listening on Port->', Port);
});
