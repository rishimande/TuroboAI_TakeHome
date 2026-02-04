# Notes App - Category-Based Note Taking Application

A beautiful, minimal note-taking application with category-based organization and autosave functionality.

## Tech Stack

### Backend
- Python 3.12
- Django 4.2 LTS
- Django REST Framework
- SQLite (in-memory database)
- Argon2 password hashing

### Frontend
- React 18
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Axios for API calls

## Project Structure

```
.
├── backend/          # Django backend API
│   ├── accounts/     # User authentication app
│   ├── notes/        # Notes and categories app
│   ├── notes_project/  # Django project settings
│   └── manage.py
│
└── frontend/         # Next.js frontend
    ├── app/          # Next.js app router pages
    ├── components/   # React components
    ├── lib/          # Utilities and API client
    └── types/        # TypeScript type definitions
```

## Architecture Decision: Monorepo

This project uses a monorepo structure, keeping both the backend and frontend in a single repository. This architectural decision comes with important tradeoffs:

### Tradeoffs of Monorepo

**Benefits:**
- Simplified coordination between frontend and backend changes
- Easier to maintain consistency across the full stack
- Single source of truth for the entire application
- Simplified dependency management and versioning
- Better visibility into how changes affect the entire system

**Drawbacks:**
- Can become unwieldy as team size grows
- More complex CI/CD pipelines
- Potential for tighter coupling between services
- Larger repository size and longer clone times
- More difficult to set up granular access controls

### Why Monorepo for This Project

For large teams and complex projects, **separating the backend and frontend into distinct repositories is generally beneficial**. It allows teams to:
- Work independently with clear boundaries
- Deploy services on different schedules
- Scale team access and permissions appropriately
- Maintain cleaner separation of concerns

However, for this demonstration project, the monorepo approach was chosen for several key reasons:

1. **Single Developer Context**: As a solo developer, the coordination overhead of multiple repositories outweighs the benefits
2. **Cursor AI Agent Integration**: The monorepo structure provides significant advantages when working with Cursor's coding agent. By having both backend and frontend in the same repository, the AI agent has simultaneous exposure to both codebases, enabling it to:
   - Understand the full context of API contracts and their implementations
   - Make coordinated changes across the stack
   - Maintain consistency between frontend types and backend models
   - Suggest improvements that consider both ends of the system
3. **Rapid Prototyping**: For a demo project, the ability to quickly iterate across the full stack without repository switching accelerates development

## Development Methodology: AI-Assisted Incremental Development

This project was built using an AI-assisted development workflow optimized for working with Cursor's coding agent. The methodology emphasizes careful planning, incremental implementation, and manageable context windows.

### Specification-First Approach

The first critical step was creating a comprehensive specification document ([`specifications.md`](./specifications.md)) that details:
- Complete feature requirements
- API endpoint specifications with request/response schemas
- Frontend component hierarchy and props
- Design system tokens and styling guidelines
- Data models and relationships
- User flows and edge cases

This detailed specification serves as the single source of truth and provides the AI agent with complete context about the project's requirements, reducing ambiguity and improving code generation quality.

### Slice-Based Implementation

Rather than attempting to build the entire application at once, the project was broken down into logical, self-contained slices of work. This approach offers several advantages for AI-assisted development:

**Benefits of Slice-Based Development:**
- **Manageable Context Windows**: Each slice fits comfortably within the AI agent's context, allowing it to consider all relevant code
- **Faster Feedback Loops**: Smaller increments mean quicker testing and validation of each feature
- **Reduced Complexity**: Focusing on one slice at a time minimizes the cognitive load and reduces the chance of conflicts
- **Better Error Isolation**: Issues are easier to identify and fix when changes are incremental
- **Clear Progress Tracking**: Each completed slice represents tangible progress

### Slice Implementation Order

The project was built in the following sequence:

1. ✅ **Slice 1:** Project Setup & Authentication
   - Django backend setup
   - Next.js frontend setup
   - User authentication (signup, login, logout)
   - Session management

2. ✅ **Slice 2:** Category System
   - Backend: Category model, API endpoints, seeding
   - Frontend: Workspace layout, categories sidebar

3. ✅ **Slice 3:** Notes Functionality
   - Notes CRUD operations
   - Note editor with autosave
   - Category-based filtering
   - Note preview cards

4. ✅ **Slice 4:** Polish & Refinements
   - Empty states
   - Loading states
   - Error boundaries
   - Responsive design
   - Performance optimizations

Each slice was fully implemented and tested before moving to the next, ensuring a stable foundation at every stage. This incremental approach, combined with the detailed specifications and monorepo structure, created an optimal environment for AI-assisted development.

## Figma MCP Integration: Design-to-Code Workflow

To further enhance development speed and accuracy, this project leveraged Figma's Model Context Protocol (MCP) integration with Cursor. This allowed the AI agent to directly access design specifications from Figma, reducing the manual translation between design and code.

### Setup Process

The project was based on a public Figma design file that needed to be duplicated into my personal Figma workspace. This duplication step was necessary to:
- Enable **Dev Mode** on the file, which is required for MCP access
- Allow Cursor's AI agent to query design specifications, measurements, and styling details directly from Figma
- Maintain a stable reference as the implementation progressed

### Working with the Design File

The Figma design file had a mixed quality in terms of developer handoff:

**Challenges:**
The file lacked Figma **variables** for key design tokens, which would have made the handoff much smoother. Specifically, it was missing:
- Font family and size variables
- Spacing/gap variables
- Border radius variables
- Dimension (width/height) variables
- Color system variables

Without these variables, the MCP couldn't extract a systematic design token structure, requiring more manual interpretation of values across different components.

**Strengths:**
Despite the lack of variables, the design file made **extensive use of Auto Layout**, which proved invaluable:
- Auto Layout provided clear spacing and alignment information
- Flexbox-like structure translated naturally to CSS Flexbox/Grid

### Impact on Development

The Figma MCP integration, even with the file's limitations, provided significant benefits:
- **Faster Implementation**: Direct access to measurements eliminated guesswork
- **Improved Accuracy**: Spacing, sizing, and layout matched the design more precisely
- **Reduced Context Switching**: The AI agent could reference Figma without manual measurement extraction
- **Better Design Consistency**: Auto Layout structures guided the implementation of responsive behaviors

This integration demonstrates the potential of design-to-code workflows, while also highlighting the importance of proper design token setup (variables) for optimal AI-assisted development.

## Features

- **User Authentication**: Secure sign up and sign in with email/password
- **Category Organization**: Pre-defined categories (Random Thoughts, School, Personal)
- **Note Management**: Create, edit, and organize notes
- **Autosave**: Automatic debounced saving while typing
- **Category Theming**: Visual color theming based on note category
- **Responsive Design**: Works on desktop and tablet devices
- **Empty States**: Friendly empty state messages
- **Keyboard Accessible**: Full keyboard navigation support

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Run migrations and populate categories:
```bash
python manage.py migrate
python manage.py populate_categories
```

6. Start the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Design

The design is based on Figma specifications with exact:
- Color schemes and category theming
- Typography (Inria Serif for headings, Inter for body)
- Spacing and layout measurements
- Component states (hover, focus, active)
- Empty states and illustrations

Figma Design: [View Design](https://www.figma.com/design/xZRv2eg3nnJgtmSVXNQKxs/Notes-Taking-App-Challenge--Copy-)

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/me/` - Get current user

### Categories
- `GET /api/categories/` - List all categories with note counts

### Notes
- `GET /api/notes/` - List all notes (with optional `?categoryId=` filter)
- `POST /api/notes/create/` - Create a new note
- `GET /api/notes/<id>/` - Get note details
- `PATCH /api/notes/<id>/update/` - Update a note

## Password Requirements

Passwords must contain:
- At least one capital letter
- At least one lowercase letter
- At least one number

## Development Notes

- Backend uses session-based authentication with CSRF protection
- Frontend uses Axios with credentials for cookie-based auth
- Autosave debounces at 1 second for performance
- All design tokens are centralized in `frontend/lib/design-tokens.ts`
- Category colors are dynamically applied based on selection

## License

This project is for demonstration purposes.