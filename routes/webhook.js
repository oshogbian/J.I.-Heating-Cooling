const express = require("express");
const router = express.Router();
const {
  sendEmail,
  formatContactEmail,
  formatServiceEmail,
  formatEmergencyEmail,
} = require("../utils/emailService");

// Webhook endpoint to handle Supabase database changes
router.post("/email", async (req, res) => {
  try {
    console.log("Email webhook received:", {
      action: req.body.action,
      table: req.body.table,
      record: req.body.record,
    });

    const { action, table, record } = req.body;

    // Only process INSERT operations
    if (action !== "INSERT") {
      console.log("Ignoring non-INSERT operation:", action);
      return res.json({
        success: true,
        message: "Ignored non-INSERT operation",
      });
    }

    let emailResult = null;

    // Handle different table types
    switch (table) {
      case "contacts":
        console.log("Processing contact form submission");
        const { html, text } = formatContactEmail({
          name: record.name,
          email: record.email,
          phone: record.phone || "Not provided",
          address: record.address || "Not provided",
          message: record.message || "",
        });

        emailResult = await sendEmail({
          to: process.env.COMPANY_EMAIL,
          subject: "New Contact Form Submission - J.I. Heating and Cooling",
          html,
          text,
        });
        break;

      case "service_requests":
        console.log("Processing service request submission");
        const serviceEmail = formatServiceEmail({
          name: record.name,
          email: record.email,
          phone: record.phone || "Not provided",
          address: record.address || "Not provided",
          serviceType: record.service_type || "Not specified",
          preferredDate: record.preferred_date || "Not specified",
          description: record.description || "",
        });

        emailResult = await sendEmail({
          to: process.env.COMPANY_EMAIL,
          subject: "New Service Request - J.I. Heating and Cooling",
          html: serviceEmail.html,
          text: serviceEmail.text,
        });
        break;

      case "emergency_requests":
        console.log("Processing emergency request submission");
        const emergencyEmail = formatEmergencyEmail({
          name: record.customer_info,
          email: record.email,
          phone: record.phone || "Not provided",
          address: record.address || "Not provided",
          issue: record.issue || "Not specified",
        });

        emailResult = await sendEmail({
          to: process.env.COMPANY_EMAIL,
          subject: "🚨 EMERGENCY SERVICE REQUEST - J.I. Heating and Cooling",
          html: emergencyEmail.html,
          text: emergencyEmail.text,
        });
        break;

      default:
        console.log("Unknown table type:", table);
        return res.json({ success: true, message: "Unknown table type" });
    }

    if (emailResult && emailResult.success) {
      console.log("Email sent successfully for", table);
      res.json({
        success: true,
        message: `Email sent successfully for ${table}`,
        messageId: emailResult.messageId,
      });
    } else {
      console.warn("Email failed to send for", table, emailResult?.error);
      res.json({
        success: false,
        message: `Email failed to send for ${table}`,
        error: emailResult?.error,
      });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      success: false,
      error: "Webhook processing failed",
      details: error.message,
    });
  }
});

// Fallback route for old webhook format
router.post("/", async (req, res) => {
  try {
    console.log("Legacy webhook received:", {
      type: req.body.type,
      table: req.body.table,
      record: req.body.record,
    });

    const { type, table, record } = req.body;

    // Only process INSERT operations
    if (type !== "INSERT") {
      console.log("Ignoring non-INSERT operation:", type);
      return res.json({
        success: true,
        message: "Ignored non-INSERT operation",
      });
    }

    // Redirect to the new email webhook format
    req.body.action = type;
    return router.handle({ ...req, url: "/email", method: "POST" }, res);
  } catch (error) {
    console.error("Legacy webhook processing error:", error);
    res.status(500).json({
      success: false,
      error: "Legacy webhook processing failed",
      details: error.message,
    });
  }
});

module.exports = router;
