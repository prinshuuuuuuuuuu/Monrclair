const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
  port: process.env.EMAIL_PORT || 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderUpdateEmail = async (userEmail, orderId, newStatus) => {
  const statusColors = {
    processing: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  const mailOptions = {
    from: `"Monrclair Luxury" <${process.env.EMAIL_FROM || "noreply@monrclair.com"}>`,
    to: userEmail,
    subject: `Order Update: #${orderId} has been updated to ${newStatus.toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #b87333; text-align: center;">Monrclair Luxury</h2>
        <p>Dear Client,</p>
        <p>The protocols for your acquisition <strong>#${orderId}</strong> have been updated.</p>
        <div style="background: ${statusColors[newStatus] || "#000"}; color: #white; padding: 10px; text-align: center; border-radius: 5px; font-weight: bold; text-transform: uppercase;">
          Status: ${newStatus}
        </div>
        <p style="margin-top: 20px;">You can track the live status of your timepiece in your dashboard.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">This is an automated transmission. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${userEmail} for Order #${orderId}`);
  } catch (error) {
    console.error("Email Dispatch Error:", error);
  }
};

module.exports = { sendOrderUpdateEmail };
