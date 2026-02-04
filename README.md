# Node.js Express Backend - File Vault System

A complete, production-ready Node.js backend with authentication, user management, and secure file storage system.

## ✨ Features

### Authentication & Security

- ✅ JWT-based authentication with bcrypt password hashing
- ✅ User registration and login
- ✅ Forgot password with email OTP (10-minute expiry)
- ✅ Password reset functionality
- ✅ Change password (with old password verification)
- ✅ Protected routes middleware
- ✅ Role-based authorization

### User Management

- ✅ User profile with bio and profile image
- ✅ Update profile information
- ✅ Profile image upload (max 5MB, jpeg/jpg/png/gif)
- ✅ Get user profile details

### File Management System

- ✅ Secure file upload (PDF, Word, images, text files)
- ✅ File storage with metadata tracking
- ✅ List all user files
- ✅ Download files (only owner can download)
- ✅ View/preview files inline (PDFs, images)
- ✅ Delete files (only owner can delete)
- ✅ File size limit: 10MB
- ✅ Prevention of unauthorized access

### Technical Features

- ✅ **Express.js** - Fast web framework
- ✅ **MongoDB** - Database with Mongoose ODM
- ✅ **Multer** - File upload handling
- ✅ **Nodemailer** - Email functionality
- ✅ **CORS** - Cross-Origin Resource Sharing
- ✅ **dotenv** - Environment configuration

## 📁 Project Structure

````
my-vault/
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   └── multer.js           # File upload configuration
│   ├── controllers/
│   │   ├── authController.js   # Register & login
│   │   ├── passwordController.js # Forgot/reset password
│   │   ├── userController.js   # Profile & password change
│   │   └── fileController.js   # File upload/download/delete
│   ├── middleware/
│   │   └── auth.js             # JWT authentication & authorization
│   ├── models/
│  🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- Email account (Gmail or other SMTP service)

### Installation

1. Install dependencies:
```bash
npm install
````

2. Configure environment variables in `.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/myapp

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@yourapp.com
```

3. For Gmail, enable **App Passwords**:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password
   - Use that password in `EMAIL_PASSWORD`

4. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

5. Server will run on `http://localhost:5000 Install dependencies:

```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` and update with your values
   - Set your MongoDB URI
   - Add your JWT secret
   - Configure email settings

3. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourapp.com
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request OTP for password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### User Profile (Protected)

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile (with image upload)
- `PUT /api/user/change-password` - Change password

### File Management (Protected)

- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get all user files
- `GET /api/files/view/:id` - View/preview file
- `GET /api/files/download/:id` - Download file
- `DELETE /api/files/:id` - Delete file

> **See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed request/response examples**

## 🧪 Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 3. Get Profile (Use token from login)

```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Upload File

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/document.pdf"
```

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum 6 characters
   - Old password verification for changes

2. **JWT Authentication**
   - Token-based authentication
   - 7-day token expiry (configurable)
   - Protected routes

3. **File Security**
   - Users can only access their own files
   - Authorization checks on all file operations
   - File type validation
   - Size limits (5MB for images, 10MB for documents)

4. **Email OTP**
   - 6-digit OTP generation
     🎯 Next Steps (Frontend Integration)

This backend is ready for React frontend integration. Next steps include:

1. **React Setup**

   ```bash
   npx create-react-app client
   cd client
   npm install axios react-router-dom react-hook-form
   ```

2. **Create Components**
   - AuthContext for state management
   - Login/Register pages
   - Dashboard with profile management
   - File manager UI with upload/download
   - PDF viewer for file preview

3. **Configure Axios**
   ```javascript
   axios.defaults.baseURL = "http://localhost:5000/api";
   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
   ```

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using Node.js, Express, and MongoDB**

## 📦 Dependencies

### Production

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `multer` - File upload handling
- `nodemailer` - Email sending

### Development

- `nodemon` - Auto-restart during development

## 🛠️ Available Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## License

ISC
