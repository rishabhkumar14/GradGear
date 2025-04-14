const nodemailer = require("nodemailer");
const emailRecipients = require("../data/emails");


// Support Request
exports.contactUs = async (req, res) => {
  try {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: "Name, email, subject and message are required."
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
        subject: "URGENT!!! Support Request",
        html: getHtmlData(name,email,subject,message)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
        success: true,
        message: "Support request sent successfully!"
    });

  } catch (error) {

    console.error("Error sending support request email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again later."
    });
  }
};

const getHtmlData = (name, email, subject, message) => {
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
      <h2 style="color:rgb(255, 0, 0); margin-bottom: 20px;">📬 URGENT!!! </h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
        Dear <strong>GradGear Team</strong>,<br>
        Our user ${name} is trying to contact us regarding a concern. Kindly review it and mail the appropriate response in less than 24 hours to ${email}.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Subject:</strong></td>
          <td style="padding: 8px 0;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Message:</strong></td>
          <td style="padding: 8px 0;">${message}</td>
        </tr>
      </table>

      <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated message. Please do not reply directly.</p>
    </div>
  </div>
`;

    return htmlContent;
}
