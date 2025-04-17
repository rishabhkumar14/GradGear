const nodemailer = require("nodemailer");
const emailRecipients = require("../data/emails");


// Post a feedback
exports.suggestCategory = async (req, res) => {
  try {
    const {  type, name, description, suggestion } = req.body;

    if (!type || !name || !description) {
        return res.status(400).json({
          success: false,
          message: "Type,name and description is required."
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
        subject: "Category Suggestion Received",
        html: getHtmlDataCategory(type, name, description, suggestion)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
        success: true,
        message: "Category suggestion sent successfully!"
    });

  } catch (error) {

    console.error("Error sending category suggestion email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send category suggestion. Please try again later."
    });
  }
};

exports.suggestResource = async (req, res) => {
    try {
      const {  type, name, category, description, link, tags} = req.body;

      if (!type || !name || !description || !category) {
          return res.status(400).json({
            success: false,
            message: "Type,name,description and category is required."
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
          subject: "Resource Suggestion Received",
          html: getHtmlDataResource(type, name, category, description, link, tags)
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
          success: true,
          message: "Resource suggestion sent successfully!"
      });
  
    } catch (error) {
  
      console.error("Error sending resource suggestion email:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send resource suggestion. Please try again later."
      });
    }
  };

const getHtmlDataCategory = (type, name, description, suggestion) => {
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
    
      <p style="font-size: 16px; margin-bottom: 20px;">
        Dear <strong>GradGear Team</strong>,<br>
        We have received a category suggestion from one of our users. Kindly review it and take appropriate action.
      </p>

      <h2 style="color: #007BFF; margin-bottom: 20px;">📬 Category Suggestion Received</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;"><strong>Name:</strong></td>
          <td style="padding: 8px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Description:</strong></td>
          <td style="padding: 8px 0;">${description || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Suggestion:</strong></td>
          <td style="padding: 8px 0;">${suggestion || 'N/A'}</td>
        </tr>
      </table>

      <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated message. Please do not reply directly.</p>
    </div>
  </div>
`;

    return htmlContent;
}

const getHtmlDataResource = (type, name, category, description, link, tags) => {
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
    
      <p style="font-size: 16px; margin-bottom: 20px;">
        Dear <strong>GradGear Team</strong>,<br>
        We have received a resource suggestion from one of our users. Kindly review it and take appropriate action.
      </p>

      <h2 style="color: #007BFF; margin-bottom: 20px;">📬 Resource Suggestion Received</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;"><strong>Name:</strong></td>
          <td style="padding: 8px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Category:</strong></td>
          <td style="padding: 8px 0;">${category || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Description:</strong></td>
          <td style="padding: 8px 0;">${description || 'N/A'}</td>
        </tr>
                <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Link:</strong></td>
          <td style="padding: 8px 0;">${link || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🗂️ Tags:</strong></td>
          <td style="padding: 8px 0;">${(Array.isArray(tags) && tags.length > 0) ? tags.join(', ') : 'N/A'}</td>
        </tr>
      </table>

      <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated message. Please do not reply directly.</p>
    </div>
  </div>
`;

    return htmlContent;
}
