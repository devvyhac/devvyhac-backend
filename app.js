const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const { validator } = require('./helpers/validator')
const { mailer } = require('./helpers/mailSender')
const PORT = process.env.PORT || 3500

const { Schema, model } = mongoose



// Connecting to MongoDB below here
mongoose.connect(process.env.DB,
{ useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  // throw error if error occurs
  if (err) console.log(err);

  // logging feedback on successful connection to db
  console.log("connected to database!")
  
})

// Declaring the database schema below here
const ContactSchema = new Schema({

	fullname: {type: String, require: true},
	email: {type: String, require: true},
	subject: {type: String, require: true},
	message: {type: String, require: true}

})

// using the schema to create a database model
const Contact = model('Contact', ContactSchema)

app.get("/", (req, res) => {
    res.send({ message: "welcome to my backend"})
})

app.post("/contact", async (req, res) => {

  try {

    const data = req.body;
    const payload = await validator.validateAsync({ ...data });

    const emailOptions = {
      from: `"Abdulqudus Ismail" <${process.env.EMAIL}>`,
      to: payload.email,
      subject: "Response from Abdulqudus Ismail (Devvyhac)",
      text: "Thanks for contacting me, I will get back to you in the next 24hours.",
      html: `You can contact also me on <a href="www.linkedin.com/in/abdulqudus-ismail">Linkedin</a>`
    };

    await mailer.sendMail(emailOptions);
    
    const { fullname, email, subject, message } = payload;

    Contact.create({ fullname, email, subject, message }, (error, newData) => {
	
      if (error) return res.json({
        type: "error",
        message: "Create Error! unable to save post data"
      });

      else return res.status(201).json({
        type: "success",
        message: "Thanks for contacting me. A confirmation mail has been sent to you.",
      })

    })

  } catch (error) {
    
    res.json({ type: "error", message: error.message })
    console.log(error.message)
    // "Oops! Some error just occured! Please try again."

  }

})


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
