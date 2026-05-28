import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(express.json());

console.log("EMAIL USER:");
console.log(process.env.EMAIL_USER);

console.log("EMAIL PASS:");
console.log(process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("EMAIL ERROR:");
    console.log(error);
  } else {
    console.log("Email server is ready");
  }
});

app.listen(5000, () => {
  console.log("Server running");
});