const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const createTransporter = async () => {
  const emailUser = process.env.EMAIL_USER;
  const emailDomain = emailUser.split("@")[1];

  let config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  // Auto-detect common email providers
  if (!process.env.EMAIL_HOST || process.env.EMAIL_HOST === "auto") {
    if (emailDomain === "gmail.com") {
      config.host = "smtp.gmail.com";
      config.port = 587;
    } else if (emailDomain === "outlook.com" || emailDomain === "hotmail.com") {
      config.host = "smtp.office365.com";
      config.port = 587;
    } else if (emailDomain === "yahoo.com") {
      config.host = "smtp.mail.yahoo.com";
      config.port = 587;
    } else {
      config.host = `mail.${emailDomain}`;
      config.port = 587;
    }
  }

  config.secure = config.port === 465;

  console.log(
    `Setting up email with host: ${config.host}, port: ${config.port}`
  );

  const transporter = nodemailer.createTransporter(config);

  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully");
  } catch (error) {
    console.warn("SMTP verification failed:", error.message);
  }

  return transporter;
};

// Email formatting functions
const formatContactEmail = (data) => {
  const {
    name,
    email,
    phone = "Not provided",
    address = "Not provided",
    message = "",
  } = data;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a5276;">New Contact Form Submission</h2>
      <p>You have received a new contact request from your website.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
      </div>
      
      <p style="color: #7f8c8d; font-size: 12px;">
        This is an automated email from your website. Please do not reply to this message.
      </p>
    </div>
  `;

  const text = `
    New Contact Form Submission
    
    You have received a new contact request from your website.
    
    Customer Information:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone}
    - Address: ${address}
    ${message ? `- Message: ${message}` : ""}
    
    This is an automated email from your website.
  `;

  return { html, text };
};

const formatServiceEmail = (data) => {
  const {
    name,
    email,
    phone = "Not provided",
    address = "Not provided",
    serviceType = "Not specified",
    preferredDate = "Not specified",
    description = "",
  } = data;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a5276;">New Service Request</h2>
      <p>You have received a new service request from your website.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>
      
      <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Service Details</h3>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        ${
          description
            ? `<p><strong>Description:</strong> ${description}</p>`
            : ""
        }
      </div>
      
      <p style="color: #7f8c8d; font-size: 12px;">
        This is an automated email from your website. Please do not reply to this message.
      </p>
    </div>
  `;

  const text = `
    New Service Request
    
    You have received a new service request from your website.
    
    Customer Information:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone}
    - Address: ${address}
    
    Service Details:
    - Service Type: ${serviceType}
    - Preferred Date: ${preferredDate}
    ${description ? `- Description: ${description}` : ""}
    
    This is an automated email from your website.
  `;

  return { html, text };
};

const formatEmergencyEmail = (data) => {
  const {
    name,
    email,
    phone = "Not provided",
    address = "Not provided",
    issue = "Not specified",
  } = data;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #c0392b;">⚠️ EMERGENCY SERVICE REQUEST ⚠️</h2>
      <p>You have received an <strong>emergency service request</strong> from your website.</p>
      
      <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e74c3c;">
        <h3 style="margin-top: 0; color: #c0392b;">Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>
      
      <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e74c3c;">
        <h3 style="margin-top: 0; color: #c0392b;">Emergency Details</h3>
        <p><strong>Issue:</strong> ${issue}</p>
      </div>
      
      <p style="color: #7f8c8d; font-size: 12px;">
        This is an automated email from your website. Please do not reply to this message.
      </p>
    </div>
  `;

  const text = `
    ⚠️ EMERGENCY SERVICE REQUEST ⚠️
    
    You have received an EMERGENCY service request from your website.
    
    Customer Information:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone}
    - Address: ${address}
    
    Emergency Details:
    - Issue: ${issue}
    
    This is an automated email from your website.
  `;

  return { html, text };
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"J.I. Heating and Cooling" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Webhook endpoint
app.post("/webhook/email", async (req, res) => {
  try {
    const { table, action, record } = req.body;

    console.log(`Received webhook for table: ${table}, action: ${action}`);

    if (action !== "INSERT") {
      return res.json({ message: "Only INSERT actions are processed" });
    }

    const companyEmail =
      process.env.COMPANY_EMAIL || "sam@jiheatingandcooling.org";
    let emailData = null;
    let subject = "";
    let html = "";
    let text = "";

    // Format email based on table type
    switch (table) {
      case "contacts":
        emailData = {
          name: record.name,
          email: record.email,
          phone: record.phone,
          address: record.address,
          message: record.message,
        };
        subject = "New Contact Form Submission - J.I. Heating and Cooling";
        const contactEmail = formatContactEmail(emailData);
        html = contactEmail.html;
        text = contactEmail.text;
        break;

      case "service_requests":
        emailData = {
          name: record.name,
          email: record.email,
          phone: record.phone,
          address: record.address,
          serviceType: record.service_type,
          preferredDate: record.preferred_date,
          description: record.description,
        };
        subject = "New Service Request - J.I. Heating and Cooling";
        const serviceEmail = formatServiceEmail(emailData);
        html = serviceEmail.html;
        text = serviceEmail.text;
        break;

      case "emergency_requests":
        emailData = {
          name: record.customer_info,
          email: record.email,
          phone: record.phone,
          address: record.address,
          issue: record.issue,
        };
        subject = "🚨 EMERGENCY SERVICE REQUEST - J.I. Heating and Cooling";
        const emergencyEmail = formatEmergencyEmail(emailData);
        html = emergencyEmail.html;
        text = emergencyEmail.text;
        break;

      default:
        return res.status(400).json({ error: "Unknown table type" });
    }

    // Send email
    const emailResult = await sendEmail({
      to: companyEmail,
      subject: subject,
      html: html,
      text: text,
    });

    if (emailResult.success) {
      console.log(`Email sent successfully for ${table} form submission`);
      res.json({
        success: true,
        message: `Email sent successfully for ${table}`,
        messageId: emailResult.messageId,
      });
    } else {
      console.error(`Email failed to send for ${table}:`, emailResult.error);
      res.status(500).json({
        success: false,
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Webhook service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/email`);
});
