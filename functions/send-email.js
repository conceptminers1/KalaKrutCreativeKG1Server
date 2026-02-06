
require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', async (req, res) => {
  const { to, subject, text, html, templateId, dynamic_template_data } = req.body;

  const msg = {
    to,
    from: 'kalakrutconceptminers@gmail.com', // Change to your verified sender
    subject,
    text,
    html,
    templateId,
    dynamic_template_data,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    res.status(200).send({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body)
    }
    res.status(500).send({ success: false, message: 'Error sending email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
