# 🔧 AUTHENTICATOR API - POSTMAN/CURL TESTING GUIDE

## Quick Start Testing

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123"
  }'

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'

# Save the token from response!
TOKEN="your_jwt_token_here"
```

### 3. Enable Authenticator (Generate QR)

```bash
curl -X POST http://localhost:5000/api/auth/authenticator/enable \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

Response:
{
  "success": true,
  "message": "QR code generated successfully",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK...",
  "manualEntryKey": "JBSWY3DPEBLW64TMMQ======"
}

# Save manualEntryKey! You'll use this in Google Authenticator
```

### 4. Verify Authenticator OTP

```bash
# Get 6-digit code from Google Authenticator app
# Then run:

curl -X POST http://localhost:5000/api/auth/authenticator/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456"
  }'

Response:
{
  "success": true,
  "message": "Authenticator enabled successfully"
}
```

### 5. Check if User Has Authenticator

```bash
curl -X GET http://localhost:5000/api/auth/check-authenticator/test@example.com

Response:
{
  "success": true,
  "isAuthenticatorEnabled": true
}
```

### 6. Reset Password Using Authenticator OTP

```bash
# Get OTP from authenticator app
curl -X POST http://localhost:5000/api/auth/reset-password-authenticator \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "newPassword": "NewPassword123"
  }'

Response:
{
  "success": true,
  "message": "Password reset successfully using Authenticator. You can now login with your new password."
}
```

### 7. Disable Authenticator

```bash
# Get current OTP from authenticator app
curl -X POST http://localhost:5000/api/auth/authenticator/disable \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456"
  }'

Response:
{
  "success": true,
  "message": "Authenticator disabled successfully"
}
```

---

## 🧪 Full Test Scenario (Copy & Paste)

### Save this as `test-authenticator.sh` and run:

```bash
#!/bin/bash

API="http://localhost:5000/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== AUTHENTICATOR API TEST ===${NC}\n"

# 1. Register
echo -e "${BLUE}1. Registering user...${NC}"
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser'$(date +%s)'@example.com",
    "password": "Test123"
  }')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
EMAIL=$(echo $RESPONSE | grep -o '"email":"[^"]*' | cut -d'"' -f4)

echo -e "${GREEN}✓ Registered${NC}\n"
echo "Email: $EMAIL"
echo "Token: ${TOKEN:0:20}...\n"

# 2. Enable Authenticator
echo -e "${BLUE}2. Enabling Authenticator...${NC}"
RESPONSE=$(curl -s -X POST $API/auth/authenticator/enable \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}')

MANUAL_KEY=$(echo $RESPONSE | grep -o '"manualEntryKey":"[^"]*' | cut -d'"' -f4)

echo -e "${GREEN}✓ Authenticator enabled${NC}\n"
echo "Manual Entry Key: $MANUAL_KEY"
echo "⚠️  Use this in Google Authenticator!\n"

# 3. Check status
echo -e "${BLUE}3. Checking authenticator status...${NC}"
RESPONSE=$(curl -s -X GET $API/auth/check-authenticator/$EMAIL)
STATUS=$(echo $RESPONSE | grep -o '"isAuthenticatorEnabled":[^,}]*')

echo -e "${GREEN}✓ Status: $STATUS${NC}\n"

echo -e "${BLUE}=== TEST COMPLETE ===${NC}"
echo "Next steps:"
echo "1. Open Google Authenticator on your phone"
echo "2. Tap + icon"
echo "3. Select 'Enter a setup key'"
echo "4. Enter: $MANUAL_KEY"
echo "5. Note the 6-digit code"
echo "6. Run: curl -X POST $API/auth/authenticator/verify -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{\"otp\": \"XXXXXX\"}'"
```

---

## 📋 Postman Collection

### Import in Postman:

```json
{
  "info": {
    "name": "My Vault - Authenticator API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"Test123\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "register"]
        }
      }
    },
    {
      "name": "Enable Authenticator",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/auth/authenticator/enable",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "authenticator", "enable"]
        }
      }
    },
    {
      "name": "Verify OTP",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"otp\": \"123456\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/authenticator/verify",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "authenticator", "verify"]
        }
      }
    },
    {
      "name": "Reset Password with Authenticator",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"test@example.com\", \"otp\": \"123456\", \"newPassword\": \"NewPassword123\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/reset-password-authenticator",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "reset-password-authenticator"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## ✅ Expected Responses

All endpoints follow this format:

### Success (200/201)

```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

### Error (400/404/500)

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🐛 Common Errors & Solutions

| Error                           | Cause           | Solution                        |
| ------------------------------- | --------------- | ------------------------------- |
| "Invalid OTP"                   | Wrong code      | Ensure time is synced on phone  |
| "Authenticator not enabled"     | Not setup yet   | Run enable endpoint first       |
| "Authenticator already enabled" | Already enabled | Run disable first if re-testing |
| "Invalid token"                 | Expired JWT     | Login again to get new token    |
| "No user found"                 | Wrong email     | Check email spelling            |

---

## 🎯 Testing Order

1. **Register** → Save token & email
2. **Enable Authenticator** → Save manual key
3. **Add to Google Authenticator** → Get OTP code
4. **Verify OTP** → Activate authenticator
5. **Check Status** → Confirm enabled
6. **Reset Password** → Test with authenticator
7. **Disable** → Optional cleanup

Good luck! 🚀
