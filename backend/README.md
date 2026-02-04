# Notes App Backend

Django backend for the Notes App MVP.

## Tech Stack

- Python 3.12
- Django 4.2 LTS
- Django REST Framework
- SQLite (in-memory)

## Setup Instructions

### 1. Create Virtual Environment

```bash
python3.12 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration if needed.

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Seed Default Categories

```bash
python manage.py seed_categories
```

This creates the default categories: Random Thoughts, School, and Personal.

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /auth/signup/` - Register a new user
- `POST /auth/login/` - Log in an existing user
- `POST /auth/logout/` - Log out the current user
- `GET /auth/me/` - Get current user details

### Categories

- `GET /categories/` - List all categories (requires authentication)

### Example Requests

#### Sign Up

```bash
curl -X POST http://localhost:8000/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

#### Logout

```bash
curl -X POST http://localhost:8000/auth/logout/ \
  -H "Content-Type: application/json" \
  --cookie "sessionid=YOUR_SESSION_ID"
```

## Password Requirements

Passwords must meet the following criteria:
- At least 8 characters long
- Contains at least one uppercase letter
- Contains at least one lowercase letter
- Contains at least one number

## Development

### Running Tests

```bash
python manage.py test
```

### Code Style

This project follows PEP 8 guidelines with a 120 character line limit.

## CORS Configuration

CORS is configured to allow requests from `http://localhost:3000` by default.
Update `CORS_ALLOWED_ORIGINS` in `.env` to add more origins.

## Database

The application uses an in-memory SQLite database. Data will be lost when the server stops.
This is intentional for the MVP as specified in the requirements.
