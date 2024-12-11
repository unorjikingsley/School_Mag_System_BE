import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

import routes from './routes/index.js';
app.use(routes);

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

const PORT = process.env.PORT || 3000

try {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}...`)
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
