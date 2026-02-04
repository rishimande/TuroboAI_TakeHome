# Quick Start Guide

Get the Notes App running in 3 minutes!

## Prerequisites

- Python 3.12+ installed
- Node.js 18+ installed
- Terminal/Command Line

## Step 1: Start the Backend (Terminal 1)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and populate default categories
python manage.py migrate
python manage.py populate_categories

# Start Django server
python manage.py runserver
```

Backend will be running at: http://localhost:8000

## Step 2: Start the Frontend (Terminal 2)

```bash
# Navigate to frontend directory (open a NEW terminal)
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Frontend will be running at: http://localhost:3000

## Step 3: Use the App

1. Open your browser to http://localhost:3000
2. Click "Oops! I've never been here before" to sign up
3. Create an account with:
   - Valid email format
   - Password with at least: 1 capital letter, 1 lowercase letter, 1 number
4. You'll be redirected to the Notes Workspace
5. Click "+ New Note" to create your first note
6. Select a category (Random Thoughts, School, or Personal)
7. Start typing - it autosaves!

## Features to Try

- ✏️ **Create Notes**: Click "+ New Note" button
- 📁 **Filter by Category**: Click categories in the sidebar
- 🎨 **Category Theming**: Watch the colors change based on category
- 💾 **Autosave**: Type in the editor - it saves automatically
- 🔍 **Browse Notes**: Click any note card to edit it
- ⌨️ **Keyboard Shortcuts**: Press `Escape` to close the editor

## Default Categories

The app comes with 3 pre-configured categories:
- 🟢 Random Thoughts (Teal color)
- 🟡 School (Yellow-green color)
- 🟣 Personal (Purple color)

## Troubleshooting

### Backend won't start
- Make sure you're in the virtual environment (`source venv/bin/activate`)
- Check Python version: `python3 --version` (should be 3.12+)
- Try: `pip install --upgrade pip` then reinstall requirements

### Frontend won't start
- Check Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure port 3000 is not in use

### Can't sign up/in
- Verify the backend is running at http://localhost:8000
- Check the browser console for errors
- Make sure your password meets requirements (1 capital, 1 lowercase, 1 number)

### CORS errors
- Ensure backend is running on port 8000
- Ensure frontend is running on port 3000
- Check that `.env` files are properly configured

## Development Tips

- Backend admin interface: http://localhost:8000/admin (create superuser first)
- API documentation: See README.md for all endpoints
- Frontend hot reloads automatically on code changes
- Backend requires manual restart after code changes

## Next Steps

- Read the main README.md for detailed documentation
- Explore the Figma design file for UI specifications
- Check individual backend/frontend READMEs for architecture details

Enjoy building your notes! 📝✨
