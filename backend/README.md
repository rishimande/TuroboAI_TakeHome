# Notes App - Django Backend

Backend API for the Notes Taking Application built with Django 4.2 and Django REST Framework.

## Tech Stack

- Python 3.12
- Django 4.2 LTS
- Django REST Framework
- SQLite (in-memory database)
- Argon2 for password hashing

## Setup

1. Create a virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Populate default categories:
```bash
python manage.py populate_categories
```

6. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register a new user
- `POST /api/auth/login/` - Login with email and password
- `POST /api/auth/logout/` - Logout current user
- `GET /api/auth/me/` - Get current user info

### Categories
- `GET /api/categories/` - Get all categories with note counts

### Notes
- `GET /api/notes/` - Get all notes (supports `?categoryId=<uuid>` filter)
- `POST /api/notes/create/` - Create a new note
- `GET /api/notes/<uuid>/` - Get note details
- `PATCH /api/notes/<uuid>/update/` - Update a note

## Models

### User
- Custom user model using email as username
- Fields: id (UUID), email, password_hash, created_at, updated_at

### Category
- Fields: id (UUID), name, color (hex), sort_order
- Default categories: Random Thoughts, School, Personal

### Note
- Fields: id (UUID), user, category, title, content, created_at, updated_at, last_edited_at

## Password Requirements

Passwords must contain:
- At least one capital letter
- At least one lowercase letter
- At least one number
