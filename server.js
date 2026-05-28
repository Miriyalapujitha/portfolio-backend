import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";


dotenv.config();

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
// MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ----------------------
// Schema + Model
// ----------------------
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

// ----------------------
// Email Transporter
// ----------------------


// ----------------------
// TEST EMAIL CONNECTION
// ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  family: 4,
});
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});
// ----------------------
// CONTACT ROUTE
// ----------------------
app.post("/contact", async (req, res) => {
  try {
    console.log("Request received:");
    console.log(req.body);

    const { name, email, subject, message } = req.body;

    // Save to MongoDB
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    console.log("Saved to MongoDB");

    // Send Email
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,

        subject: `New Portfolio Message from ${name}`,

        text: `
Name: ${name}

Email: ${email}

Subject: ${subject}

Message:
${message}
        `,
      });

      console.log("EMAIL SENT SUCCESSFULLY");
      console.log(info.response);

    } catch (emailError) {
  console.log("EMAIL SEND ERROR:");
  console.log(emailError);

  return res.status(500).json({
    success: false,
    message: "Email failed",
  });
}

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (err) {
    console.log("FULL ERROR:");
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});