# Vercel Deployment Guide - ResumeNest

## Overview

This guide walks you through deploying ResumeNest to Vercel with:
- **Frontend**: Static site served from `frontend/dist`
- **Backend API**: Serverless functions at `/api/*` routes
- **Database**: MongoDB Atlas (cloud-hosted)
- **Environment Variables**: Configured in Vercel dashboard

## Prerequisites

- GitHub account with ResumeNest repository pushed
- MongoDB Atlas account with active cluster
- Vercel account (free tier available)
- OpenAI API key (for suggestions feature)

## Step-by-Step Deployment

### 1. Create Vercel Account & Connect GitHub

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your `ResumeNest` repository
5. Click "Import"

### 2. Configure Project Settings

**Root Directory**: Select root of repository (leave blank or as-is)

**Framework Preset**: Select "Other" (we have custom vercel.json)

**Build Command**: `npm run build`

**Output Directory**: `frontend/dist`

### 3. Add Environment Variables

Before deploying, add these environment variables in Vercel dashboard:

#### Required Variables:
- **MONGODB_URI**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority`
  - Get from MongoDB Atlas → Connect → Connection String
  
- **JWT_SECRET**: `your-super-secret-jwt-key-here`
  - Use a strong random string (min 32 characters)
  - Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

- **OPENAI_API_KEY**: `sk-...your-openai-key...`
  - Get from https://platform.openai.com/api-keys

- **NODE_ENV**: `production`

### 4. Deploy

1. After setting environment variables, click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Testing After Deployment

### Test Registration Endpoint
```bash
curl -X POST https://your-project-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
```

### Test API Health
```bash
curl https://your-project-name.vercel.app/api/health
```

## Project Structure for Vercel

```
ResumeNest/
├── backend/
│   ├── api/                    # Serverless functions
│   │   ├── auth.ts            # /api/auth
│   │   ├── resumes.ts         # /api/resumes
│   │   ├── suggestions.ts     # /api/suggestions
│   │   └── db.ts              # Database connection
│   ├── src/                    # Original backend (optional)
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── services/api.ts    # Updated to use /api paths
│   └── dist/                   # Built frontend (deployed)
├── vercel.json                 # Vercel configuration
└── package.json
```

## API Endpoint Mapping

| Local Development | Vercel Production |
|------------------|------------------|
| POST http://localhost:3000/api/auth/register | POST https://app.vercel.app/api/auth/register |
| POST http://localhost:3000/api/auth/login | POST https://app.vercel.app/api/auth/login |
| GET http://localhost:3000/api/resumes | GET https://app.vercel.app/api/resumes |
| POST http://localhost:3000/api/resumes | POST https://app.vercel.app/api/resumes |
| PUT http://localhost:3000/api/resumes/:id | PUT https://app.vercel.app/api/resumes/:id |
| DELETE http://localhost:3000/api/resumes/:id | DELETE https://app.vercel.app/api/resumes/:id |

## Troubleshooting

### 502 Bad Gateway Error
- **Cause**: Serverless function timeout or MongoDB connection issue
- **Fix**: Check MongoDB Atlas network access (allow 0.0.0.0/0)
- **Check logs**: Vercel dashboard → Deployments → Function Logs

### Connection Timeout
- **Cause**: MONGODB_URI not set or incorrect
- **Fix**: Verify connection string in Vercel environment variables
- **Format**: `mongodb+srv://user:pass@cluster.mongodb.net/database?retryWrites=true&w=majority`

### CORS Issues
- **Fix**: API endpoints have CORS headers enabled
- **Frontend**: Uses `/api` relative paths automatically

### Build Failures
- **Check**: `npm run build` works locally first
- **Command**: `npm run install-all && npm run build`
- **Logs**: View build logs in Vercel dashboard

## Environment Variable Security

⚠️ **Important Security Notes:**

1. **Never** commit `.env` files to GitHub
2. Use strong JWT_SECRET (32+ random characters)
3. Regenerate JWT_SECRET for production
4. Rotate OpenAI API key if exposed
5. Use MongoDB Atlas IP whitelist (ideally specific IPs, not 0.0.0.0)

## Advanced Configuration

### Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

### Database Backups
- Enable automatic backups in MongoDB Atlas
- Dashboard → Backups → Enable automated backups

### Monitoring
- Vercel Analytics: Track deployment performance
- MongoDB Monitoring: Monitor database queries
- Error tracking: Vercel logs show function errors

## Redeploy After Updates

```bash
# Make code changes
git add .
git commit -m "your message"
git push origin main

# Vercel auto-deploys on push to main branch
```

## File Size Limits

- Vercel serverless functions: 250MB (uncompressed)
- Build output: Should be <100MB
- Frontend bundle: Typically 500KB-2MB

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Vercel account
3. ✅ Import GitHub repository
4. ✅ Set environment variables
5. ✅ Deploy
6. ✅ Test endpoints
7. ✅ Share your live app!

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Serverless Functions**: https://vercel.com/docs/functions/serverless-functions
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

**Your ResumeNest app is now production-ready! 🚀**
