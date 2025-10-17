# Portfolio Contact Form Setup

This project includes a secure contact form that connects your React frontend to a Node.js/Express backend server.

## 🚀 Quick Start

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your email credentials
# Start server
npm run dev
```

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update `.env` file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Other Email Providers
Update the transporter configuration in `server/server.js`:
```javascript
const transporter = nodemailer.createTransporter({
  service: "outlook", // or "yahoo", "hotmail", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 🔒 Security Features

### Rate Limiting
- **Contact Form**: 5 submissions per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP

### Input Validation
- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format, normalized
- **Message**: 10-1000 characters, HTML escaped

### Security Headers
- Helmet.js for security headers
- CORS protection
- MongoDB injection protection
- XSS protection

## 🛠️ Development

### Running Both Servers
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

### Production Deployment
1. **Frontend**: Build and deploy to your hosting service
2. **Backend**: Deploy to Heroku, Railway, or similar
3. **Environment Variables**: Set production values in your hosting platform

## 📁 Project Structure
```
my-project/
├── src/
│   └── App.jsx          # React frontend with contact form
├── server/
│   ├── server.js        # Express server with security
│   ├── package.json     # Server dependencies
│   └── env.example      # Environment template
└── package.json         # Frontend dependencies
```

## 🔧 Customization

### Styling
The contact form uses Tailwind CSS classes. Modify the form styling in `src/App.jsx` around line 567.

### Email Template
Customize the HTML email template in `server/server.js` around line 95.

### Validation Rules
Modify validation rules in `server/server.js` around line 60.

## 🐛 Troubleshooting

### Common Issues

1. **"Too many requests" error**
   - Wait 15 minutes or restart server to reset rate limits

2. **Email not sending**
   - Check Gmail App Password is correct
   - Verify 2FA is enabled
   - Check server logs for detailed error messages

3. **CORS errors**
   - Ensure frontend URL matches `FRONTEND_URL` in `.env`
   - Check server is running on correct port

4. **Form not submitting**
   - Check browser console for errors
   - Verify server is running on port 5000
   - Check network tab for failed requests

### Debug Mode
Add this to your server for detailed logging:
```javascript
console.log('Form data received:', req.body);
```

## 📝 API Endpoints

### POST /contact
Submit contact form data.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to work with you!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully."
}
```

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use App Passwords for email**
3. **Enable HTTPS in production**
4. **Regularly update dependencies**
5. **Monitor rate limit logs**

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review server logs
3. Verify environment variables
4. Test email configuration separately

---

**Happy coding! 🚀**
