import nodemailer from "nodemailer";
import User from "../models/user.js";
import { randomUUID } from "crypto";
import { configDotenv } from "dotenv";
if (process.env.NODE_ENV != "development") {
  configDotenv();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || "example@mail.com",
    pass: process.env.MAIL_PASS || "pass@123",
  },
  secure: false,
  port: 465,
  timeout: 60000,
  tls: {
    rejectUnauthorized: false,
  },
});

async function mail({ address, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `PCS Mail 👻<${process.env.MAIL_USER || "example@mail.com"}>`,
      to: address,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
}

export const createMailSystem = async ({ address, type, _id }) => {
  const token = randomUUID();
  const DOMAIN = process.env.DOMAIN || "http://localhost:5173";
  const user = await User.findByIdAndUpdate(_id, {
    [`${type}Token`]: token, // generate a random token
    [`${type}TokenExpire`]: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  if (type === "verify") {
    const html = `<a href="${DOMAIN}/verify?TOKEN=${token}">Click here to verify your email</a>`;
    const text = `${user.username}, please click the link below to verify your email: ${DOMAIN}/verify?TOKEN=${token}`;
    const subject = "Verify your email";
    await mail({ address, subject, text, html });
  } else if (type === "reset") {
    const html = `<a href="${DOMAIN}/reset?TOKEN=${token}">Click here to reset your password</a>`;
    const text = `${user.username}, please click the link below to reset your password: ${DOMAIN}/reset?TOKEN=${token}`;
    const subject = "Reset your password";
    await mail({ address, subject, text, html });
  }
};

export const createMailSystemForUserStatus = async ({ address, pharmacyName, status }) => {

  // const DOMAIN = process.env.DOMAIN || "http://localhost:5173";

  const html = `
  <h3 style="
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: white;
    background-color: ${status === 'active' ? '#16a34a' : '#dc2626'};
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
  ">
    Your PCS Pharmacy ${pharmacyName} is ${status}!
  </h3>
`;


  const text = `Your PCS Pharmacy ${pharmacyName} is ${status}!`;
  const subject = "PCS Pharmacy Update!";


  await mail({ address, subject, text, html });
};

export const createMailSystemForVerifyPharmacyRegistration = async ({
  _id,
  address,
  pharmacyName,
}) => {
  const user = await User.findById(_id);
  if (!user) {
    throw new Error("User not found on mailing time!");
  }

  const DOMAIN = process.env.DOMAIN || "http://localhost:5173";
  const token = randomUUID();


  await User.findByIdAndUpdate(_id, {
    verifyToken: token,
    verifyTokenExpire: new Date(Date.now() + 10 * 60 * 1000),
  });

  const html = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 0;">
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="600" style="margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Verify Your Email to Complete Registration</h1>
      </td>
    </tr>
    
    <!-- Body Content -->
    <tr>
      <td style="padding: 40px;">
        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #334155;">Hi ${pharmacyName},</p>
        
        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #334155;">
          Thank you for registering with <strong style="color: #2563eb;">PCS</strong>!
          To complete your registration and activate your account, please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 32px 0 40px;">
          <a href="${DOMAIN}/verify?TOKEN=${token}" 
             style="background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 500; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); transition: all 0.3s ease;">
            Verify Email Address
          </a>
        </div>
        
        <p style="margin: 0 0 24px; font-size: 14px; color: #64748b; text-align: center; font-style: italic;">
          (This link will expire in 24 hours.)
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
          <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.5; color: #475569;">
            Verifying your email helps us ensure the security of your account and enables access to all features like managing your pharmacy profile, viewing orders, and more.
          </p>
          
          <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.5; color: #475569;">
            If you did not register with us, please ignore this email.
          </p>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 24px 40px; text-align: center; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
          Thank you,<br><strong style="color: #2563eb;">The PCS Team</strong>
        </p>
        <p style="margin: 0; font-size: 13px; color: #94a3b8;">
          ${DOMAIN} | ${process.env.MAIL_USER}
        </p>
      </td>
    </tr>
  </table>
</div>
`;
  const text = `${DOMAIN}/verify?TOKEN=${token}`;
  const subject = "Please Verify Your Email to Complete Regisration";

  // Send the email
  await mail({ address, subject, text, html });
};

export const createMailSystemToProvideRegistationInfoToPharmacist = async ({
  _id,
  address,
  pharmacy,
}) => {
  const user = await User.findById(_id); // Get the user details from the database
  if (!user) {
    throw new Error("User not found on mailing time!");
  }

  const DOMAIN = process.env.DOMAIN || "http://localhost:5173";
  const token = randomUUID(); // Generate token for verification

  // Update the user document with the generated token and expiration time
  await User.findByIdAndUpdate(_id, {
    verifyToken: token,
    verifyTokenExpire: new Date(Date.now() + 10 * 60 * 1000), // Token expires in 10 minutes
  });

  const html = `
<div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 32px; color: #1f2937;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 24px 32px; text-align: center; background-color: #0f172a; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">Your Pharmacy Registration is Successful</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="margin: 0 0 16px; font-size: 16px;">Dear ${pharmacy.owner},</p>
        <p style="margin: 0 0 16px; font-size: 16px;">
          Thank you for registering your pharmacy with us. We are pleased to inform you that your registration has been successfully completed.
        </p>
        
        <div style="margin: 24px 0; padding: 16px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="margin: 8px 0; font-size: 16px;">
            <strong style="color: #0f172a;">Registration Number:</strong> 
            <span style="color: #1f2937;">${pharmacy.registrationNumber}</span>
          </p>
          <p style="margin: 8px 0; font-size: 16px;">
            <strong style="color: #0f172a;">Pharmacy Name:</strong> 
            <span style="color: #1f2937;">${pharmacy.name}</span>
          </p>
          <p style="margin: 8px 0; font-size: 16px;">
            <strong style="color: #0f172a;">Address:</strong> 
            <span style="color: #1f2937;">${pharmacy.address}</span>
          </p>
        </div>
        
        <p style="margin: 16px 0 0; font-size: 16px;">
          Our team will review the information, and we will notify you if any additional steps are required.
        </p>
        <p style="margin: 16px 0 0; font-size: 16px;">
          If you have any questions, feel free to reach out to us.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; text-align: center; font-size: 14px; color: #9ca3af; background-color: #f3f4f6;">
        <p style="margin: 0;">Best regards,<br>The PCS Team</p>
        <p style="margin: 8px 0 0;">${DOMAIN} | ${process.env.MAIL_USER}</p>
      </td>
    </tr>
  </table>
</div>
`;
  const text = `our pharmacy registration is successful. ${pharmacy.name} is registered with us. `;
  const subject = `Your Pharmacy Registration is Successful – ${pharmacy.name}`;
  // Send the email
  await mail({ address, subject, text, html });
};

export const createMailSystemToProvideRegistationInfoToAdmin = async ({
  _id,
  address,
  pharmacy,
}) => {
  const user = await User.findById(_id); // Get the user details from the database
  if (!user) {
    throw new Error("User not found on mailing time!");
  }

  const DOMAIN = process.env.DOMAIN || "http://localhost:5173";
  const token = randomUUID(); // Generate token for verification

  // Update the user document with the generated token and expiration time
  await User.findByIdAndUpdate(_id, {
    verifyToken: token,
    verifyTokenExpire: new Date(Date.now() + 10 * 60 * 1000), // Token expires in 10 minutes
  });

  const html = `
  other stuff should be here!
`;
  const text = `${DOMAIN}/verify?TOKEN=${token}`;
  const subject = "Please Verify Your Email to Complete Regisration";

  // Send the email
  await mail({ address, subject, text, html });
};
