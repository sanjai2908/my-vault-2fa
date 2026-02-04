# React Frontend - File Vault

Complete React frontend for the File Vault application.

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js      ✅ Route protection component
│   ├── context/
│   │   └── AuthContext.js         ✅ Global auth state management
│   ├── pages/
│   │   ├── Login.js               ✅ Login page
│   │   ├── Register.js            ✅ Register page
│   │   ├── ForgotPassword.js      ✅ Forgot password page
│   │   ├── ResetPassword.js       ✅ Reset password page
│   │   ├── Dashboard.js           ✅ User dashboard
│   │   └── FileManager.js         ✅ File management
│   ├── utils/                     📁 Utilities (for future use)
│   ├── App.js                     ✅ Main app with routing
│   ├── index.css                  ✅ Tailwind CSS styles
│   ├── index.js                   ✅ React entry point
│   └── package.json               ✅ Dependencies
├── tailwind.config.js             ✅ Tailwind configuration
├── postcss.config.js              ✅ PostCSS configuration
└── public/                        📁 Static files
```

## 🚀 Features Implemented

### Authentication

- ✅ Login with email and password
- ✅ User registration with validation
- ✅ Forgot password with OTP request
- ✅ Reset password with OTP verification
- ✅ JWT token management with localStorage
- ✅ Protected routes (redirect to login if not authenticated)

### User Profile

- ✅ View profile information
- ✅ Edit name and bio
- ✅ Upload profile picture
- ✅ Change password functionality
- ✅ Automatic profile image display

### File Management

- ✅ Upload files (PDF, Word, images, text)
- ✅ List all uploaded files
- ✅ Download files
- ✅ Delete files with confirmation
- ✅ File size and type display
- ✅ Formatted upload dates
- ✅ File icons by type

### UI/UX

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tailwind CSS styling
- ✅ Loading states
- ✅ Error messages
- ✅ Success notifications
- ✅ Form validation with react-hook-form
- ✅ Navigation between pages

## 📦 Dependencies

### Main

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **react-hook-form** - Form validation and management
- **tailwindcss** - CSS utility framework
- **postcss** - CSS processing
- **autoprefixer** - CSS vendor prefixes

## 🎯 Pages Overview

### Login Page (`/login`)

- Email and password login
- Form validation
- Error messages
- Links to register and forgot password

### Register Page (`/register`)

- Full name, email, password registration
- Password confirmation validation
- Password strength requirements
- Link to login page

### Forgot Password Page (`/forgot-password`)

- Email input for OTP request
- OTP sent confirmation
- Redirect to reset password page

### Reset Password Page (`/reset-password`)

- OTP input (6 digits)
- New password entry
- Password confirmation
- Secure password reset

### Dashboard Page (`/dashboard`)

- User profile view and edit
- Profile image upload
- Bio editing (max 500 characters)
- Change password form
- Navigation to file manager

### File Manager Page (`/files`)

- Drag and drop file upload
- List all user files
- Download files
- Delete files with confirmation
- File type icons
- File size display

## 🔐 Authentication Context

The `AuthContext` provides:

```javascript
{
  user,                    // Current user object
  token,                   // JWT token
  loading,                 // Loading state
  error,                   // Error message
  isAuthenticated,         // Boolean auth status
  register(),              // Register function
  login(),                 // Login function
  logout(),                // Logout function
  updateProfile(),         // Update user profile
  changePassword(),        // Change password
  forgotPassword(),        // Request OTP
  resetPassword(),         // Reset with OTP
}
```

## 🛡️ Protected Routes

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

If user is not authenticated, they're redirected to login page.

## 🎨 Tailwind CSS Setup

Configured with:

- Custom colors (primary, secondary, danger, warning)
- Content paths for purging unused styles
- Responsive design utilities
- Form styling
- Shadow effects
- Transitions and animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Backend running on `http://localhost:5000`

### Installation

```bash
cd client
npm install
```

### Start Development Server

```bash
npm start
```

Server runs on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📝 API Integration

Axios is configured with:

```javascript
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

All API calls automatically include the JWT token in headers.

## 🔄 How It Works

1. **User Registration/Login**
   - Form submits to backend
   - JWT token received and stored in localStorage
   - User redirected to dashboard

2. **Protected Routes**
   - ProtectedRoute checks if user is authenticated
   - Shows loading spinner while checking
   - Redirects to login if not authenticated

3. **Profile Management**
   - User can view and edit profile
   - Changes sent to backend via API
   - Profile image uploaded as FormData

4. **File Management**
   - Files uploaded as FormData
   - Backend stores file and metadata
   - User can view, download, and delete files
   - All operations require authentication

## 🎯 Common Tasks

### Add New Protected Page

```javascript
import ProtectedRoute from "../components/ProtectedRoute";

<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>;
```

### Use Auth Context

```javascript
import { useAuth } from "../context/AuthContext";

const MyComponent = () => {
  const { user, token, login, logout } = useAuth();
  // Use auth values
};
```

### Make API Call

```javascript
import axios from "axios";

const response = await axios.get("/files");
// Token is automatically included in headers
```

## 📱 Responsive Design

All pages are responsive with:

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Flexible grids
- Touch-friendly buttons
- Optimized layouts

## 🐛 Troubleshooting

### Connection Refused Error

- Ensure backend is running on `http://localhost:5000`
- Check `axios.defaults.baseURL` in AuthContext.js

### Token Not Being Stored

- Check localStorage in browser DevTools
- Ensure token is returned from backend login

### CORS Errors

- Backend CORS is already configured
- Both apps must be on different ports

### Files Not Uploading

- Check max file size (10MB)
- Verify file format is allowed
- Ensure FormData is used correctly

## 🎓 Learning Resources

- [React Hooks](https://reactjs.org/docs/hooks-intro)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Frontend Status: COMPLETE & OPERATIONAL!**

Full-featured React frontend ready for production deployment.
