# Quick Start Guide 🚀

Follow these steps to get your backend up and running in minutes!

## Step 1: Install MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended for beginners)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Use this in your `.env` file

### Option B: Local MongoDB

```bash
# Windows (with chocolatey)
choco install mongodb

# Or download from mongodb.com/try/download/community
```

## Step 2: Configure Email

### For Gmail:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (enable it)
3. Security → App passwords
4. Generate password for "Mail"
5. Use this password in `.env` as `EMAIL_PASSWORD`

### For Other Providers:

- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **SendGrid**: smtp.sendgrid.net:587

## Step 3: Environment Setup

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development

# Your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp

# Generate a random secret (or use any long random string)
JWT_SECRET=my-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Your email credentials
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourapp.com
```

## Step 4: Start the Server

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

You should see:

```
Server is running on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

## Step 5: Test the API

### Option 1: Using curl

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

### Option 2: Using Postman

1. Import `My_Vault_API.postman_collection.json`
2. Test "Register User"
3. Copy the token from response
4. Set token in Postman environment variable

### Option 3: Using Browser

1. Install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension
2. Create a `.http` file with requests
3. Click "Send Request"

## Step 6: Test File Upload

1. Login to get token
2. Use Postman or curl with multipart/form-data:

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

## Common Issues & Solutions

### ❌ "MongooseServerSelectionError"

**Solution**: Check your MongoDB connection string in `.env`

### ❌ "Error sending email"

**Solution**:

- Verify email credentials
- For Gmail, use App Password (not regular password)
- Check firewall/antivirus blocking port 587

### ❌ "Port 5000 already in use"

**Solution**:

- Change PORT in `.env` to 3000 or 8000
- Or kill process using port 5000

### ❌ "CORS error from frontend"

**Solution**: Already handled! CORS is enabled in `server.js`

## Next Steps

✅ Backend is ready!

Now you can:

1. Build React frontend (see main README)
2. Test all API endpoints
3. Deploy to production (Heroku, Render, Railway)

## Testing Checklist

- [ ] Register a new user
- [ ] Login with credentials
- [ ] Get user profile
- [ ] Update profile with image
- [ ] Upload a PDF file
- [ ] List all files
- [ ] Download a file
- [ ] Delete a file
- [ ] Request password reset OTP
- [ ] Reset password with OTP
- [ ] Change password

## Production Deployment Tips

1. **Environment Variables**: Never commit `.env` to Git
2. **MongoDB**: Use MongoDB Atlas for production
3. **JWT Secret**: Use strong random string
4. **File Storage**: Consider AWS S3 for production
5. **Email**: Use SendGrid or AWS SES for reliable delivery
6. **HTTPS**: Always use HTTPS in production

## Need Help?

- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoint details
- See [README.md](README.md) for complete overview
- Test with Postman collection provided

---

**Happy Coding! 🎉**
