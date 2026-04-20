# Email Service Setup Guide

## Gmail Configuration

The email service is configured to use Gmail with the account: `ck425789@gmail.com`

### Gmail App Password Setup

To use Gmail for sending emails, you need to set up an App Password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to [Google Account Settings](https://myaccount.google.com/)
3. Navigate to **Security** → **2-Step Verification**
4. Scroll down to **App passwords**
5. Generate a new app password for "Mail"
6. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
7. Update the `.env` file with this password:

```env
EMAIL_USER=ck425789@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

### Current Configuration

- **Email Service**: Gmail SMTP
- **User Email**: ck425789@gmail.com
- **Admin Email**: ck425789@gmail.com (receives notifications)
- **Port**: 587 (TLS)
- **Security**: OAuth2 with App Password

### Email Templates

The service includes two professional email templates:

1. **User Confirmation Email**: Sent to parents who submit enquiries
   - Professional business design with gradients and modern styling
   - Includes enquiry details, contact information, and next steps
   - Mobile-responsive design

2. **Admin Notification Email**: Sent to academy administrators
   - Urgent alert styling with action buttons
   - Quick contact links (email, phone, WhatsApp)
   - Follow-up checklist for staff

### Testing Email Functionality

You can test the email service using the API endpoint:

```bash
curl -X POST http://localhost:8080/api/enquiries/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{"email": "test@example.com"}'
```

### Troubleshooting

- **Authentication Error**: Check if App Password is correct
- **Connection Timeout**: Verify internet connection and Gmail SMTP settings
- **Emails in Spam**: Add the sender to trusted contacts
- **Rate Limiting**: Gmail has sending limits for App Passwords

### Features

✅ Professional HTML email templates  
✅ Text fallback for better compatibility  
✅ Mobile-responsive design  
✅ Automatic confirmation emails  
✅ Admin notification system  
✅ Error handling and logging  
✅ Test email functionality  

### Security Notes

- App passwords are more secure than regular passwords
- Never commit actual passwords to version control
- Use environment variables for all sensitive data
- Consider using OAuth2 for production environments