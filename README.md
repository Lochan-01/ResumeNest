# ResumeNest

A modern and customizable Resume Builder that helps users create clean, professional resumes with ease. Features multiple templates, real-time preview, MongoDB authentication, and AI-powered content enhancement.

## Features

✨ **4 Professional Templates** - Professional, Modern, Creative, Minimal
✨ **Real-time Preview** - See changes instantly
✨ **MongoDB Authentication** - Secure user accounts with JWT tokens
✨ **Save & Load Resumes** - Store multiple resumes in database
✨ **AI Enhancement** - Powered by Google Gemini API
✨ **ATS-Friendly** - Optimized for Applicant Tracking Systems
✨ **Export to PDF** - Download your resume

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS for styling
- Vite for fast development
- Axios for API calls

**Backend:**
- Node.js & Express.js
- MongoDB Atlas with Mongoose
- JWT authentication
- bcryptjs for password security

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Gemini API key

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Configuration

Create `.env` in root:
```
GEMINI_API_KEY=your_gemini_api_key
```

Create `server/.env`:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Usage

1. **Sign Up** - Create a new account with email and password
2. **Create Resume** - Fill in your details using the form
3. **Choose Template** - Select from 4 professional templates
4. **Preview** - See your resume in real-time
5. **Save** - Store your resume in the database
6. **Download** - Export as PDF

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes` - Get user's resumes
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Enhancement
- `POST /api/gemini/enhance` - Enhance text with AI

## Project Structure

```
resumenest/
├── components/           # React components
│   ├── AuthPage.tsx
│   ├── ResumeForm.tsx
│   ├── ResumePreview.tsx
│   └── templates/        # Resume templates
├── services/            # API services
│   ├── authService.ts
│   ├── resumeService.ts
│   └── geminiService.ts
├── server/              # Express backend
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── middleware/      # Auth middleware
└── types.ts             # TypeScript types
```

## Documentation

- See `AUTHENTICATION.md` for auth setup
- See `MONGODB_SETUP.md` for MongoDB configuration
- See `IMPLEMENTATION_SUMMARY.md` for feature overview
