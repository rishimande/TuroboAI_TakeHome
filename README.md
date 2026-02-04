# Notes App - TurboAI Take-Home

A category-based notes web application built with Django and Next.js.

## Project Status

- ✅ **Slice 1:** Authentication Foundation - Complete
- ✅ **Slice 2:** Category System - Complete (Backend + Frontend)
- 📋 **Slice 3:** Notes Functionality - Pending

## Tech Stack

### Backend
- Python 3.12
- Django 4.2 LTS
- Django REST Framework
- SQLite Database

### Frontend
- Next.js 15 (App Router)
- React 18.x
- TypeScript 5.x
- Tailwind CSS 3.x

## Quick Start

### Backend

```bash
cd backend

# Setup (first time only)
./setup.sh

# Or manually
source venv/bin/activate
python manage.py migrate
python manage.py seed_categories
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

## Features Implemented

### Authentication (Slice 1)
- User registration with email validation
- Password validation (uppercase, lowercase, number required)
- Session-based authentication
- Protected routes
- Login/Logout functionality

### Categories (Slice 2)
**Backend:**
- Category model with UUID, name, color, sort_order
- Three default categories seeded:
  - Random Thoughts (#FFA07A)
  - School (#87CEEB)
  - Personal (#98FB98)
- GET /categories/ API endpoint
- Authentication required for access
- Comprehensive test coverage

**Frontend:**
- Authenticated workspace layout with sidebar
- Categories sidebar component
- "All Categories" view
- Category color indicators
- Category selection and filtering
- Empty state component

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup/` | Register new user | No |
| POST | `/auth/login/` | Login user | No |
| POST | `/auth/logout/` | Logout user | Yes |
| GET | `/auth/me/` | Get current user | Yes |
| GET | `/categories/` | List all categories | Yes |

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate

# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users      # 12 tests
python manage.py test categories  # 8 tests
```

**Current Status:** ✅ 20/20 tests passing

### Frontend

```bash
cd frontend
npm run lint
```

## Documentation

- **Project Specifications:** [specifications.md](./specifications.md)
- **Backend API:** [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
- **Backend Setup:** [backend/README.md](./backend/README.md)
- **Frontend Setup:** [frontend/README.md](./frontend/README.md)
- **Slice 1 Completion:** [SLICE_1_COMPLETE.md](./SLICE_1_COMPLETE.md)
- **Slice 2 Completion:** [SLICE_2_COMPLETE.md](./SLICE_2_COMPLETE.md)
- **Slice 2 Backend Details:** [SLICE_2_BACKEND_COMPLETE.md](./SLICE_2_BACKEND_COMPLETE.md)
- **Slice 2 Frontend Details:** [SLICE_2_FRONTEND_COMPLETE.md](./SLICE_2_FRONTEND_COMPLETE.md)

## Development Workflow

### Slice Implementation Order

1. ✅ **Slice 1:** Project Setup & Authentication
   - Django backend setup
   - Next.js frontend setup
   - User authentication (signup, login, logout)
   - Session management

2. ✅ **Slice 2:** Category System
   - Backend: Category model, API endpoints, seeding
   - Frontend: Workspace layout, categories sidebar

3. 📋 **Slice 3:** Notes Functionality (Planned)
   - Notes CRUD operations
   - Note editor with autosave
   - Category-based filtering
   - Note preview cards

4. 📋 **Slice 4:** Polish & Refinements (Planned)
   - Empty states
   - Loading states
   - Error boundaries
   - Responsive design
   - Performance optimizations

## Project Structure

```
TurboAI_TakeHome/
├── backend/                      # Django Backend
│   ├── config/                  # Project settings
│   ├── users/                   # Authentication app ✅
│   ├── categories/              # Categories app ✅
│   ├── requirements.txt
│   └── README.md
│
├── frontend/                    # Next.js Frontend
│   ├── app/                    # App Router pages
│   │   ├── login/              # Login page ✅
│   │   ├── signup/             # Signup page ✅
│   │   └── workspace/          # Workspace page ✅
│   ├── components/             # React components
│   │   ├── ui/                 # UI components ✅
│   │   └── workspace/          # Workspace components ✅
│   ├── lib/                    # Utilities ✅
│   └── package.json
│
├── specifications.md           # Product requirements
├── README.md                  # This file
└── *.md                       # Completion documents
```

## Environment Configuration

### Backend (.env)
```bash
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
USE_IN_MEMORY_DB=False
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Contributing Guidelines

### Code Style

**Backend (Python):**
- Follow PEP 8 (120 character line limit)
- Use double quotes for strings
- Use f-strings for formatting
- Add docstrings to all classes and functions

**Frontend (TypeScript/React):**
- Follow Next.js conventions
- Use TypeScript for type safety
- Use functional components with hooks
- Use Tailwind CSS for styling

### Testing Requirements

- All new features must include tests
- Tests must pass before merging
- Aim for high code coverage
- Test both positive and negative cases

## Security

- Session-based authentication with HTTP-only cookies
- CSRF protection enabled
- Password hashing with PBKDF2
- Input validation on both frontend and backend
- CORS configured for frontend origin

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a take-home assignment for TurboAI.

## Design Reference

Figma Design: [Notes Taking App](https://www.figma.com/design/xZRv2eg3nnJgtmSVXNQKxs/Notes-Taking-App-Challenge--Copy-?node-id=0-1&p=f&m=dev)

---

**Last Updated:** February 4, 2026
