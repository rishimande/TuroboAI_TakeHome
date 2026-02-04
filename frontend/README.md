# Notes App - Frontend

Next.js 15 frontend for the Notes Taking Application.

## Tech Stack

- React 18
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- date-fns

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page (redirects to signin)
│   ├── signup/            # Sign up page
│   ├── signin/            # Sign in page
│   └── workspace/         # Main notes workspace
│
├── components/
│   ├── auth/              # Authentication components
│   │   ├── signin-form.tsx
│   │   └── signup-form.tsx
│   ├── notes/             # Note-related components
│   │   ├── category-sidebar.tsx
│   │   ├── note-card.tsx
│   │   ├── note-editor.tsx
│   │   └── notes-grid.tsx
│   └── ui/                # Base UI components
│       ├── button.tsx
│       ├── input.tsx
│       └── textarea.tsx
│
├── lib/
│   ├── api.ts             # API client with Axios
│   ├── auth-context.tsx   # Authentication context
│   ├── design-tokens.ts   # Design system tokens
│   └── utils.ts           # Utility functions
│
└── types/
    └── index.ts           # TypeScript type definitions
```

## Features

### Authentication
- Sign up with email validation and password strength checking
- Sign in with session-based authentication
- Protected routes with automatic redirection

### Notes Workspace
- Category sidebar with note counts
- Responsive grid layout for note cards
- Category-based color theming
- Empty state with friendly message

### Note Editor
- Modal overlay with backdrop
- Category dropdown selector
- Autosave functionality (1s debounce)
- Real-time last edited timestamp
- Keyboard shortcuts (Escape to close)

### Design System
- Extracted Figma design tokens
- Custom fonts (Inria Serif, Inter)
- Category-based color schemes
- Consistent spacing and sizing

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Design Tokens

All design values are centralized in `lib/design-tokens.ts`:
- Colors (primary, category colors, backgrounds)
- Typography (fonts, sizes)
- Spacing
- Border radius
- Shadows

## Key Components

### AuthProvider
Provides authentication context throughout the app with user state management.

### CategorySidebar
Displays all categories with note counts and handles category filtering.

### NoteCard
Preview card for notes with category theming and truncated content.

### NoteEditor
Full-featured modal editor with:
- Autosave on typing
- Category change handling
- Close on backdrop click or Escape key
- Real-time save status indicator

## Utilities

### Date Formatting
- `formatFriendlyDate()` - Returns "today", "yesterday", or "Month Day"
- `formatLastEdited()` - Full timestamp format

### Validation
- `isValidEmail()` - Email format validation
- `validatePassword()` - Password strength checking

### Debounce
- `debounce()` - Function debouncing for autosave

## API Integration

The frontend uses Axios with:
- CSRF token handling
- Cookie-based sessions
- Automatic token extraction from cookies
- Error handling

## Responsive Design

- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly interactions
- Keyboard navigation support

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus visible states
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid and Flexbox
