import express from 'express';
import nodemon from 'nodemon';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRouter.js';
import { v2 as cloudinary } from 'cloudinary';
import userRouter from './routes/user.js';
import auth from './middlewares/auth.js';
import cors from 'cors';

import axios from 'axios';


const app = express();
dotenv.config();

// Use the cors middleware
app.use(cors());

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))



// NOT FOUND MIDDLEWARE
// app.use('*', (req, res) => {
//   res.status(404).json({ msg: 'not found' })
// });

app.use("/products", productRouter) // add auth
app.use("/api/v1/users", userRouter);


app.get('/generate_report/:vin', async (req, res) => {

  const vin = req.params.vin;
  console.log(vin);
  const api_url = `https://app.carsimulcast.com/api/generate_report/carfax/${vin}`;
  const headers = {
    "API-KEY": "OHDVIJTKQQJHBUWXMYLUAAEKXPSNAZ",
    "API-SECRET": "tywkhg70nn4geqe5dp8ck2d3m81b5rzj3u90uqi9",
  };

  try {
    const response = await axios.get(api_url, { headers });

    // Decode the base64 string to HTML
    const decodedHtml = Buffer.from(response.data, 'base64').toString('utf-8');

    console.log(decodedHtml);

    // Send the HTML as a response
    res.send(decodedHtml);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching or processing the report.');
  }
});

app.post('/api/invoice-created', async (req, res) => {

  // const { type, data } = res.body;
  console.log(res.body);

  // if (type === "invoice.created") {
  //   console.log(data, "data");
  //   const { id } = data
  //   const {order_id, location_id } = data.object.invoice;
  //   const { email_address } = data.object.invoice.primary_recipient

  //   console.log(email_address, id);
  // }


  res.status(200).json({
    message: "Success"
  });
});



cloudinary.config({
  cloud_name: "df04essjr",
  api_key: 628391574854572,
  api_secret: "XlB54R74QtmzOIfXafo9wlFUbbw"
});

const port = process.env.PORT || 5100;

try {
  await mongoose.connect("mongodb+srv://adesiyantope2014:Temade123@cluster0.a6l89lj.mongodb.net/");
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  })
} catch (error) {
  console.log(error);
  process.exit(1)
}