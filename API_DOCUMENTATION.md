# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Login User

**POST** `/auth/login`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Forgot Password (Request OTP)

**POST** `/auth/forgot-password`

**Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent to email successfully"
}
```

---

### 4. Reset Password (Verify OTP)

**POST** `/auth/reset-password`

**Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

---

## User Profile Endpoints (Protected)

> **Note:** All these endpoints require `Authorization: Bearer <token>` header

### 5. Get User Profile

**GET** `/user/profile`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "uploads/profiles/profile-123456.jpg",
    "bio": "Software Developer",
    "role": "user",
    "createdAt": "2026-02-03T10:00:00.000Z",
    "updatedAt": "2026-02-03T10:00:00.000Z"
  }
}
```

---

### 6. Update User Profile

**PUT** `/user/profile`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**

- `name` (optional): "John Updated"
- `bio` (optional): "Full Stack Developer"
- `profileImage` (optional): [File]

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "John Updated",
    "email": "john@example.com",
    "bio": "Full Stack Developer",
    "profileImage": "uploads/profiles/profile-123456.jpg"
  }
}
```

---

### 7. Change Password

**PUT** `/user/change-password`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Body:**

```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## File Management Endpoints (Protected)

> **Note:** All these endpoints require `Authorization: Bearer <token>` header

### 8. Upload File

**POST** `/files/upload`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**

- `file`: [File] (PDF, Word, Text, Images - Max 10MB)

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "_id": "file_id",
    "userId": "user_id",
    "fileName": "file-123456789.pdf",
    "originalName": "document.pdf",
    "fileType": ".pdf",
    "filePath": "uploads/files/file-123456789.pdf",
    "fileSize": 102400,
    "uploadedAt": "2026-02-03T10:00:00.000Z",
    "createdAt": "2026-02-03T10:00:00.000Z",
    "updatedAt": "2026-02-03T10:00:00.000Z"
  }
}
```

---

### 9. Get All User Files

**GET** `/files`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "files": [
    {
      "_id": "file_id_1",
      "userId": "user_id",
      "fileName": "file-123456789.pdf",
      "originalName": "document.pdf",
      "fileType": ".pdf",
      "filePath": "uploads/files/file-123456789.pdf",
      "fileSize": 102400,
      "uploadedAt": "2026-02-03T10:00:00.000Z"
    },
    {
      "_id": "file_id_2",
      "userId": "user_id",
      "fileName": "file-987654321.docx",
      "originalName": "report.docx",
      "fileType": ".docx",
      "filePath": "uploads/files/file-987654321.docx",
      "fileSize": 204800,
      "uploadedAt": "2026-02-03T09:00:00.000Z"
    }
  ]
}
```

---

### 10. View/Preview File

**GET** `/files/view/:id`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

- Returns the file content for inline viewing (PDFs, images, etc.)
- Sets appropriate Content-Type header

---

### 11. Download File

**GET** `/files/download/:id`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

- Initiates file download with original filename
- Sets `Content-Disposition: attachment`

---

### 12. Delete File

**DELETE** `/files/:id`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common error status codes:

- `400` - Bad Request (missing or invalid data)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (no permission to access resource)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Notes

1. **JWT Token**: After login/register, save the token and include it in the `Authorization` header as `Bearer <token>` for all protected routes.

2. **File Upload**:
   - Profile images: Max 5MB, formats: jpeg, jpg, png, gif
   - Documents: Max 10MB, formats: pdf, doc, docx, txt, jpeg, jpg, png

3. **OTP Expiry**: Password reset OTP expires in 10 minutes.

4. **File Security**: Users can only view, download, or delete their own files. Unauthorized access is blocked.

5. **Static Files**: Uploaded files are accessible at `/uploads/...` path for authenticated users.
