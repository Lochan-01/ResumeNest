# ResumeNest - Authentication Setup Instructions

## Overview

Your ResumeNest application now has full **MongoDB Atlas authentication** with Sign Up and Login functionality!

## Quick Start Guide

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account (or sign in if you have one)
3. Create a new **free cluster**

### Step 2: Get MongoDB Connection String

1. In MongoDB Atlas, click **"Connect"** on your cluster
2. Select **"Drivers"** tab
3. Choose **Node.js** driver
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/resumenest?retryWrites=true&w=majority`)

### Step 3: Configure the Backend Server

Navigate to the `server` folder and configure `.env`:

```bash
cd server
```

Edit `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumenest?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

Replace:
- `username` - Your MongoDB Atlas username
- `password` - Your MongoDB Atlas password  
- `cluster` - Your cluster name (e.g., `cluster0`)

### Step 4: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 5: Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
Connected to MongoDB Atlas
```

### Step 6: Run Frontend (in another terminal)

```bash
cd ..
npm run dev
```

## What's Included

### Frontend Changes
- **AuthPage.tsx**: Full sign-up and login forms with error handling
- **authService.ts**: Service to handle API calls to the backend
- **App.tsx**: Updated to check localStorage for persistent login

### Backend Files
- `server/server.js`: Express server with CORS and MongoDB connection
- `server/routes/auth.js`: Authentication endpoints (signup, login)
- `server/models/User.js`: MongoDB user schema with password hashing

## API Endpoints

### Sign Up
```
POST /api/auth/signup
Body: {
  "fullName": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
Response: {
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

## Features

✅ User Registration with validation
✅ Secure Password Hashing (bcryptjs)
✅ JWT Token Authentication (7-day expiration)
✅ Persistent Login (localStorage)
✅ Error Messages & Loading States
✅ Auto-login on page reload
✅ Sign Out functionality

## Testing

1. **Sign Up**: Create a new account with email and password
2. **Login**: Log in with your credentials
3. **Persistent Login**: Refresh the page - you should stay logged in
4. **Sign Out**: Click logout button to clear session

## Troubleshooting

### "Connection refused" Error
- Make sure backend server is running on port 5000
- Check if MongoDB URI is correct in `.env`

### "Email already registered" 
- You already have an account with that email
- Try logging in instead of signing up

### "Invalid email or password"
- Check your credentials are correct
- Make sure you signed up first before trying to login

### MongoDB Connection Error
- Verify connection string in `server/.env`
- Make sure your IP is whitelisted in MongoDB Atlas (usually done automatically)
- Check username and password are correct

## Security Notes

- Passwords are hashed with bcryptjs before storage
- Never commit `.env` with real credentials to git
- Use strong passwords (8+ characters recommended)
- Tokens expire after 7 days for security
- JWT_SECRET should be a long random string in production

## Next Steps

### To save resume data per user:
You can now extend the backend to save resume data to MongoDB:

```javascript
// Example: Save resume to user profile
POST /api/resumes - Save resume
GET /api/resumes - Get user's resumes
PUT /api/resumes/:id - Update resume
DELETE /api/resumes/:id - Delete resume
```

### Environment Variables Reference
```
MONGODB_URI - MongoDB connection string
JWT_SECRET - Secret key for JWT tokens
PORT - Server port (default: 5000)
```

## Support

If you encounter issues:
1. Check MongoDB Atlas connection string
2. Ensure backend and frontend servers are both running
3. Check browser console for errors (F12)
4. Check terminal output of both servers for error messages

---

**Happy Resume Building! 🚀**
