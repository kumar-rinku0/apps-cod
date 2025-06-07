import { configDotenv } from "dotenv";
if (process.env.NODE_ENV != "development") {
  configDotenv();
}
import nodemailer from "nodemailer";
import User from "../model/user.js";
import { randomUUID } from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  port: 465, // use the appropriate port
  timeout: 60000, // 60s
  tls: {
    rejectUnauthorized: false,
  },
});

// async..await is not allowed in global scope, must use a wrapperaddress
async function mail({ address, subject, text, html }) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "Contact Form <spk612000@gmail.com>", // sender address
    to: address, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
  console.log("Message sent: %s", info.messageId);
}

export const createMailSystem = async ({ address, type, _id }) => {
  const DOMAIN = process.env.DOMAIN || "http://localhost:5173";
  if (type === "password") {
    const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 0; max-width: 600px; margin: auto;">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h2 style="font-size: 24px; font-weight: 700; color: white; margin: 0;">Welcome to Attendance management system</h2>
        <p style="color: #e0e7ff; font-size: 16px; margin: 8px 0 0;">Your attendance system account has been successfully created.</p>
      </div>
      
      <div style="background-color: #ffffff; border-radius: 0 0 12px 12px; padding: 32px; border: 1px solid #e2e8f0; border-top: none; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
        <p style="font-size: 16px; color: #374151; margin-bottom: 16px; line-height: 1.5;">Here are your account details:</p>
        
        <div style="margin-bottom: 24px;">
          <p style="font-size: 14px; color: #64748b; margin-bottom: 6px;">Your  password:</p>
          <div style="background-color: #f1f5f9; border-radius: 6px; padding: 14px 16px; font-size: 18px; font-weight: 600; color: #1e293b; letter-spacing: 0.5px; border-left: 4px solid #4f46e5;">
            ${_id}
          </div>
        </div>
        
        
        <div style="margin-top: 32px; text-align: center;">
          <a href="${DOMAIN}/login" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 15px;">Login to Your Account</a>
        </div>
      </div>
      
      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px; text-align: center; line-height: 1.5;">
        If you didn't request this account, please ignore this email or contact support.
      </p>
    </div>
    `;
    
    const text = `Your attendance system account has been created.\nYour password: ${_id}\nPlease change it after login.`;
    const subject = "Your Account Has Been Created - AttendMate";
    
    return await mail({ address, subject, text, html });
    
  }

  const token = randomUUID();
  // const DOMAIN = process.env.DOMAIN || "http://localhost:5173";
  const user = await User.findByIdAndUpdate(_id, {
    [`${type}Token`]: token, // generate a random token
    [`${type}TokenExpire`]: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });
  if (type === "verify") {
    const html = `<a href="${DOMAIN}/verify?TOKEN=${token}">Click here to verify your email</a>`;
    const text = `${user.firstName}, please click the link below to verify your email: ${DOMAIN}/verify?TOKEN=${token}`;
    const subject = "Verify your email";
    await mail({ address, subject, text, html });
  } else if (type === "reset") {
    const html = `<a href="${DOMAIN}/reset?TOKEN=${token}">Click here to reset your password</a>`;
    const text = `${user.firstName}, please click the link below to reset your password: ${DOMAIN}/reset?TOKEN=${token}`;
    const subject = "Reset your password";
    await mail({ address, subject, text, html });
  }
};


export const sendContactEmail = async (formData) => {
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Mobile:</strong> ${formData.mobile}</p>
    <p><strong>Company Code:</strong> ${formData.companyCode}</p>
    <p><strong>Comments:</strong> ${formData.comments}</p>
  `;

  const text = `
    New Contact Form Submission\n
    Name: ${formData.name}\n
    Mobile: ${formData.mobile}\n
    Company Code: ${formData.companyCode}\n
    Comments: ${formData.comments}
  `;

  const subject = "New Contact Form Submission";


  await mail({
    address: process.env.MAIL_USER,
    subject,
    text,
    html
  });


};