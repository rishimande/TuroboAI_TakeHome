# Notes App Frontend

Next.js 15 frontend for the Notes App with TypeScript and Tailwind CSS.

## Tech Stack

- **Next.js:** 15.x (App Router)
- **React:** 18.x
- **TypeScript:** Latest
- **Tailwind CSS:** Latest
- **Form Handling:** React Hook Form + Zod
- **API Client:** Axios

## Features

### ✅ Slice 1 - Authentication (Complete)

- Sign Up page with validation
- Sign In page
- Protected workspace route
- Form validation (email format, password requirements)
- API integration with Django backend
- Session-based authentication with cookies
- CSRF token handling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── signup/            # Sign Up page
│   ├── login/             # Sign In page
│   └── workspace/         # Protected workspace
├── components/            # Reusable components
│   └── ui/               # UI components
│       ├── button.tsx
│       └── input.tsx
├── lib/                   # Utilities and services
│   ├── api-client.ts     # API service
│   ├── validations.ts    # Form schemas
│   └── utils.ts          # Utility functions
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

## Available Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Home page | No |
| `/signup` | User registration | No |
| `/login` | User login | No |
| `/workspace` | Notes workspace | Yes |

## Form Validation

### Sign Up

**Email:**
- Required field
- Valid email format

**Password:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

### Sign In

**Email:**
- Required field
- Valid email format

**Password:**
- Required field

## API Integration

The frontend communicates with the Django backend using Axios with the following features:

- Session-based authentication with cookies
- Automatic CSRF token handling
- Error handling and display
- Request/response interceptors

### API Endpoints Used

- `POST /auth/signup/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/logout/` - User logout
- `GET /auth/me/` - Get current user

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Key Libraries

- **axios** - HTTP client for API requests
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **@hookform/resolvers** - Form validation integration
- **tailwind-merge** - Tailwind class merging
- **clsx** - Conditional className utility

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Design System

The app uses a clean, modern design with:

- **Colors:** Blue primary, neutral grays
- **Typography:** System fonts with -apple-system fallback
- **Spacing:** Consistent padding and margins
- **Responsive:** Mobile-first approach

## Authentication Flow

1. User fills out sign up/login form
2. Frontend validates input using Zod schemas
3. Request sent to Django backend with credentials
4. Backend returns session cookie on success
5. Frontend stores session cookie automatically
6. Protected routes check authentication status
7. Redirects to login if not authenticated

## Error Handling

The app handles errors gracefully:

- Form validation errors shown inline
- Server errors displayed above forms
- Network errors caught and displayed
- Redirects on authentication failures

## Next Steps (Slice 2+)

- Notes CRUD functionality
- Categories sidebar
- Note editor with autosave
- Category filtering
- Empty states
- Loading states

## Styling Guidelines

- Use Tailwind CSS utility classes
- Mobile-first responsive design
- Consistent color palette
- Accessible focus states
- Smooth transitions

## Code Style

- TypeScript for all files
- Functional components
- Named exports for components
- Interfaces over types
- Descriptive variable names
- Comments for complex logic

## Testing

To test the authentication flow:

1. Start the backend server (`cd backend && python manage.py runserver`)
2. Start the frontend server (`npm run dev`)
3. Navigate to `http://localhost:3000`
4. Click "Get Started" or "Sign In"
5. Create an account or log in
6. Verify redirect to workspace

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a take-home assignment for TurboAI.
