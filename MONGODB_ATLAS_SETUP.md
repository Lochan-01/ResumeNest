# 🗄️ MongoDB Atlas Setup Guide for ResumeNest

## Overview
This guide will help you migrate from local MongoDB to MongoDB Atlas (cloud-hosted MongoDB).

---

## Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up
- Go to https://www.mongodb.com/cloud/atlas
- Click **"Start Free"**
- Sign up with email or Google/GitHub account
- Complete email verification

### 1.2 Create Organization
- Create a new Organization (or use default)
- Select **M0 (Free Tier)** - perfect for development

---

## Step 2: Create a Cluster

### 2.1 Configure Cluster
1. After account creation, click **"Create a Deployment"**
2. Select **"MongoDB Atlas"** (default)
3. Choose **M0 (Free Tier)**
4. Select cloud provider: **AWS** (or your preference)
5. Select region closest to you (default is fine)
6. Click **"Create Deployment"**

### 2.2 Wait for Cluster Creation
- Takes 2-5 minutes
- You'll see a "Deployment created successfully" message

---

## Step 3: Create Database User

### 3.1 Add Database User
1. In Atlas dashboard, go to **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Fill in credentials:
   ```
   Username: resumenest-user
   Password: [Generate a strong password or set your own]
   ```
4. Set Authentication Method: **Password (SCRAM)**
5. Set Database User Privileges: **Built-in Role: readWriteAnyDatabase**
6. Click **"Add User"**

### 3.2 Save Credentials
```
Username: resumenest-user
Password: YOUR_SECURE_PASSWORD_HERE
```
⚠️ **Save these credentials in a secure location!**

---

## Step 4: Configure Network Access

### 4.1 Add IP Whitelist
1. Go to **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. Choose one of:
   - **Allow Access from Anywhere** (0.0.0.0/0) - Development only
   - **Add Current IP Address** - More secure for production
4. Click **"Confirm"**

✅ **For development**: Allow anywhere (0.0.0.0/0)  
🔒 **For production**: Add specific IPs

---

## Step 5: Get Connection String

### 5.1 Copy Connection String
1. Go to **"Deployments"** → Click on your cluster
2. Click **"Connect"** button
3. Select **"Drivers"**
4. Choose:
   - **Driver**: Node.js
   - **Version**: 5.9 or later
5. Copy the connection string

### 5.2 Connection String Format
```
mongodb+srv://resumenest-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 5.3 Replace Password
```
mongodb+srv://resumenest-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD` with your database password
- `cluster0.xxxxx` matches your cluster name (shown in Atlas)

---

## Step 6: Update Environment Variables

### 6.1 Backend .env Configuration

Create or update `backend/.env`:

```dotenv
# Backend Configuration
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://resumenest-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
OPENAI_API_KEY=your-openai-api-key-here

# Frontend
VITE_API_URL=http://localhost:3000/api
```

### 6.2 Security Tips
- ✅ Use strong passwords (20+ characters recommended)
- ✅ Keep `.env` file in `.gitignore` (already configured)
- ✅ Never commit credentials to git
- ✅ Use different passwords for different environments
- ✅ Rotate passwords periodically in production

---

## Step 7: Test Connection

### 7.1 Verify Backend Connection
```bash
cd backend
npm run dev
```

Watch for:
```
✅ MongoDB connected successfully
```

If you see this message, your connection is working! 🎉

### 7.2 Test from CLI
```bash
mongosh "mongodb+srv://resumenest-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/resume-builder"
```

---

## Step 8: Verify Data

### 8.1 Check Collections in Atlas

1. Go to MongoDB Atlas Dashboard
2. Click on your Cluster
3. Click **"Collections"** tab
4. You should see:
   ```
   Database: resume-builder
   Collections:
     - users
     - resumes
   ```

### 8.2 View Sample Data
- Click on any collection to browse documents
- You can view, edit, or delete documents directly

---

## Step 9: Update .env.example

Update the public example file (without credentials):

```dotenv
# Backend Configuration
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
OPENAI_API_KEY=your-openai-api-key-here

# Frontend
VITE_API_URL=http://your-backend-url/api
```

---

## Troubleshooting

### Issue: Connection Timeout
**Solution:**
- Check IP whitelist allows your current IP
- Verify password is correct
- Ensure cluster is running (not paused)

### Issue: Authentication Failed
**Solution:**
- Double-check username and password
- Special characters in password? Ensure they're URL-encoded
- Reset password in Database Access if needed

### Issue: Database Not Found
**Solution:**
- Cluster name in connection string must match
- Database name should be `resume-builder`
- Collections will auto-create on first insert

### Issue: "Too many connections"
**Solution:**
- Free tier limited to 500 connections
- Reduce connection pool size in `.env`
- Implement connection pooling

---

## Connection String Security

### ⚠️ Never Expose
- ❌ Don't commit `.env` to git
- ❌ Don't share connection string publicly
- ❌ Don't use same credentials for dev and production
- ❌ Don't paste connection string in messages

### ✅ Do This
- ✅ Use environment variables
- ✅ Rotate passwords regularly
- ✅ Use different users per environment
- ✅ Store securely in password manager

---

## Production Deployment Checklist

### Before Going Live
- [ ] Create production cluster (paid tier recommended)
- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique passwords
- [ ] Configure IP whitelist (not 0.0.0.0/0)
- [ ] Enable two-factor authentication on Atlas
- [ ] Set up database backups
- [ ] Configure monitoring and alerts
- [ ] Test failover capabilities
- [ ] Document disaster recovery plan

---

## MongoDB Atlas Free Tier Limits

```
✅ Shared M0 Cluster
✅ 512 MB Storage
✅ Shared RAM
✅ 100,000 operations/day
✅ Basic monitoring
❌ No backup snapshots
❌ No guaranteed uptime SLA
❌ No dedicated support
```

For production, upgrade to M2 or M5 cluster.

---

## Useful Commands

### View Cluster Status
```
Dashboard → Deployments → Your Cluster → Overview
```

### Check Connection Metrics
```
Dashboard → Cluster → Monitoring
```

### Backup Data
```
Dashboard → Cluster → Backup → Snapshots
```

### Monitor Activity
```
Dashboard → Cluster → Real Time → Performance Advisor
```

---

## Next Steps

1. ✅ Create Atlas account and cluster
2. ✅ Create database user
3. ✅ Configure network access
4. ✅ Get connection string
5. ✅ Update `.env` file
6. ✅ Test connection
7. ✅ Deploy backend to production
8. ✅ Monitor in Atlas dashboard

---

## Support

### MongoDB Atlas Help
- **Documentation**: https://docs.mongodb.com/atlas/
- **Status Page**: https://status.mongodb.com/
- **Community**: https://community.mongodb.com/

### ResumeNest Help
- **Backend Error Logs**: Check terminal output
- **Connection Issues**: Verify IP whitelist and credentials
- **Performance**: Check MongoDB Atlas metrics

---

**Last Updated**: November 19, 2025  
**Status**: ✅ Complete Setup Guide
