/**
 * Email Configuration & Transport
 * Centralized email handling for contact notifications
 */

import nodemailer from 'nodemailer';

// ============================================
// EMAIL TRANSPORTER SETUP
// ============================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email notification when contact form is submitted
 * @param {string} senderName - Name from contact form
 * @param {string} senderEmail - Email from contact form
 * @param {string} message - Message content
 * @returns {Promise<boolean>} - True if sent, false if failed
 */
async function sendContactNotification(senderName, senderEmail, message) {
  // If credentials not set, skip email
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⏭️  Email skipped (not configured)');
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `📧 New Contact Form Submission from ${senderName}`,
      text: `
Name: ${senderName}
Email: ${senderEmail}
Message: ${message}
      `,
      html: `
        <h3>📧 New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent at ${new Date().toISOString()}</small></p>
      `,
      replyTo: senderEmail, // Allow replies to go to sender
    });
    console.log(`✅ Email sent to ${process.env.EMAIL_USER}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  Email notification failed: ${error.message}`);
    return false;
  }
}

export { transporter, sendContactNotification };
