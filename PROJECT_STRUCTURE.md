# ResumeNest - Project Structure

## Root Directory (`d:\Resume\`)

### Configuration Files
- `package.json` - Root project package configuration
- `package-lock.json` - Dependency lock file
- `.env.example` - Example environment variables (MongoDB Atlas configuration)

### Documentation Files
- `README.md` - Main project documentation
- `DEVELOPMENT.md` - Development guidelines
- `FEATURES.md` - Feature list
- `GET_STARTED.md` - Getting started guide
- `MONGODB_ATLAS_SETUP.md` - MongoDB Atlas setup guide (380 lines)
- `DATABASE_MIGRATION_GUIDE.md` - Database migration reference (370 lines)
- `BULLET_REWRITER_FEATURE.md` - Bullet rewriter feature documentation
- `BULLET_REWRITER_QUICK_START.md` - Bullet rewriter quick start
- `UI_REDESIGN_COMPLETE.md` - UI redesign completion notes
- `UI_REDESIGN_IMPLEMENTATION.md` - UI redesign implementation details
- `UI_REDESIGN_REFERENCE.md` - UI redesign reference
- `UI_REDESIGN_SUMMARY.md` - UI redesign summary
- `UI_REDESIGN_VISUAL_GUIDE.md` - UI redesign visual guide
- `CHECKLIST_COMPLETE.md` - Implementation checklist
- `IMPLEMENTATION_COMPLETE.md` - Completion status
- `PDF_DOWNLOAD_ENHANCED.md` - PDF download feature documentation
- `TEXT_CLARITY_IMPROVEMENTS.md` - Text clarity improvements

### Utility Scripts
- `migrate-to-atlas.sh` - Automated MongoDB Atlas migration script

---

## Backend Directory (`backend/`)

### Root Files
- `package.json` - Backend dependencies
- `tsconfig.json` - TypeScript configuration
- `.env` - Backend environment variables (with MongoDB Atlas connection)

### Source Code (`backend/src/`)

#### Main Entry Point
- `index.ts` - Express server initialization and routes
- `db.ts` - MongoDB connection management

#### Controllers (`backend/src/controllers/`)
- `authController.ts` - Authentication logic (register, login, JWT)
- `resumeController.ts` - Resume CRUD operations
- `pdfController.ts` - PDF generation and export
- `suggestionsController.ts` - AI suggestion features

#### Middleware (`backend/src/middleware/`)
- `auth.ts` - JWT authentication middleware

#### Models (`backend/src/models/`)
- `User.ts` - User database model (Mongoose schema)
- `Resume.ts` - Resume database model (Mongoose schema)

#### Routes (`backend/src/routes/`)
- `auth.ts` - Authentication endpoints
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
- `resumes.ts` - Resume endpoints
  - `GET /api/resumes` - Get all resumes
  - `POST /api/resumes` - Create resume
  - `PUT /api/resumes/:id` - Update resume
  - `DELETE /api/resumes/:id` - Delete resume
- `suggestions.ts` - AI suggestion endpoints
  - `POST /api/suggestions` - Get AI suggestions

---

## Frontend Directory (`frontend/`)

### Root Files
- `package.json` - Frontend dependencies
- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - TypeScript config for Node
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.cjs` - ESLint configuration
- `index.html` - HTML entry point

### Source Code (`frontend/src/`)

#### Main Files
- `main.tsx` - React entry point
- `App.tsx` - Main App component
- `App.css` - App global styles
- `index.css` - Global styles with Tailwind

#### Components (`frontend/src/components/`)
- `BulletRewriter.tsx` - AI bullet point rewriter component
- `ProtectedRoute.tsx` - Route protection wrapper

#### Context (`frontend/src/context/`)
- `ResumeContext.tsx` - Global resume state management

#### Pages (`frontend/src/pages/`)
- `Login.tsx` - User login page (black theme with glassmorphism)
- `Register.tsx` - User registration page (black theme with glassmorphism)
- `Dashboard.tsx` - Main dashboard page (black theme)
- `Editor.tsx` - Resume editor page (black theme)
- `Templates.tsx` - Resume templates selection page

#### Services (`frontend/src/services/`)
- `api.ts` - Axios API client configuration
- `resumeService.ts` - Resume API service methods

---

## Shared Directory (`shared/`)

- `types.ts` - TypeScript interfaces and types shared between frontend and backend
  - User interface
  - Resume interface
  - Education interface
  - Experience interface
  - Skills interface
  - API response types

---

## Architecture Overview

### Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + Node.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **Auth**: JWT (JSON Web Tokens)
- **AI Features**: OpenAI integration for suggestions
- **Export**: jsPDF/html2pdf for PDF generation

### Key Features Implemented
✅ User authentication (register, login)
✅ Resume CRUD operations
✅ Multiple resume templates
✅ AI-powered bullet point suggestions
✅ PDF export functionality
✅ Black theme UI with glassmorphism
✅ ResumeNest branding throughout
✅ MongoDB Atlas integration
✅ Protected routes with JWT

### Database Schema
- **Users**: id, email, password (hashed), createdAt, updatedAt
- **Resumes**: id, userId, title, content, template, createdAt, updatedAt
- **Resume Content**: personal info, education, experience, skills, projects

---

## Environment Configuration

### Backend `.env` Variables
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-builder?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-api-key
```

### Frontend Configuration
- API base URL: `http://localhost:3000/api` (development)
- Frontend port: `5173` (Vite dev server) or `5174` (if 5173 in use)

---

## Running the Application

```bash
# Install all dependencies
npm run install-all

# Start development mode (both frontend and backend)
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Type checking
npm run type-check
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resumes
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id` - Get specific resume

### Suggestions
- `POST /api/suggestions` - Get AI suggestions for resume content

### Health Check
- `GET /api/health` - Server health status

---

## MongoDB Atlas Configuration

**Connection String Format**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder?retryWrites=true&w=majority
```

**Setup Steps**:
1. Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create M0 free tier cluster
3. Create database user with username and password
4. Configure network access (allow 0.0.0.0/0 for development)
5. Get connection string and update `backend/.env`
6. Application will automatically connect to MongoDB Atlas

**Migration**:
- Use `migrate-to-atlas.sh` script to migrate data from local MongoDB
- See `DATABASE_MIGRATION_GUIDE.md` for detailed instructions

---

## File Statistics

- **Total Frontend Files**: ~15 (components, pages, services, context)
- **Total Backend Files**: ~10 (controllers, models, routes, middleware)
- **Documentation**: 17 markdown files
- **Configuration**: TypeScript, ESLint, Tailwind, PostCSS configs

---

## Notes

- `.env` files are in `.gitignore` for security
- `node_modules/` excluded from repository
- `dist/` and `build/` directories are auto-generated
- All code uses TypeScript for type safety
- UI follows black theme with purple accents and glassmorphism effects
- ResumeNest branding integrated throughout application
