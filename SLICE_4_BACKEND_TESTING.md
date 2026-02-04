# Slice 4 Backend Testing Guide

**Date:** February 4, 2026  
**Status:** ✅ All tests passing (27/27)

---

## Quick Test Summary

### Automated Tests

All tests are passing:

```bash
cd backend
source venv/bin/activate
python manage.py test notes
```

**Result:** 27 tests passed ✅

### Test Coverage

- ✅ Authentication and authorization
- ✅ Note creation with full data
- ✅ Note creation with defaults only
- ✅ Missing/invalid category validation
- ✅ Empty title handling
- ✅ Timestamp generation
- ✅ User isolation
- ✅ Category filtering
- ✅ List and detail endpoints

---

## Manual Testing with curl

### 1. Setup

Make sure the backend server is running:

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### 2. Create a Test User (if not exists)

```bash
curl -X POST http://localhost:8000/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }' \
  -c cookies.txt
```

### 3. Login (if needed)

```bash
curl -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }' \
  -c cookies.txt
```

### 4. Get CSRF Token

The CSRF token is automatically stored in cookies.txt. Extract it:

```bash
# On macOS/Linux
grep csrftoken cookies.txt | awk '{print $7}'
```

### 5. Get Categories

```bash
curl -X GET http://localhost:8000/categories/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Example response:**

```json
[
  {
    "id": "ac0f0d0a-38c9-4246-b745-f2931e63d3ca",
    "name": "Random Thoughts",
    "color": "#FFA07A",
    "sort_order": 1
  },
  {
    "id": "bf17fba2-5ad2-4096-9ecf-78aaf9bd51cb",
    "name": "School",
    "color": "#87CEEB",
    "sort_order": 2
  },
  {
    "id": "ee8d58d4-574e-4f81-9ae6-f34012c38600",
    "name": "Personal",
    "color": "#98FB98",
    "sort_order": 3
  }
]
```

### 6. Create a Note with Defaults

```bash
# Replace CSRF_TOKEN and CATEGORY_ID with actual values
curl -X POST http://localhost:8000/notes/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: YOUR_CSRF_TOKEN" \
  -b cookies.txt \
  -d '{
    "category": "CATEGORY_ID"
  }'
```

**Expected response (201 Created):**

```json
{
  "id": "new-note-uuid",
  "user": "user-uuid",
  "category": "category-uuid",
  "category_name": "Random Thoughts",
  "category_color": "#FFA07A",
  "title": "Note Title:",
  "content": "",
  "created_at": "2026-02-04T14:30:00.000000Z",
  "updated_at": "2026-02-04T14:30:00.000000Z",
  "last_edited_at": "2026-02-04T14:30:00.000000Z"
}
```

### 7. Create a Note with Custom Data

```bash
curl -X POST http://localhost:8000/notes/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: YOUR_CSRF_TOKEN" \
  -b cookies.txt \
  -d '{
    "category": "CATEGORY_ID",
    "title": "My First Note",
    "content": "This is the content of my note. I can write anything here!"
  }'
```

**Expected response (201 Created):**

```json
{
  "id": "new-note-uuid",
  "user": "user-uuid",
  "category": "category-uuid",
  "category_name": "Random Thoughts",
  "category_color": "#FFA07A",
  "title": "My First Note",
  "content": "This is the content of my note. I can write anything here!",
  "created_at": "2026-02-04T14:35:00.000000Z",
  "updated_at": "2026-02-04T14:35:00.000000Z",
  "last_edited_at": "2026-02-04T14:35:00.000000Z"
}
```

### 8. Verify Note Was Created

```bash
curl -X GET http://localhost:8000/notes/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

You should see your newly created note in the response.

---

## Error Testing

### Test 1: Create Note Without Authentication

```bash
curl -X POST http://localhost:8000/notes/ \
  -H "Content-Type: application/json" \
  -d '{
    "category": "CATEGORY_ID"
  }'
```

**Expected: 403 Forbidden**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Test 2: Create Note Without Category

```bash
curl -X POST http://localhost:8000/notes/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: YOUR_CSRF_TOKEN" \
  -b cookies.txt \
  -d '{
    "title": "Note Without Category"
  }'
```

**Expected: 400 Bad Request**

```json
{
  "category": ["This field is required."]
}
```

### Test 3: Create Note with Invalid Category

```bash
curl -X POST http://localhost:8000/notes/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: YOUR_CSRF_TOKEN" \
  -b cookies.txt \
  -d '{
    "category": "00000000-0000-0000-0000-000000000000"
  }'
```

**Expected: 400 Bad Request**

```json
{
  "category": ["Invalid pk \"00000000-0000-0000-0000-000000000000\" - object does not exist."]
}
```

---

## Python Testing Script

Create a file `test_create_note.py`:

```python
#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000"

def test_create_note():
    # Create session to maintain cookies
    session = requests.Session()
    
    # 1. Login
    print("1. Logging in...")
    login_response = session.post(
        f"{BASE_URL}/auth/login/",
        json={
            "email": "test@example.com",
            "password": "TestPass123"
        }
    )
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        print(login_response.json())
        return
    
    print("✅ Login successful")
    
    # 2. Get CSRF token
    csrf_token = session.cookies.get("csrftoken")
    print(f"CSRF Token: {csrf_token}")
    
    # 3. Get categories
    print("\n2. Getting categories...")
    categories_response = session.get(f"{BASE_URL}/categories/")
    categories = categories_response.json()
    
    if not categories:
        print("❌ No categories found. Run: python manage.py seed_categories")
        return
    
    category_id = categories[0]["id"]
    print(f"✅ Using category: {categories[0]['name']} ({category_id})")
    
    # 4. Create note with defaults
    print("\n3. Creating note with defaults...")
    note_response = session.post(
        f"{BASE_URL}/notes/",
        json={"category": category_id},
        headers={"X-CSRFToken": csrf_token}
    )
    
    if note_response.status_code == 201:
        note = note_response.json()
        print("✅ Note created successfully!")
        print(f"   ID: {note['id']}")
        print(f"   Title: {note['title']}")
        print(f"   Content: '{note['content']}'")
        print(f"   Category: {note['category_name']}")
    else:
        print(f"❌ Note creation failed: {note_response.status_code}")
        print(note_response.json())
        return
    
    # 5. Create note with custom data
    print("\n4. Creating note with custom data...")
    note_response = session.post(
        f"{BASE_URL}/notes/",
        json={
            "category": category_id,
            "title": "My Test Note",
            "content": "This is a test note created via Python script."
        },
        headers={"X-CSRFToken": csrf_token}
    )
    
    if note_response.status_code == 201:
        note = note_response.json()
        print("✅ Note created successfully!")
        print(f"   ID: {note['id']}")
        print(f"   Title: {note['title']}")
        print(f"   Content: {note['content'][:50]}...")
        print(f"   Category: {note['category_name']}")
    else:
        print(f"❌ Note creation failed: {note_response.status_code}")
        print(note_response.json())
        return
    
    # 6. List all notes
    print("\n5. Listing all notes...")
    notes_response = session.get(f"{BASE_URL}/notes/")
    notes = notes_response.json()
    print(f"✅ Found {len(notes)} notes")
    
    print("\n🎉 All tests completed successfully!")

if __name__ == "__main__":
    test_create_note()
```

Run the script:

```bash
cd backend
source venv/bin/activate
python3 test_create_note.py
```

---

## JavaScript/Fetch Testing

For frontend integration:

```javascript
// API client function
async function createNote(categoryId, title = null, content = null) {
  const response = await fetch('http://localhost:8000/notes/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    credentials: 'include',
    body: JSON.stringify({
      category: categoryId,
      ...(title !== null && { title }),
      ...(content !== null && { content }),
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return response.json();
}

// Usage examples
try {
  // Create with defaults
  const note1 = await createNote('category-uuid');
  console.log('Created note with defaults:', note1);
  
  // Create with custom data
  const note2 = await createNote(
    'category-uuid',
    'My Custom Title',
    'My custom content'
  );
  console.log('Created note with custom data:', note2);
} catch (error) {
  console.error('Failed to create note:', error);
}
```

---

## Database Verification

You can also verify notes were created in the database:

```bash
cd backend
source venv/bin/activate
python manage.py shell
```

```python
from notes.models import Note
from users.models import User

# Get the test user
user = User.objects.get(email="test@example.com")

# List all notes for this user
notes = Note.objects.filter(user=user)
print(f"Total notes: {notes.count()}")

for note in notes:
    print(f"- {note.title} (Category: {note.category.name})")
```

---

## Seeding Test Data

If you need to create test notes for development:

```bash
cd backend
source venv/bin/activate

# Seed categories first (if not done)
python manage.py seed_categories

# Seed sample notes
python manage.py seed_notes --email test@example.com --password TestPass123
```

---

## Common Issues and Solutions

### Issue 1: CSRF Token Missing

**Error:** `403 Forbidden - CSRF token missing or incorrect`

**Solution:** Make sure to:
1. Include the CSRF token in the `X-CSRFToken` header
2. Send cookies with the request (`credentials: 'include'` in fetch)

### Issue 2: Session Cookie Missing

**Error:** `403 Forbidden - Authentication credentials were not provided`

**Solution:** Make sure to:
1. Login first to get session cookie
2. Include cookies in subsequent requests

### Issue 3: Category Doesn't Exist

**Error:** `400 Bad Request - Invalid pk - object does not exist`

**Solution:** 
1. Run `python manage.py seed_categories` to create default categories
2. Use a valid category UUID from the categories endpoint

---

## Next Steps

Backend is complete and ready for frontend integration. Frontend team can now:

1. Implement "+ New Note" button
2. Create Note Editor modal/component
3. Call `POST /notes/` endpoint to create notes
4. Update notes grid after creation
5. Implement autosave (will need PATCH endpoint - Slice 5)

---

## Summary

✅ POST /notes/ endpoint is fully functional  
✅ All 27 tests passing  
✅ Proper authentication and authorization  
✅ Default values working correctly  
✅ Validation and error handling in place  
✅ Ready for frontend integration  
