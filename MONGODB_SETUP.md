# MongoDB Atlas Authentication Setup Guide

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Create MongoDB Atlas Account and Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Select "Node.js"
   - Copy the connection string

### 3. Update Server Configuration

Edit `server/.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumenest?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
```

Replace:
- `username` with your MongoDB username
- `password` with your MongoDB password
- `cluster` with your actual cluster name

### 4. Start the Server

Open a new terminal in the project root:

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### 5. Run the Frontend

In another terminal (from project root):

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## How It Works

### Sign Up Flow
1. User enters full name, email, and password
2. Password is hashed using bcryptjs
3. User record is created in MongoDB
4. JWT token is generated and stored in localStorage
5. User is automatically logged in

### Login Flow
1. User enters email and password
2. System finds user in MongoDB
3. Password is compared with hashed password
4. If valid, JWT token is generated
5. Token stored in localStorage for future requests

### Authentication
- Tokens are stored in browser's localStorage
- Frontend checks localStorage on app load for auto-login
- Logout clears the token from localStorage

## API Endpoints

### POST `/api/auth/signup`
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### POST `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI in server/.env
- Check MongoDB Atlas IP whitelist includes your current IP
- Ensure database user credentials are correct

### CORS Error
- The server has CORS enabled for localhost:3000
- If running on different ports, update CORS configuration in `server/server.js`

### Token Errors
- Make sure JWT_SECRET is set in server/.env
- Tokens expire after 7 days, user will need to login again

## Security Notes

- Never commit `.env` files with real credentials
- Use strong JWT secrets in production
- Change MongoDB user passwords regularly
- Enable IP whitelist in MongoDB Atlas
- Use HTTPS in production
