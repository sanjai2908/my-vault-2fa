# Test Your Setup

Quick tests to verify everything is working correctly.

## ✅ Pre-flight Checks

### 1. Check Dependencies

```bash
npm list --depth=0
```

Expected output should show:

- express
- mongoose
- bcrypt
- jsonwebtoken
- dotenv
- cors
- multer
- nodemailer
- nodemon (dev)

### 2. Check .env File

Make sure you have configured:

```bash
# Check if .env exists
ls -la .env

# or on Windows
dir .env
```

Required variables:

- MONGODB_URI
- JWT_SECRET
- EMAIL\_\* credentials

### 3. Start Server Test

```bash
npm run dev
```

Expected console output:

```
Server is running on port 5000
MongoDB Connected: <your-mongodb-host>
```

If you see both messages, you're good to go! ✅

## 🧪 API Health Checks

### Test 1: Server Running

```bash
curl http://localhost:5000/
```

Expected response:

```json
{ "message": "API is running..." }
```

### Test 2: Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

Expected response (success):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@test.com",
    "role": "user"
  }
}
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

### Test 4: Get Profile (Protected Route)

First, save the token from login response, then:

```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@test.com",
    ...
  }
}
```

## 🔍 Troubleshooting

### Issue: MongoDB Connection Failed

```
Error: getaddrinfo ENOTFOUND...
```

**Solutions:**

1. Check MongoDB is running (local) or connection string is correct (Atlas)
2. Verify MONGODB_URI in .env
3. For Atlas: Check IP whitelist (0.0.0.0/0 for development)
4. Test connection:
   ```bash
   mongosh "YOUR_MONGODB_URI"
   ```

### Issue: Email Not Sending

```
Error sending email. Please try again later.
```

**Solutions:**

1. For Gmail: Use App Password, not regular password
2. Enable "Less secure app access" (not recommended) OR use App Password
3. Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD in .env
4. Test with a different email service (SendGrid, Mailtrap)
5. Check firewall/antivirus blocking port 587

### Issue: JWT Token Invalid

```
Not authorized to access this route
```

**Solutions:**

1. Check JWT_SECRET is set in .env
2. Verify token is included in header: `Authorization: Bearer <token>`
3. Token might be expired (check JWT_EXPIRE in .env)
4. Clear old tokens and login again

### Issue: File Upload Failed

```
ENOENT: no such file or directory
```

**Solutions:**

1. uploads/profiles and uploads/files directories will be created automatically
2. Check file size (max 5MB for images, 10MB for documents)
3. Verify file type is allowed
4. Check disk space

### Issue: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env to 3000 or 8000
```

## 📊 Database Checks

### View Users in MongoDB

```bash
mongosh "YOUR_MONGODB_URI"
use myapp
db.users.find().pretty()
```

### View Files in MongoDB

```bash
db.files.find().pretty()
```

### Clear Test Data

```bash
# Delete all users
db.users.deleteMany({})

# Delete all files
db.files.deleteMany({})
```

## 🎯 Production Readiness Checklist

Before deploying to production:

- [ ] Changed JWT_SECRET to strong random string (64+ characters)
- [ ] Set NODE_ENV=production
- [ ] Using MongoDB Atlas (not local MongoDB)
- [ ] Using production email service (SendGrid, AWS SES)
- [ ] Configured proper CORS origins
- [ ] HTTPS enabled
- [ ] Environment variables secured (not in Git)
- [ ] File upload limits configured appropriately
- [ ] Error handling tested
- [ ] All API endpoints tested
- [ ] Documentation updated with production URLs

## 🚦 All Systems Go!

If all tests pass:
✅ Server running
✅ Database connected
✅ Registration working
✅ Login working
✅ Protected routes working
✅ File upload working

**Your backend is fully operational! 🎉**

You can now:

1. Start building the frontend
2. Connect your React app
3. Or use this backend with mobile apps
4. Deploy to production

## 📝 Quick Reference

- **Start Development**: `npm run dev`
- **Start Production**: `npm start`
- **View Logs**: Check console output
- **Test APIs**: Use Postman collection or curl commands
- **Documentation**: See README.md and API_DOCUMENTATION.md

---

Need help? Check:

- [README.md](README.md) - Overview
- [QUICK_START.md](QUICK_START.md) - Setup guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API details
- [BACKEND_SUMMARY.md](BACKEND_SUMMARY.md) - What's implemented
