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

# Test all
python manage.py test
```

### Admin Interface

Access the Django admin at `http://localhost:8000/admin/`

Create a superuser:

```bash
python manage.py createsuperuser
```
