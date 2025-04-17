const nodemailer = require("nodemailer");
const emailRecipients = require("../data/emails");


// Post a feedback
exports.shareFeedback = async (req, res) => {
  try {
    const { rating, feedbackType, feedbackText } = req.body;

    if (!rating || !feedbackType) {
        return res.status(400).json({
          success: false,
          message: "Ratings and Type of Feedback is required."
        });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT == "465", // true if using port 465
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"GradGearAdmin" <${process.env.ADMIN_EMAIL}>`,
        to: emailRecipients.join(","), // send to multiple recipients
        subject: "New Feedback Received",
        html: getHtmlData(rating, feedbackType, feedbackText)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
        success: true,
        message: "Feedback sent successfully!"
    });

  } catch (error) {

    console.error("Error sending feedback email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send feedback. Please try again later."
    });
  }
};

const getHtmlData = (rating, feedbackType, feedbackText) => {
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
    
      <p style="font-size: 16px; margin-bottom: 20px;">
        Dear <strong>GradGear Team</strong>,<br>
        We have received a feedback from one of our users. Kindly review it and take appropriate action.
      </p>

      <h2 style="color: #007BFF; margin-bottom: 20px;">📬 New Feedback Received</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;"><strong>⭐ Rating:</strong></td>
          <td style="padding: 8px 0;">${rating}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Type of Feedback:</strong></td>
          <td style="padding: 8px 0;">${feedbackType || 'N/A'}</td>
        </tr>
        ${feedbackText ? `
        <tr>
          <td style="padding: 8px 0; vertical-align: top;"><strong>📝 Feedback Message:</strong></td>
          <td style="padding: 8px 0;">${feedbackText}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated message. Please do not reply directly.</p>
    </div>
  </div>
`;

    return htmlContent;
}
