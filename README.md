# Notes App - TurboAI Take Home Assignment

A category-based notes web application with a clean, calming UI.

## Project Overview

This is a full-stack web application built as part of the TurboAI take-home assignment. The project follows a phased development approach with clear separation between backend and frontend.

### Tech Stack

- **Backend:** Python 3.12 + Django 4.2 LTS
- **Frontend:** React 18.x + Next.js 15 (Coming in Slice 2)
- **Database:** SQLite (in-memory option available)
- **API:** REST with Django REST Framework

## Project Status

### ✅ Slice 1: Project Setup & Authentication Foundation - COMPLETE

Both backend and frontend are fully implemented with complete authentication!

#### Backend Features
- ✅ Django project initialized with SQLite
- ✅ Custom user model with UUID primary keys
- ✅ Authentication endpoints (signup, login, logout)
- ✅ Password validation (uppercase, lowercase, number requirements)
- ✅ Email validation
- ✅ CORS configuration for frontend integration
- ✅ Comprehensive test suite (12/12 tests passing)
- ✅ API documentation

**Backend Server:** Running at `http://localhost:8000`

#### Frontend Features
- ✅ Next.js 15 project initialized with TypeScript
- ✅ Authentication pages (Sign Up, Sign In)
- ✅ Form validation (client-side with Zod)
- ✅ API integration with backend
- ✅ Protected workspace route
- ✅ Responsive design with Tailwind CSS
- ✅ Session-based authentication with cookies
- ✅ No linting errors

**Frontend Server:** Running at `http://localhost:3000`

See [SLICE_1_COMPLETE.md](./SLICE_1_COMPLETE.md) for details.

### 🔄 Next Slices

- **Slice 2:** Notes CRUD + Categories
- **Slice 3:** Note editor with autosave
- **Slice 4:** Polish and refinements

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Automated setup
./setup.sh

# Or manually
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Get Started" to create an account
3. Fill out the sign-up form with valid credentials
4. You'll be redirected to the workspace
5. Try logging out and signing back in

### Run Tests

**Backend:**
```bash
cd backend
source venv/bin/activate
python manage.py test users
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Documentation

- **Project Specifications:** [specifications.md](./specifications.md)
- **Slice 1 Complete:** [SLICE_1_COMPLETE.md](./SLICE_1_COMPLETE.md)
- **Backend README:** [backend/README.md](./backend/README.md)
- **Backend API:** [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
- **Frontend README:** [frontend/README.md](./frontend/README.md)

## Project Structure

```
TurboAI_TakeHome/
├── backend/                    # Django backend (✅ Complete)
│   ├── config/                # Django project settings
│   ├── users/                 # User authentication app
│   ├── requirements.txt       # Python dependencies
│   ├── setup.sh              # Setup script
│   └── README.md             # Backend documentation
├── frontend/                  # Next.js frontend (✅ Complete)
│   ├── app/                  # App Router pages
│   ├── components/           # Reusable components
│   ├── lib/                  # Utilities & API client
│   ├── package.json          # Dependencies
│   └── README.md             # Frontend documentation
├── specifications.md          # Product requirements
├── SLICE_1_COMPLETE.md       # Slice 1 summary
└── README.md                  # This file
```

## API Endpoints & Routes

### Backend API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup/` | Register new user | No |
| POST | `/auth/login/` | Login user | No |
| POST | `/auth/logout/` | Logout user | Yes |
| GET | `/auth/me/` | Get current user | Yes |

### Frontend Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Home/landing page | No |
| `/signup` | Sign Up page | No |
| `/login` | Sign In page | No |
| `/workspace` | Protected workspace | Yes |

### Coming in Slice 2

- Notes CRUD operations
- Categories management
- Note editor

## Design Reference

Figma Design: [Notes Taking App](https://www.figma.com/design/xZRv2eg3nnJgtmSVXNQKxs/Notes-Taking-App-Challenge--Copy-?node-id=0-1&p=f&m=dev)

The Figma design is the source of truth for:
- Layout and spacing
- Typography and colors
- Component states
- Interaction patterns

## Development Guidelines

This project follows established coding standards:

- **Backend:** See [.cursor/rules/django-backend.mdc](./.cursor/rules/django-backend.mdc)
- **Frontend:** See [.cursor/rules/nextjs-react.mdc](./.cursor/rules/nextjs-react.mdc)

## Testing Strategy

### Backend Testing

- Unit tests for models
- Integration tests for API endpoints
- Password and email validation tests
- Authentication flow tests

**Current Status:** 12/12 tests passing ✅

## Security Features

- Secure password hashing (PBKDF2)
- Session-based authentication
- CSRF protection
- HTTP-only cookies
- CORS configuration
- Input validation and sanitization

## Environment Configuration

The backend uses environment variables for configuration:

```bash
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
USE_IN_MEMORY_DB=False
```

Copy `.env.example` to `.env` and update as needed.

## Contributing

This is a take-home assignment project. Development follows the phased approach outlined in the specifications.

## License

This project is part of a take-home assignment for TurboAI.

---

**Current Status:** Slice 1 (Authentication Foundation) Complete ✅

**Both Servers Running:**
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

**Next Steps (Slice 2):** 
1. Notes CRUD functionality
2. Categories system
3. Note editor with autosave
