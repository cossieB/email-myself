import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
const formData = require('form-data');
const Mailgun = require('mailgun.js');

dotenv.config()

const mailgun = new Mailgun(formData);
const MAILGUN_KEY = process.env['MAILGUN_KEY']
const mg = mailgun.client({username: 'api', key: MAILGUN_KEY || 'key-yourkeyhere'});
const PUBKEY = process.env['MAILGUN_PUBKEY']

const DOMAIN = 'sandboxab001f3c9ee145d6a145546df2d5338f.mailgun.org';
const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} ${req.ip} `);
  next()
})


app.post('/email', async (req, res) => {
  const {name, company, email, msg} = req.body;
  const data = {
    from: 'Cossie Bot <postmaster@sandboxab001f3c9ee145d6a145546df2d5338f.mailgun.org>',
    to: process.env.EMAIL,
    subject: `${name} - ${company}`,
    html: `<div style="text-align: center"><h1>${company}</h1><h2>${name}</h2><p>${msg}</p></div>`
  };
  try {
    await mg.messages.create(DOMAIN, data);
    res.status(201).json({status: "success"})
  }
  catch(e: any) {
    console.log(e);
    res.status(500).json({error: e.message})
  }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server is listening');
});
