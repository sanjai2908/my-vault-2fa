# 🔐 Secure File Vault – Full Stack (2FA Enabled)

A production-ready full stack application that allows users to securely upload, manage, and access personal files with **JWT authentication, TOTP-based Two-Factor Authentication (Google Authenticator), and Backup Recovery Codes**.

🌐 **Live Demo:** https://my-vault-2fa.vercel.app  
🔗 **Backend API:** https://my-vault-backend.onrender.com  

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing using bcrypt
- Two-Factor Authentication (TOTP) using Google Authenticator
- Backup recovery codes (one-time use)
- Change password with old password verification
- Protected routes with authentication middleware

### 👤 User Management
- User profile with bio and profile picture
- Update profile details
- Profile image upload (max 5MB)
- Secure access to user-owned data only

### 📁 File Management System
- Secure file upload (PDF, Word, Images, Text files)
- File metadata tracking
- List all uploaded files
- Preview files (PDFs and images)
- Download files (owner-only access)
- Delete files securely
- File size limit: 10MB
- Authorization checks on all file operations

---

## 🧠 Security Highlights (Interview Ready)
- TOTP-based 2FA without email or SMS dependency
- Backup recovery codes to prevent account lockout
- JWT token-based authorization
- Strict file ownership validation
- Environment-based secret management

---

## 🛠️ Tech Stack

### Frontend
- React
- Axios
- React Router
- Vercel (Hosting)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Multer
- Speakeasy (TOTP)
- Render (Hosting)

---

## 📁 Project Structure

my-vault-2fa/
├── client/ # React frontend
├── src/
│ ├── controllers/ # Auth, user & file logic
│ ├── models/ # Mongoose schemas
│ ├── middleware/ # JWT authentication middleware
│ ├── routes/ # API routes
│ ├── utils/ # Helper utilities (2FA, uploads)
├── server.js # Backend entry point
├── package.json
└── README.md

## ⚙️ Environment Variables (Backend)

PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d

## 📡 API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/change-password`

### Two-Factor Authentication
- POST `/api/auth/enable-authenticator`
- POST `/api/auth/verify-authenticator`
- POST `/api/auth/verify-backup-code`

### User (Protected)
- GET `/api/user/profile`
- PUT `/api/user/profile`

### File Management (Protected)
- POST `/api/files/upload`
- GET `/api/files`
- GET `/api/files/view/:id`
- GET `/api/files/download/:id`
- DELETE `/api/files/:id`

---

## 🚀 Deployment

- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Database hosted on **MongoDB Atlas**

Note: Backend may experience cold-start delays on free-tier hosting.

---

## 🎤 Interview Explanation (Short)

> I built and deployed a secure file vault using React and Node.js with JWT authentication, Google Authenticator-based TOTP 2FA, backup recovery codes, and cloud deployment using Vercel, Render, and MongoDB Atlas.

---

## ✅ Project Status
- Production Live
- Secure & Scalable
- Interview Ready
