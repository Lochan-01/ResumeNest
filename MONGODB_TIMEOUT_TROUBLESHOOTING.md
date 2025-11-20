# MongoDB Connection Timeout - Troubleshooting Guide

## Error: `Operation 'users.findOne()' buffering timed out after 10000ms`

This error occurs when:
1. MongoDB Atlas network access not configured
2. Connection string is invalid or incorrect
3. Database user credentials are wrong
4. Network connectivity issues

## Quick Fixes

### 1. **Check MongoDB Atlas Network Access** ⚠️

Your IP address must be whitelisted in MongoDB Atlas:

1. Go to: https://cloud.mongodb.com → Your Project → Network Access
2. Click "Add IP Address"
3. Choose one:
   - **Development**: Add `0.0.0.0/0` (allow all - less secure)
   - **Production**: Add your specific server IP
4. Click "Confirm"

### 2. **Verify Connection String Format**

Your `MONGODB_URI` should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
```

**Check:**
- ✅ Username and password are correct (from Database Users section)
- ✅ Cluster name is correct (from cluster URL)
- ✅ Database name is `resume-builder`
- ✅ No special characters in password (if any, URL-encode them: @ = %40, : = %3A)

### 3. **Test Connection Locally**

```bash
# Install MongoDB command-line tools
# Then test with:
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder"
```

If connection succeeds, your credentials are correct.

### 4. **Check Vercel Environment Variables**

If deploying to Vercel:
1. Go to: https://vercel.com → Your Project → Settings → Environment Variables
2. Verify `MONGODB_URI` is set correctly
3. Redeploy after updating

### 5. **Increase Timeout in Code**

Already done! We updated `backend/api/db.ts` with:
```typescript
serverSelectionTimeoutMS: 5000,    // 5 second timeout to select server
socketTimeoutMS: 45000,             // 45 second timeout for operations
```

## Common Issues & Solutions

### "Authentication failed"
- **Cause**: Wrong username/password
- **Fix**: 
  1. Go to MongoDB Atlas → Database Access
  2. Check username and password
  3. If forgotten, reset the password
  4. Update `MONGODB_URI` in `.env`

### "IP address not whitelisted"
- **Cause**: Your IP isn't allowed to connect
- **Fix**: 
  1. Go to Network Access
  2. Add your IP or `0.0.0.0/0`
  3. Wait 1-2 minutes for changes to apply

### "Wrong database or cluster"
- **Cause**: Connection string has wrong cluster name
- **Fix**:
  1. Go to MongoDB Atlas → Clusters
  2. Click "Connect" on your cluster
  3. Copy the connection string
  4. Update `MONGODB_URI`

### "Connection pool exhausted"
- **Cause**: Too many connections trying to connect simultaneously
- **Fix**: Already handled in code with `maxPoolSize: 10`

## Development vs Production

### Local Development
```
MONGODB_URI=mongodb://localhost:27017/resume-builder
```
(Requires local MongoDB running)

### Production (Vercel/Render)
```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
```
(Uses MongoDB Atlas cloud)

## Quick Test

```bash
# Test if MongoDB is accessible
curl -X GET http://localhost:3000/api/health

# Should return:
{
  "status": "OK",
  "message": "Server and database are running",
  "mongodb": "Connected"
}
```

## Still Having Issues?

### Check MongoDB Atlas Status
- Go to https://status.mongodb.com
- Verify your cluster region is operational

### Check Network
```bash
# Test if you can reach MongoDB Atlas
ping cluster0.wm2rn7u.mongodb.net

# Or use nslookup (Windows)
nslookup cluster0.wm2rn7u.mongodb.net
```

### Review Logs
1. **Local**: Check terminal output from `npm run dev`
2. **Vercel**: Dashboard → Deployments → Function Logs
3. **MongoDB Atlas**: 
   - Go to your cluster
   - Click "Activity" tab
   - Check for connection errors

## Prevention Checklist

- ✅ Network access allows your IP (0.0.0.0/0 for dev)
- ✅ Connection string is correct (copy from MongoDB Atlas)
- ✅ Username and password match Database Users
- ✅ Database name exists in cluster
- ✅ `MONGODB_URI` environment variable is set
- ✅ No typos in connection string
- ✅ Special characters in password are URL-encoded

## Support Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **MongoDB Connection Guide**: https://docs.mongodb.com/manual/reference/connection-string/
- **Mongoose Connection Options**: https://mongoosejs.com/docs/api/connection.html#connection_Connection-openUri

---

**Your app should connect successfully now!** 🚀

If issues persist, check the MongoDB Atlas Activity/Logs section for specific error messages.
