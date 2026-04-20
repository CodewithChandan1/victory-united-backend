const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // For development/testing - you can use Ethereal Email
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      console.log('⚠️  No email credentials found. Using test configuration.');
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
      return;
    }

    // Gmail configuration (you can change this to other providers)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    });

    // Alternative configuration for other SMTP providers
    // this.transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: process.env.SMTP_SECURE === 'true',
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASSWORD
    //   }
    // });
  }

  async sendEnquiryConfirmation(enquiry) {
    try {
      const mailOptions = {
        from: {
          name: 'Victory United Soccer Academy',
          address: process.env.EMAIL_USER
        },
        to: enquiry.email,
        subject: '⚽ Welcome to Victory United Soccer Academy - Enquiry Confirmation',
        html: this.generateEnquiryConfirmationHTML(enquiry),
        // Add text version for better compatibility
        text: `Dear ${enquiry.name},\n\nThank you for your interest in Victory United Soccer Academy! We have received your enquiry and our team will contact you within 24 hours.\n\nYour Details:\n- Parent/Guardian: ${enquiry.name}\n- Email: ${enquiry.email}\n- Phone: ${enquiry.phone}\n- Child's Age: ${enquiry.childAge} years\n${enquiry.message ? `- Message: ${enquiry.message}\n` : ''}\nContact us: +91 62396 87596 | victoryunited60@gmail.com\n\nBest regards,\nVictory United Soccer Academy Team`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Confirmation email sent to:', enquiry.email);
      return result;
    } catch (error) {
      console.error('❌ Failed to send confirmation email:', error);
      throw error;
    }
  }

  async sendEnquiryNotificationToAdmin(enquiry) {
    try {
      const mailOptions = {
        from: {
          name: 'Victory United Soccer Academy System',
          address: process.env.EMAIL_USER
        },
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 New Enquiry Alert: ${enquiry.name} - Victory United Soccer Academy`,
        html: this.generateAdminNotificationHTML(enquiry),
        // Add text version for better compatibility
        text: `NEW ENQUIRY ALERT\n\nParent/Guardian: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nChild's Age: ${enquiry.childAge} years\n${enquiry.message ? `Message: ${enquiry.message}\n` : ''}Submitted: ${new Date().toLocaleString('en-IN')}\n\nAction Required: Contact within 24 hours\nQuick Actions:\n- Email: ${enquiry.email}\n- Phone: ${enquiry.phone}\n\nVictory United Soccer Academy Admin System`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Admin notification email sent');
      return result;
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
      throw error;
    }
  }

  generateEnquiryConfirmationHTML(enquiry) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for your enquiry</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f4f4f4; 
        }
        .email-wrapper { 
          max-width: 650px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
        }
        .header { 
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
        }
        .logo { 
          font-size: 28px; 
          font-weight: 700; 
          margin-bottom: 8px; 
          position: relative;
          z-index: 1;
        }
        .tagline { 
          font-size: 16px; 
          opacity: 0.95; 
          font-weight: 300;
          position: relative;
          z-index: 1;
        }
        .content { 
          padding: 40px 30px; 
          background: white;
        }
        .greeting { 
          font-size: 20px; 
          color: #1e3a8a; 
          margin-bottom: 20px; 
          font-weight: 600;
        }
        .message { 
          font-size: 16px; 
          margin-bottom: 25px; 
          color: #4b5563;
        }
        .details-card { 
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0; 
          border-left: 5px solid #3b82f6;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .details-title { 
          font-size: 18px; 
          color: #1e3a8a; 
          margin-bottom: 15px; 
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .details-title::before {
          content: '📋';
          margin-right: 8px;
        }
        .detail-row { 
          display: flex; 
          margin-bottom: 10px; 
          padding: 8px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label { 
          font-weight: 600; 
          color: #374151; 
          min-width: 140px;
        }
        .detail-value { 
          color: #6b7280; 
          flex: 1;
        }
        .contact-section { 
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); 
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0;
          border: 1px solid #a7f3d0;
        }
        .contact-title { 
          font-size: 18px; 
          color: #065f46; 
          margin-bottom: 15px; 
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .contact-title::before {
          content: '📞';
          margin-right: 8px;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        .contact-item { 
          display: flex; 
          align-items: center; 
          color: #047857;
          font-weight: 500;
        }
        .contact-item::before {
          width: 20px;
          margin-right: 10px;
          text-align: center;
        }
        .phone::before { content: '📱'; }
        .email::before { content: '✉️'; }
        .location::before { content: '📍'; }
        .time::before { content: '🕐'; }
        .next-steps {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 20px;
          border-radius: 10px;
          margin: 25px 0;
          border-left: 5px solid #f59e0b;
        }
        .next-steps h3 {
          color: #92400e;
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 600;
        }
        .next-steps p {
          color: #a16207;
          font-size: 14px;
        }
        .footer { 
          background: #f8fafc; 
          padding: 25px 30px; 
          text-align: center; 
          border-top: 1px solid #e5e7eb;
        }
        .footer-logo {
          font-size: 18px;
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 8px;
        }
        .footer-text { 
          color: #6b7280; 
          font-size: 13px; 
          line-height: 1.5;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 8px;
          padding: 8px 12px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .email-wrapper { margin: 10px; border-radius: 8px; }
          .header, .content, .footer { padding: 25px 20px; }
          .contact-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="logo">Victory United Soccer Academy</div>
          <div class="tagline">Victory Through Unity • Excellence in Football Training</div>
        </div>
        
        <div class="content">
          <div class="greeting">Dear ${enquiry.name},</div>
          
          <div class="message">
            Thank you for choosing Victory United Soccer Academy! We're thrilled about your interest in our football training programs. Your enquiry has been successfully received, and our dedicated team will contact you within 24 hours to discuss the next steps.
          </div>
          
          <div class="details-card">
            <div class="details-title">Your Enquiry Summary</div>
            <div class="detail-row">
              <div class="detail-label">Parent/Guardian:</div>
              <div class="detail-value">${enquiry.name}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email Address:</div>
              <div class="detail-value">${enquiry.email}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Contact Number:</div>
              <div class="detail-value">${enquiry.phone}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Child's Age:</div>
              <div class="detail-value">${enquiry.childAge} years old</div>
            </div>
            ${enquiry.message ? `
            <div class="detail-row">
              <div class="detail-label">Your Message:</div>
              <div class="detail-value">${enquiry.message}</div>
            </div>
            ` : ''}
            <div class="detail-row">
              <div class="detail-label">Enquiry Date:</div>
              <div class="detail-value">${new Date().toLocaleDateString('en-IN', { 
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</div>
            </div>
          </div>
          
          <div class="contact-section">
            <div class="contact-title">Get In Touch With Us</div>
            <div class="contact-grid">
              <div class="contact-item phone">+91 62396 87596</div>
              <div class="contact-item email">victoryunited60@gmail.com</div>
              <div class="contact-item location">Jalandhar, Punjab, India</div>
              <div class="contact-item time">Mon-Sat: 4:00 PM - 6:00 PM</div>
            </div>
          </div>
          
          <div class="next-steps">
            <h3>What Happens Next?</h3>
            <p>Our coaching team will review your enquiry and contact you to schedule a free trial session. We'll also share detailed information about our training programs, schedules, and fee structure.</p>
          </div>
          
          <div class="message">
            We're excited about the opportunity to help your child develop their football skills, build confidence, and become part of our Victory United family. Our experienced coaches are committed to nurturing young talent and fostering a love for the beautiful game.
          </div>
          
          <div class="message" style="margin-top: 30px; font-weight: 600; color: #1e3a8a;">
            Best regards,<br>
            The Victory United Soccer Academy Team
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-logo">Victory United Soccer Academy</div>
          <div class="social-links">
            <a href="https://wa.me/916239687596">WhatsApp</a>
            <a href="tel:+916239687596">Call Us</a>
            <a href="mailto:victoryunited60@gmail.com">Email</a>
          </div>
          <div class="footer-text">
            Jalandhar, Punjab, India<br>
            This is an automated confirmation email. Please do not reply directly to this message.<br>
            For any queries, please contact us using the information provided above.
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  generateAdminNotificationHTML(enquiry) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Enquiry Alert</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f4f4f4; 
        }
        .email-wrapper { 
          max-width: 650px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
        }
        .header { 
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
        }
        .alert-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .header-title { 
          font-size: 24px; 
          font-weight: 700; 
          margin-bottom: 5px; 
          position: relative;
          z-index: 1;
        }
        .header-subtitle { 
          font-size: 14px; 
          opacity: 0.9; 
          position: relative;
          z-index: 1;
        }
        .content { 
          padding: 30px; 
          background: white;
        }
        .priority-alert { 
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); 
          border: 2px solid #f59e0b;
          padding: 20px; 
          border-radius: 10px; 
          margin-bottom: 25px;
          text-align: center;
        }
        .priority-alert .icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .priority-alert .text {
          color: #92400e;
          font-weight: 600;
          font-size: 16px;
        }
        .enquiry-card { 
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
          padding: 25px; 
          border-radius: 12px; 
          margin: 25px 0; 
          border-left: 5px solid #dc2626;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        .enquiry-title { 
          font-size: 20px; 
          color: #dc2626; 
          margin-bottom: 20px; 
          font-weight: 700;
          display: flex;
          align-items: center;
        }
        .enquiry-title::before {
          content: '👤';
          margin-right: 10px;
          font-size: 24px;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .detail-item { 
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .detail-label { 
          font-size: 12px;
          font-weight: 600; 
          color: #6b7280; 
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .detail-value { 
          font-size: 16px;
          color: #1f2937; 
          font-weight: 500;
        }
        .detail-value.email {
          color: #2563eb;
        }
        .detail-value.phone {
          color: #059669;
        }
        .message-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-top: 15px;
        }
        .message-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .message-content {
          font-size: 15px;
          color: #374151;
          font-style: italic;
          line-height: 1.6;
        }
        .action-section { 
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          padding: 25px; 
          border-radius: 10px; 
          margin: 25px 0;
          border: 1px solid #a7f3d0;
        }
        .action-title {
          font-size: 18px;
          color: #065f46;
          margin-bottom: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .action-title::before {
          content: '⚡';
          margin-right: 8px;
        }
        .action-buttons { 
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .btn { 
          display: inline-flex;
          align-items: center;
          padding: 12px 20px; 
          background: #059669; 
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .btn:hover {
          background: #047857;
          transform: translateY(-1px);
        }
        .btn.secondary {
          background: #3b82f6;
        }
        .btn.secondary:hover {
          background: #2563eb;
        }
        .btn::before {
          margin-right: 8px;
          font-size: 16px;
        }
        .btn.email::before { content: '✉️'; }
        .btn.phone::before { content: '📞'; }
        .btn.whatsapp::before { content: '💬'; }
        .checklist {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .checklist-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .checklist-title::before {
          content: '📋';
          margin-right: 8px;
        }
        .checklist ul { 
          list-style: none;
          padding: 0;
        }
        .checklist li { 
          padding: 8px 0;
          color: #4b5563;
          display: flex;
          align-items: center;
        }
        .checklist li::before {
          content: '☐';
          margin-right: 10px;
          color: #9ca3af;
          font-size: 16px;
        }
        .stats-section {
          background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
          padding: 20px;
          border-radius: 10px;
          margin: 25px 0;
          border: 1px solid #d8b4fe;
        }
        .stats-title {
          font-size: 16px;
          color: #7c3aed;
          font-weight: 600;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .stats-title::before {
          content: '📊';
          margin-right: 8px;
        }
        .stats-text {
          color: #6b46c1;
          font-size: 14px;
        }
        .footer { 
          background: #f8fafc; 
          padding: 25px 30px; 
          text-align: center; 
          border-top: 1px solid #e5e7eb;
        }
        .footer-text { 
          color: #6b7280; 
          font-size: 13px; 
          line-height: 1.5;
        }
        @media (max-width: 600px) {
          .email-wrapper { margin: 10px; border-radius: 8px; }
          .content { padding: 20px; }
          .detail-grid { grid-template-columns: 1fr; }
          .action-buttons { flex-direction: column; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="alert-badge">🚨 URGENT</div>
          <div class="header-title">New Enquiry Alert</div>
          <div class="header-subtitle">Victory United Soccer Academy Admin Panel</div>
        </div>
        
        <div class="content">
          <div class="priority-alert">
            <div class="icon">⚡</div>
            <div class="text">Action Required: New enquiry needs immediate attention</div>
          </div>
          
          <div class="enquiry-card">
            <div class="enquiry-title">Enquiry Details</div>
            
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">Parent/Guardian</div>
                <div class="detail-value">${enquiry.name}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Email Address</div>
                <div class="detail-value email">${enquiry.email}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Phone Number</div>
                <div class="detail-value phone">${enquiry.phone}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Child's Age</div>
                <div class="detail-value">${enquiry.childAge} years old</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Submitted On</div>
                <div class="detail-value">${new Date().toLocaleString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Enquiry ID</div>
                <div class="detail-value">#${Date.now().toString().slice(-6)}</div>
              </div>
            </div>
            
            ${enquiry.message ? `
            <div class="message-section">
              <div class="message-label">Additional Message</div>
              <div class="message-content">"${enquiry.message}"</div>
            </div>
            ` : `
            <div class="message-section">
              <div class="message-label">Additional Message</div>
              <div class="message-content" style="color: #9ca3af;">No additional message provided</div>
            </div>
            `}
          </div>
          
          <div class="action-section">
            <div class="action-title">Quick Actions</div>
            
            <div class="action-buttons">
              <a href="mailto:${enquiry.email}?subject=Re: Your enquiry at Victory United Soccer Academy&body=Dear ${enquiry.name},%0D%0A%0D%0AThank you for your interest in Victory United Soccer Academy..." class="btn email">Reply via Email</a>
              <a href="tel:${enquiry.phone}" class="btn phone">Call Parent</a>
              <a href="https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=Hello ${enquiry.name}, thank you for your enquiry at Victory United Soccer Academy..." class="btn secondary whatsapp">WhatsApp</a>
            </div>
            
            <div class="checklist">
              <div class="checklist-title">Follow-up Checklist</div>
              <ul>
                <li>Contact parent within 24 hours</li>
                <li>Schedule a free trial session</li>
                <li>Send academy brochure and fee structure</li>
                <li>Update enquiry status in admin dashboard</li>
                <li>Add to CRM system for future follow-ups</li>
              </ul>
            </div>
          </div>
          
          <div class="stats-section">
            <div class="stats-title">Enquiry Statistics</div>
            <div class="stats-text">
              This is enquiry #${Date.now().toString().slice(-6)} received today. 
              Remember to maintain our 24-hour response commitment for the best parent experience.
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            Victory United Soccer Academy - Admin Notification System<br>
            This email was automatically generated when a new enquiry was submitted.<br>
            Please respond promptly to maintain our excellent customer service standards.
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();