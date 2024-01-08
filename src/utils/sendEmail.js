import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html , attachments }) => {
  //sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 456,
    secuer: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  // reciver

  const info = await transporter.sendMail({
    from: `"Giga Acadmay" <${process.env.EMAIL} >`,
    to, // list of receivers
    subject, // Subject line
    html, // html body
    attachments
  });
};
