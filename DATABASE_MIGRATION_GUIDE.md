# 🔄 Switching Between Local MongoDB and MongoDB Atlas

## Quick Reference

### Local MongoDB (Development)
```bash
# In backend/.env
MONGODB_URI=mongodb://localhost:27017/resume-builder

# Start local MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo

# Or if MongoDB is installed locally
mongod
```

### MongoDB Atlas (Production)
```bash
# In backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
```

---

## Development Setup with Local MongoDB

### Step 1: Start MongoDB Locally

**Using Docker (Recommended):**
```bash
docker run -d -p 27017:27017 --name resumenest-mongodb mongo
```

**Using MongoDB Community Edition:**
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 2: Update .env File

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=dev-secret-key
OPENAI_API_KEY=your-openai-key
```

### Step 3: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:3000
```

---

## Production Setup with MongoDB Atlas

### Step 1: Create MongoDB Atlas Account
Visit https://www.mongodb.com/cloud/atlas and create free account

### Step 2: Create Cluster
- Choose M0 (Free Tier) or higher
- Select region closest to your users
- Create database user with username/password
- Get connection string

### Step 3: Update .env File

```dotenv
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters
OPENAI_API_KEY=your-openai-key
```

### Step 4: Test Connection

```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:3000
```

---

## Migrating Data

### Option 1: Using Migration Script

```bash
# For Linux/macOS
bash migrate-to-atlas.sh

# For Windows (requires WSL or Git Bash)
bash migrate-to-atlas.sh
```

### Option 2: Manual Export/Import

```bash
# Export from local MongoDB
mongodump --db resume-builder --out ./backup

# Import to MongoDB Atlas
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/resume-builder" ./backup/resume-builder
```

### Option 3: Through MongoDB Atlas Interface

1. Go to MongoDB Atlas Dashboard
2. Click "Import Data"
3. Upload CSV/JSON files or connect to local database
4. Complete import wizard

---

## Connection String Formats

### Local MongoDB
```
mongodb://localhost:27017/resume-builder
```

### MongoDB Atlas (SRV)
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
```

### MongoDB Atlas (Standard Connection)
```
mongodb://username:password@cluster0-shard-00-00.xxxxx.mongodb.net:27017,cluster0-shard-00-01.xxxxx.mongodb.net:27017,cluster0-shard-00-02.xxxxx.mongodb.net:27017/resume-builder?ssl=true&replicaSet=atlas-xxxxx&authSource=admin&retryWrites=true&w=majority
```

---

## Troubleshooting

### Error: "connect ECONNREFUSED"
**Problem:** Cannot connect to local MongoDB
**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it
mongod  # or docker run...
```

### Error: "Authentication failed"
**Problem:** Wrong credentials for MongoDB Atlas
**Solution:**
1. Go to MongoDB Atlas → Database Access
2. Reset password or create new user
3. Verify username/password in connection string
4. Check special characters are URL-encoded

### Error: "IP address not whitelisted"
**Problem:** Your IP not allowed to connect
**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add your IP address or allow 0.0.0.0/0 (development only)
3. Allow time for changes to propagate (1-2 minutes)

### Slow Queries
**Diagnosis:**
```bash
# View MongoDB logs
cd backend
npm run dev

# In MongoDB Atlas dashboard
Cluster → Monitoring → Performance Advisor
```

**Solutions:**
- Add indexes to frequently queried fields
- Optimize query patterns
- Upgrade cluster tier for better performance

---

## Backup Strategies

### Local Development
```bash
# Backup local database
mongodump --out ./backup-$(date +%Y%m%d)

# Restore from backup
mongorestore ./backup-20250119
```

### Production (MongoDB Atlas)
- Automatic daily backups (paid tier)
- Manual snapshots via Atlas interface
- Point-in-time recovery available
- Export to S3/Azure Storage

---

## Environment Variables Checklist

### Development
- [ ] `MONGODB_URI` points to local MongoDB
- [ ] `NODE_ENV=development`
- [ ] `JWT_SECRET` is set
- [ ] `OPENAI_API_KEY` is set (optional)

### Production
- [ ] `MONGODB_URI` points to MongoDB Atlas
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] `OPENAI_API_KEY` is set
- [ ] IP whitelist configured in Atlas
- [ ] Database backups enabled

---

## Database Connection Limits

### Local MongoDB
- Unlimited connections (limited by system resources)
- No rate limiting
- Full access to all features

### MongoDB Atlas M0 (Free)
- 500 concurrent connections
- 100,000 operations/day
- 512 MB storage
- Shared resources

### MongoDB Atlas M2+
- 10,000+ concurrent connections
- No operation limits
- 10+ GB storage
- Dedicated resources

---

## Quick Commands

```bash
# Test local MongoDB connection
mongosh

# Test MongoDB Atlas connection
mongosh "mongodb+srv://user:pass@cluster0.mongodb.net/resume-builder"

# View all collections in current database
show collections

# Count documents in collection
db.resumes.countDocuments()

# View sample documents
db.resumes.find().limit(5)

# Clear all data (be careful!)
db.dropDatabase()
```

---

## Security Best Practices

### Development
- ✅ Local connection string is safe
- ✅ No need to expose credentials
- ✅ Use simple passwords

### Production
- ✅ Use strong, unique passwords
- ✅ Enable IP whitelist (not 0.0.0.0/0)
- ✅ Use environment variables for all secrets
- ✅ Enable two-factor authentication
- ✅ Rotate credentials regularly
- ✅ Monitor access logs in Atlas
- ✅ Use connection string with SRV record

---

## Support

### MongoDB Local
- **Documentation**: https://docs.mongodb.com/manual/
- **Community**: https://community.mongodb.com/

### MongoDB Atlas
- **Documentation**: https://docs.mongodb.com/atlas/
- **Status Page**: https://status.mongodb.com/
- **Community**: https://community.mongodb.com/

### ResumeNest
- Check error logs in backend terminal
- Verify `.env` configuration
- Confirm network connectivity

---

**Last Updated**: November 19, 2025
