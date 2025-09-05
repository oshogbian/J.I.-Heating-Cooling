import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { table, record } = await req.json();

    // Get email configuration from environment
    const companyEmail =
      Deno.env.get("COMPANY_EMAIL") || "sam@jiheatingandcooling.org";
    const emailUser = Deno.env.get("EMAIL_USER");
    const emailPassword = Deno.env.get("EMAIL_PASSWORD");
    const emailHost = Deno.env.get("EMAIL_HOST") || "smtp.gmail.com";
    const emailPort = Deno.env.get("EMAIL_PORT") || "587";

    if (!emailUser || !emailPassword) {
      console.error("Email configuration missing");
      return new Response(
        JSON.stringify({ error: "Email configuration missing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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
          phone: record.phone || "Not provided",
          address: record.address || "Not provided",
          message: record.message || "",
        };
        subject = "New Contact Form Submission - J.I. Heating and Cooling";
        html = formatContactEmail(emailData);
        text = formatContactEmailText(emailData);
        break;

      case "service_requests":
        emailData = {
          name: record.name,
          email: record.email,
          phone: record.phone || "Not provided",
          address: record.address || "Not provided",
          serviceType: record.service_type || "Not specified",
          preferredDate: record.preferred_date || "Not specified",
          description: record.description || "",
        };
        subject = "New Service Request - J.I. Heating and Cooling";
        html = formatServiceEmail(emailData);
        text = formatServiceEmailText(emailData);
        break;

      case "emergency_requests":
        emailData = {
          name: record.customer_info,
          email: record.email,
          phone: record.phone || "Not provided",
          address: record.address || "Not provided",
          issue: record.issue || "Not specified",
        };
        subject = "🚨 EMERGENCY SERVICE REQUEST - J.I. Heating and Cooling";
        html = formatEmergencyEmail(emailData);
        text = formatEmergencyEmailText(emailData);
        break;

      default:
        return new Response(JSON.stringify({ error: "Unknown table type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Send email using Resend (recommended for Supabase Edge Functions)
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `"J.I. Heating and Cooling" <${emailUser}>`,
        to: [companyEmail],
        subject: subject,
        html: html,
        text: text,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Email sending failed:", errorText);
      return new Response(
        JSON.stringify({ error: "Email sending failed", details: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent successfully for ${table}`,
        emailId: emailResult.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-form-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Email formatting functions
function formatContactEmail(data: any): string {
  const { name, email, phone, address, message } = data;

  return `
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
}

function formatContactEmailText(data: any): string {
  const { name, email, phone, address, message } = data;

  return `
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
}

function formatServiceEmail(data: any): string {
  const {
    name,
    email,
    phone,
    address,
    serviceType,
    preferredDate,
    description,
  } = data;

  return `
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
}

function formatServiceEmailText(data: any): string {
  const {
    name,
    email,
    phone,
    address,
    serviceType,
    preferredDate,
    description,
  } = data;

  return `
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
}

function formatEmergencyEmail(data: any): string {
  const { name, email, phone, address, issue } = data;

  return `
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
}

function formatEmergencyEmailText(data: any): string {
  const { name, email, phone, address, issue } = data;

  return `
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
}
