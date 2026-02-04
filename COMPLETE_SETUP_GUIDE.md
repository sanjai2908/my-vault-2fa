# Complete Setup & Running Guide

## 📋 Overview

This guide covers setting up and running both the backend and frontend of the File Vault application.

**Total Setup Time:** ~5-10 minutes

## 🖥️ Backend Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- Email account (Gmail or other SMTP)

### Step 1: Configure Environment

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/myapp
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourapp.com
```

### Step 2: Start Backend

```bash
cd 'd:\My Vault'
npm run dev
```

Expected output:

```
Server is running on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

✅ **Backend is ready!**

---

## ⚛️ Frontend Setup

### Prerequisites

- Node.js (v14+)
- Backend running on http://localhost:5000

### Step 1: Install Dependencies

```bash
cd 'd:\My Vault\client'
npm install
```

### Step 2: Start Frontend

```bash
npm start
```

This will:

- Start development server on `http://localhost:3000`
- Open browser automatically
- Enable hot-reload

Expected output:

```
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
```

✅ **Frontend is ready!**

---

## 🧪 Testing the Application

### 1. Register New Account

1. Open `http://localhost:3000` in browser
2. Click "Register"
3. Fill in:
   - Name: "John Doe"
   - Email: "john@test.com"
   - Password: "password123"
   - Confirm: "password123"
4. Click "Register"
5. Automatically logged in and redirected to dashboard

### 2. Login

1. Click "Logout"
2. You're redirected to login page
3. Enter credentials:
   - Email: "john@test.com"
   - Password: "password123"
4. Click "Login"
5. Back on dashboard

### 3. Update Profile

1. On Dashboard, in Profile tab
2. Click "Edit"
3. Change name or bio
4. Upload profile image (optional)
5. Click "Save Changes"
6. Success message appears

### 4. Upload Files

1. Click "My Files" in sidebar or go to `/files`
2. Click upload area or browse files
3. Select a PDF, Word document, or image
4. File uploads automatically
5. File appears in list

### 5. Download Files

1. In file list, click "Download" button
2. File downloads to your computer
3. Check your Downloads folder

### 6. Delete Files

1. In file list, click "Delete"
2. Confirm deletion
3. File removed from list

### 7. Change Password

1. Dashboard → Change Password tab
2. Enter:
   - Old Password: "password123"
   - New Password: "newpassword123"
   - Confirm: "newpassword123"
3. Click "Update Password"

### 8. Forgot Password

1. From login page, click "Forgot Password?"
2. Enter your email
3. Check your email for OTP (in terminal if using test mail)
4. Enter OTP and new password
5. Password reset complete
6. Login with new password

---

## 🚀 Running Both Simultaneously

### Terminal 1: Backend

```bash
cd 'd:\My Vault'
npm run dev
```

### Terminal 2: Frontend

```bash
cd 'd:\My Vault\client'
npm start
```

Both will run simultaneously on different ports:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## 📱 Testing on Different Devices

### Same Computer, Different Browser

- Backend: Running on 5000
- Frontend: Running on 3000
- Access: `http://localhost:3000`

### Different Computer on Same Network

- Update backend URL in `client/src/context/AuthContext.js`:
  ```javascript
  axios.defaults.baseURL = "http://YOUR_IP:5000/api";
  ```
- Start backend with:
  ```bash
  npm run dev -- --host 0.0.0.0
  ```
- Access frontend: `http://YOUR_IP:3000`

---

## 🛑 Stopping the Application

### Stop Backend

Press `Ctrl + C` in backend terminal

### Stop Frontend

Press `Ctrl + C` in frontend terminal

---

## 🐛 Common Issues & Solutions

### Backend Issues

**Error: MongoDB connection refused**

```
Solution:
1. Start MongoDB: mongod
2. Check MONGODB_URI in .env
3. For Atlas: verify IP whitelist
```

**Error: Port 5000 already in use**

```
Solution:
1. Change PORT in .env to 3001 or 8000
2. Or kill process: lsof -ti:5000 | xargs kill -9
```

**Error: Email not sending**

```
Solution:
1. For Gmail: use App Password, not regular password
2. Check EMAIL_* values in .env
3. Test with Mailtrap or SendGrid
```

### Frontend Issues

**Error: Cannot find module 'axios'**

```
Solution:
cd client
npm install axios react-router-dom react-hook-form
```

**Error: Blank white page**

```
Solution:
1. Check browser console for errors
2. Ensure backend is running
3. Check axios.defaults.baseURL
4. Clear browser cache: Ctrl+Shift+R
```

**Error: CORS errors**

```
Solution:
1. Backend already has CORS enabled
2. Ensure backend baseURL is correct
3. Check browser console for exact error
```

**Error: Can't login**

```
Solution:
1. Check backend is running
2. Verify user exists in MongoDB
3. Check password is correct
4. See backend console for errors
```

---

## 🔍 Debugging Tips

### Backend Logs

```bash
# In backend terminal, you'll see:
- POST /api/auth/login 200
- GET /api/user/profile 200
- POST /api/files/upload 201
```

### Frontend DevTools

```
Open: F12 or Right-click → Inspect
Tabs:
- Console: JavaScript errors
- Network: API calls
- Application: localStorage, cookies
```

### MongoDB Inspection

```bash
# Connect to MongoDB
mongosh "your-connection-string"

# View users
use myapp
db.users.find().pretty()

# View files
db.files.find().pretty()
```

---

## 📊 Verification Checklist

Before deploying, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Profile page loads
- [ ] Can edit profile
- [ ] Can upload files
- [ ] Can download files
- [ ] Can delete files
- [ ] Can change password
- [ ] Forgot password sends OTP
- [ ] Reset password works
- [ ] Can logout
- [ ] Protected routes work

---

## 📦 Production Deployment

When ready to deploy:

### Backend

1. Change NODE_ENV=production
2. Use strong JWT_SECRET
3. Use MongoDB Atlas
4. Configure SendGrid/AWS SES for email
5. Deploy to: Heroku, Render, Railway, AWS
6. Update FRONTEND_URL for CORS

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```
2. Update API endpoint:
   ```javascript
   axios.defaults.baseURL = "https://your-api.com/api";
   ```
3. Deploy to: Vercel, Netlify, GitHub Pages

---

## 📞 Support

If you encounter issues:

1. Check error messages in console
2. Review logs in backend terminal
3. Check browser DevTools (F12)
4. See QUICK_START.md for additional help
5. Check API_DOCUMENTATION.md for API details

---

## ✅ You're All Set!

Both backend and frontend are ready to use!

**Frontend:** http://localhost:3000
**Backend API:** http://localhost:5000/api

Happy coding! 🎉
