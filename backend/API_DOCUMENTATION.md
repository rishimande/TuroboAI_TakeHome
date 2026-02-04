# API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

All authentication endpoints use session-based authentication with cookies.

### Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup/`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Success Response (201 Created):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "40890d3c-342c-406a-b1ee-f73d076c07ba",
    "email": "user@example.com",
    "created_at": "2026-02-04T13:41:33.677592Z",
    "updated_at": "2026-02-04T13:41:33.677808Z"
  }
}
```

**Error Responses:**

```json
// Invalid email format
{
  "email": ["Enter a valid email address."]
}

// Email already exists
{
  "email": ["A user with this email already exists."]
}

// Weak password
{
  "password": ["The password must contain at least one uppercase letter."]
}
```

---

### Sign In

Log in an existing user.

**Endpoint:** `POST /auth/login/`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "40890d3c-342c-406a-b1ee-f73d076c07ba",
    "email": "user@example.com",
    "created_at": "2026-02-04T13:41:33.677592Z",
    "updated_at": "2026-02-04T13:41:33.677808Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "non_field_errors": ["Unable to log in with provided credentials."]
}
```

---

### Sign Out

Log out the current user.

**Endpoint:** `POST /auth/logout/`

**Headers Required:**
- `X-CSRFToken`: CSRF token from cookie

**Success Response (200 OK):**

```json
{
  "message": "Logout successful"
}
```

**Error Response (403 Forbidden):**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### Get Current User

Get details of the currently authenticated user.

**Endpoint:** `GET /auth/me/`

**Headers Required:**
- Session cookie must be present

**Success Response (200 OK):**

```json
{
  "id": "40890d3c-342c-406a-b1ee-f73d076c07ba",
  "email": "user@example.com",
  "created_at": "2026-02-04T13:41:33.677592Z",
  "updated_at": "2026-02-04T13:41:33.677808Z"
}
```

**Error Response (403 Forbidden):**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Categories

### List Categories

Get all categories ordered by sort_order.

**Endpoint:** `GET /categories/`

**Headers Required:**
- Session cookie must be present (user must be authenticated)

**Success Response (200 OK):**

```json
[
  {
    "id": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca",
    "name": "Random Thoughts",
    "color": "#FFA07A",
    "sort_order": 1,
    "created_at": "2026-02-04T13:55:15.408462Z",
    "updated_at": "2026-02-04T13:55:15.408543Z"
  },
  {
    "id": "bf17fba2-5ad2-4096-9ecf-78aaf9bd51cb",
    "name": "School",
    "color": "#87CEEB",
    "sort_order": 2,
    "created_at": "2026-02-04T13:55:15.409561Z",
    "updated_at": "2026-02-04T13:55:15.409570Z"
  },
  {
    "id": "ee8d58d4-574e-4f81-9ae6-f34012c38600",
    "name": "Personal",
    "color": "#98FB98",
    "sort_order": 3,
    "created_at": "2026-02-04T13:55:15.411140Z",
    "updated_at": "2026-02-04T13:55:15.411149Z"
  }
]
```

**Error Response (403 Forbidden):**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Notes

### List Notes

Get all notes for the authenticated user, with optional category filtering.

**Endpoint:** `GET /notes/`

**Headers Required:**
- Session cookie must be present (user must be authenticated)

**Query Parameters:**
- `categoryId` (optional): UUID of category to filter by

**Success Response (200 OK):**

```json
[
  {
    "id": "f7b3c8e1-4a5d-4e3b-8c9d-1a2b3c4d5e6f",
    "category": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca",
    "category_name": "Random Thoughts",
    "category_color": "#FFA07A",
    "title": "Meeting Notes",
    "content": "Discussed project timeline and deliverables...",
    "created_at": "2026-02-04T12:00:00.000000Z",
    "last_edited_at": "2026-02-04T14:00:00.000000Z"
  },
  {
    "id": "a8c9d1e2-5b6c-4f7d-9e8a-2b3c4d5e6f7g",
    "category": "ee8d58d4-574e-4f81-9ae6-f34012c38600",
    "category_name": "Personal",
    "category_color": "#98FB98",
    "title": "Weekend Plans",
    "content": "Things to do this weekend...",
    "created_at": "2026-02-04T10:00:00.000000Z",
    "last_edited_at": "2026-02-04T11:00:00.000000Z"
  }
]
```

**Error Response (403 Forbidden):**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Example with Category Filter:**

```bash
curl -X GET "http://localhost:8000/notes/?categoryId=ac0f0d0a-38c9-4246-b745-f2931e63d3ca" \
  -H "Cookie: sessionid=..." \
  -H "Content-Type: application/json"
```

---

### Get Note Detail

Retrieve a single note by ID.

**Endpoint:** `GET /notes/{id}/`

**Headers Required:**
- Session cookie must be present (user must be authenticated)

**URL Parameters:**
- `id` (required): UUID of the note

**Success Response (200 OK):**

```json
{
  "id": "f7b3c8e1-4a5d-4e3b-8c9d-1a2b3c4d5e6f",
  "user": "40890d3c-342c-406a-b1ee-f73d076c07ba",
  "category": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca",
  "category_name": "Random Thoughts",
  "category_color": "#FFA07A",
  "title": "Meeting Notes",
  "content": "Discussed project timeline and deliverables. Key points:\n- Launch date: End of Q2\n- Need to finalize design mockups\n- Schedule follow-up meeting next week",
  "created_at": "2026-02-04T12:00:00.000000Z",
  "updated_at": "2026-02-04T14:00:00.000000Z",
  "last_edited_at": "2026-02-04T14:00:00.000000Z"
}
```

**Error Responses:**

```json
// Note not found or doesn't belong to user (404 Not Found)
{
  "detail": "Not found."
}

// Not authenticated (403 Forbidden)
{
  "detail": "Authentication credentials were not provided."
}
```

---

### Create Note

Create a new note for the authenticated user.

**Endpoint:** `POST /notes/`

**Headers Required:**
- Session cookie must be present (user must be authenticated)
- `X-CSRFToken`: CSRF token from cookie

**Request Body:**

```json
{
  "category": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca",
  "title": "My New Note",
  "content": "This is the content of my new note."
}
```

**Fields:**
- `category` (required): UUID of the category for this note
- `title` (optional): Note title. Defaults to "Note Title:" if not provided
- `content` (optional): Note content. Defaults to empty string if not provided

**Success Response (201 Created):**

```json
{
  "id": "b9d4e5f6-7c8d-4e9a-0b1c-2d3e4f5a6b7c",
  "user": "40890d3c-342c-406a-b1ee-f73d076c07ba",
  "category": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca",
  "category_name": "Random Thoughts",
  "category_color": "#FFA07A",
  "title": "My New Note",
  "content": "This is the content of my new note.",
  "created_at": "2026-02-04T15:30:00.000000Z",
  "updated_at": "2026-02-04T15:30:00.000000Z",
  "last_edited_at": "2026-02-04T15:30:00.000000Z"
}
```

**Error Responses:**

```json
// Missing category (400 Bad Request)
{
  "category": ["This field is required."]
}

// Invalid category ID (400 Bad Request)
{
  "category": ["Invalid pk \"invalid-uuid\" - object does not exist."]
}

// Not authenticated (403 Forbidden)
{
  "detail": "Authentication credentials were not provided."
}
```

**Example with Default Values:**

Create a note with only a category (title and content will use defaults):

```json
{
  "category": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca"
}
```

Response:

```json
{
  "id": "c1d2e3f4-8a9b-4c5d-6e7f-8a9b0c1d2e3f",
  "user": "40890d3c-342c-406a-b1ee-f73d076c07ba",
  "category": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca",
  "category_name": "Random Thoughts",
  "category_color": "#FFA07A",
  "title": "Note Title:",
  "content": "",
  "created_at": "2026-02-04T15:35:00.000000Z",
  "updated_at": "2026-02-04T15:35:00.000000Z",
  "last_edited_at": "2026-02-04T15:35:00.000000Z"
}
```

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (default Next.js frontend)

To add more origins, update the `CORS_ALLOWED_ORIGINS` environment variable in `.env`.

---

## CSRF Protection

CSRF protection is enabled for state-changing operations (POST, PUT, PATCH, DELETE).

The frontend should:
1. Make a GET request to any endpoint to receive the CSRF token in cookies
2. Include the CSRF token in the `X-CSRFToken` header for POST/PUT/PATCH/DELETE requests

Example with fetch:

```javascript
// Get CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Make authenticated request
fetch('http://localhost:8000/auth/logout/', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'),
  },
});
```

---

## Error Handling

All error responses follow a consistent format:

**Validation Errors (400 Bad Request):**

```json
{
  "field_name": ["Error message 1", "Error message 2"]
}
```

**Authentication Errors (401/403):**

```json
{
  "detail": "Error message"
}
```

**Server Errors (500):**

```json
{
  "detail": "Internal server error"
}
```

---

## Development Notes

### Database

The backend uses SQLite. By default, it uses a file-based database (`db.sqlite3`) for development.

To use an in-memory database (data will be lost on server restart):
- Set `USE_IN_MEMORY_DB=True` in `.env`

### Testing

Run the test suite:

```bash
# Test authentication
python manage.py test users

# Test categories
python manage.py test categories

# Test notes
python manage.py test notes

# Test all
python manage.py test
```

### Seeding Data

Seed default categories:

```bash
python manage.py seed_categories
```

Seed sample notes for testing:

```bash
# Create notes for default test user (test@example.com)
python manage.py seed_notes

# Create notes for a specific user
python manage.py seed_notes --email user@example.com --password Password123
```

### Admin Interface

Access the Django admin at `http://localhost:8000/admin/`

Create a superuser:

```bash
python manage.py createsuperuser
```
