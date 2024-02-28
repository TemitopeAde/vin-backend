const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const mongoUri = 'mongodb+srv://hellenmara1212:Temade123@cluster0.v03ddg2.mongodb.net/items';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });


const productSchema = new mongoose.Schema({
  // Define your schema here
  // Example:
  title: String,
  description: String,
  // Add other fields as needed
}, { collection: "items" });

const Product = mongoose.model('Product', productSchema);

app.get('/api/items', async (req, res) => {
  console.log(req.query);

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const searchQuery = req.query.search || '';

    const regex = new RegExp(searchQuery, 'i');

    const count = await Product.countDocuments({
      $or: [
        { NAME: regex },
        { VENUE: regex },
        { CITY: regex },
        { CATEGORY: regex },
        { TYPE: regex }
        // Add more fields if needed
      ]
    })
      .exec();


    const totalPages = Math.ceil(count / limit);

    const items = await Product.find({
      $or: [
        { NAME: regex },
        { VENUE: regex },
        { CITY: regex },
        { CATEGORY: regex },
        { TYPE: regex }
        // Add more fields if needed
      ]
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
      items,
      pagination: { current: page, totalPages, totalItems: count }
    });

    console.log(items.length);
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/search', async (req, res) => {
  console.log(req.query.term);


  const searchQuery = req?.query?.term || '';
  const regex = new RegExp(searchQuery, 'i');

  try {

    const items = await Product.find({
      $or: [
        { NAME: regex },
        // { VENUE: regex },
        // { CITY: regex },
        // { CATEGORY: regex },
        // { TYPE: regex } 
      ]
    })

    // console.log(items);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
      items
    });

    console.log(items.length);
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ message: "Internal server error" });
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

// POST request to send an email
app.post('/api/send-email', async (req, res) => {
  console.log("req");
  try {

    const to = "adesiyantope2014@gmail.com";
    const subject = "Test email"

    const html = `
      <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600&family=Lato:wght@400;700&display=swap"
    rel="stylesheet">
  <title>Email Template</title>
  <style>
    .list__options li {
      display: inline-block;
      margin-right: 3rem;
      font-family: "Archivo", sans-serif;
      font-size: 16px;
      line-height: 24px;
    }

    .list__options li a {
      text-decoration: none;
      color:#8C97AA;
    }

    .footer li {
      display: inline-block;
      margin-right: 1rem;
    }

    .start__button {
      background-color: #000000;
      transition: cubic-bezier(0.445, 0.05, 0.55, 0.95);
    }

    .start__button:hover {
      background-color: #101E38;
    }
  </style>

</head>

<body style="padding: 0; font-family: Lato, sans-serif;text-align: center;justify-content: center;align-items: center;">
  <div style="position: relative;background-color: #fff; padding: 3rem 3rem; width: 600px; border: 1px solid #D2D2D2; border-radius: 15px; margin: 40px auto;">

    <table>
      <tr>
        <td>
          <img style="transform: scale(0.9);" height="110" width="110" src="https://static.wixstatic.com/media/09a417_f286a6b7e6e5438bb43d26d044b0011c~mv2.png" alt="Central Bank Logo">
        </td>
      </tr>
    </table>




    <table  align="center" role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" >
          <img width="131" height="131" src="https://static.wixstatic.com/media/09a417_4b180deb813743c690835dae79e36225~mv2.png" alt="document">
        </td>
      </tr>
      <tr>
        <td align="center" style="font-family: Lato, sans-serif; font-size: 25px; line-height: 37.5px; color: #A1A1A1;">
          Please complete
        </td>
      </tr>
      <tr>
        <td align="center"
          style="font-weight: 700; font-family: Lato, sans-serif; color: #101E38; font-size: 35px; line-height: 52.5px;">
          Worksheet (title)
        </td>
      </tr>

    </table>

    <button class="start__button"
      style="color: #fff; width: 100%; border-radius: 100px; padding: 12px 48px 12px 48px; font-weight: 600; font-size: 16px; font-family: Archivo, sans-serif; line-height: 24px; cursor: pointer; border: none; outline: none; margin-top: 5rem; margin-bottom: 4rem;">
      Start
    </button>

    <hr style="background-color:#E9ECF2;">

    <section class="list__options" style="margin-top: 4rem;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="text-align: center;">
            <ul style="list-style: none; display: inline-block; padding: 0;">
              <li>
                <a href="#">Opportunities</a>
              </li>
              <li>
                <div style="width: 6px; height: 6px; background:#8C97AA; border-radius: 50%; display: inline-block;">
                </div>
              </li>
              <li>
                <a href="#">To-do</a>
              </li>
              <li>
                <div style="width: 6px; height: 6px; background:#8C97AA; border-radius: 50%; display: inline-block;">
                </div>
              </li>
              <li>
                <a href="#">Refer Deal</a>
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </section>
  </div>


  <section class="footer">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="text-align: center;">
          <ul style="list-style: none; display: inline-block; padding: 0;">
            <li>
              <a href="http://" target="_blank">
                <img style="transform: scale(0.8);" src="https://static.wixstatic.com/media/09a417_660791280b694fe982b23000249e607e~mv2.png" alt="instagram">
              </a>
            </li>
            <li>
              <a href="http://">
                <img style="transform: scale(0.8);" src="https://static.wixstatic.com/media/09a417_03fb7de3f14e44e0ab6039791ffd6f14~mv2.png" alt="facebook">
              </a>
            </li>
            <li>
              <a href="http://">
                <img style="transform: scale(0.8);" src="https://static.wixstatic.com/media/09a417_1cb55d1b560c49bb8e00aa5e9fb14462~mv2.png" alt="linkedin">
              </a>
            </li>
            <li>
              <a href="http://">
                <img style="transform: scale(0.8);" src="https://static.wixstatic.com/media/09a417_08d0b0e898e442f0a7e8c0a8219dc0c3~mv2.png" alt="twitter">
              </a>
            </li>
          </ul>
        </td>
      </tr>
    </table>
    <p style="font-size: 12px; font-family: Archivo, sans-serif; text-align: center; color:
  #47546B;">Switch Tech, LLC | 8 The Green, ste. a | Doover, DE 19901</p>
  </section>

</body>

</html>
    
    `

    // Create a nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'adesiyantope2014@gmail.com', // your gmail account
        pass: 'xjhv jmdo xejx zdzr' // your gmail password
      }
    });

    // Define email options
    const mailOptions = {
      from: 'adesiyantope2014@gmail.comm',
      to: to,
      subject: subject,
      html: html // Specify HTML content here
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
