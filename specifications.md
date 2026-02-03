# Notes App — Product Specification

> Version: 0.1  
> Status: MVP  

---

## 1. Overview

This document defines the functional and technical requirements for a **category-based notes web application**.

The product focuses on:
- Fast note capture
- Simple organization via categories
- A clean, calming, category-themed UI

Tech Stack:
- Backend: Python 3.12 and Django 4.2 LTS
- Front-end: React 18.x and NextJS 15
- Database: in-memory SQLite

The scope is intentionally minimal to support rapid MVP development.

---

## 2. Goals & Principles

- Fast note creation with minimal friction
- Clear separation of notes by category
- Autosave by default (no explicit save button)
- Simple, calming UI with category-based color theming
- Single-user, single-workspace per account
- No collaboration features in MVP

---

## Design Source of Truth

The Figma design files are the canonical source for:
- Layout
- Spacing
- Typography
- Colors
- Component states
- Empty states
- Interaction affordances

Where this specification conflicts with Figma, Figma takes precedence.
FIGMA DESIGN LINK: https://www.figma.com/design/xZRv2eg3nnJgtmSVXNQKxs/Notes-Taking-App-Challenge--Copy-?node-id=0-1&p=f&m=dev

Frontend components must map 1:1 with Figma components where possible.
Reusable components should mirror Figma component structure and variants.

Design tokens (colors, typography, spacing, radii) should be derived from
Figma styles and exposed as reusable variables in code.
Hardcoded visual values should be avoided.

---

## 4. User Authentication

### 4.1 Sign Up

#### Screen Elements
- Headline “Yay, New Friend!”
- Email input
- Password input
- Primary CTA: **Sign Up**
- Secondary CTA: Link to Sign In (“We’re already friends!”)
- Refer to corresponding Figma screens for exact layout and copy.

#### Requirements
- Email format validation
- Password required (minimum constraints: 1. at least one capital aphabet, 2. at least one small alphabet, 3. at least one number)
- On successful signup, redirect user to Notes Workspace

---

### 4.2 Sign In (Implied)

- Standard email + password login
- Successful login lands user in Notes Workspace
- Refer to corresponding Figma screens for exact layout and copy.

---

## 5. Notes Workspace

### 5.1 Layout

#### Main Regions
- Categories sidebar (fixed width, per Figma)
- Notes grid, where notes are displayed as preview cards (responsive, per Figma breakpoints)
- Primary action button (+ New Note), placement per Figma
- Refer to corresponding Figma screens for exact layout and copy.

---

### 5.2 Preview cards
- notes are displayed in the workspace as preview crads, with each card having:
- Date
- Category
- Note Title
- Note Content
- If note content does not fit in the preview crad, it needs to be truncated

---

### 5.3 Categories Sidebar

#### Default Categories
- Random Thoughts
- School
- Personal
- The above default categories need to be added to the in-memory SQLite DB

#### Category Item
- Category name
- Note count per category
- Color indicator

#### Behavior
- Clicking a category filters the notes grid
- “All Categories” resets the filter
- Note counts update dynamically

---

### 5.4 Empty State
Empty state layouts and copy must exactly match Figma designs.
Copy should not be modified without design approval.


---

### 5.5 Notes Grid

#### Note Card Contents
- Friendly date label:
  - `today`
  - `yesterday`
  - or formatted date (e.g. `June 10`)
- Category name
- Note title
- Short content preview

#### Behavior
- Notes displayed in a responsive grid
- Clicking a note opens the Note Editor

Typography (font family, sizes, weights, line heights) must match Figma text styles.
Text truncation behavior (single-line vs multi-line) must follow Figma definitions.

---

## 6. Note Editor

### 6.1 Presentation

Editor behavior (panel vs modal), animation, backdrop, and scroll behavior
must follow Figma:
- Opening animation
- Closing interaction
- Background scroll lock behavior

---

### 6.2 Editor Fields

- Category dropdown (required)
- Title input
- Body text area
- Last Edited timestamp (read-only)

---

### 6.3 Category-Based Theming

- Each category has an associated color
- Note cards and editor background reflect category color
- Theme updates immediately when category changes

---

### 6.4 Autosave Behavior

- No explicit Save button
- Notes autosave using a debounced strategy
- Autosave triggered by:
  - User typing (debounced)
  - Category change
  - Closing the editor

---

### 6.5 Create vs Edit Behavior

#### New Note
- Opened via **+ New Note**
- Either:
  - Created immediately with deafult fields (title: "Note Title:", content: empty)

#### Existing Note
- Opens with full title and content
- Changes overwrite existing state
- `last_edited_at` updates on each save

---

## 7. Core User Flows

### 7.1 Sign Up → Workspace
1. User signs up
2. User is redirected to Notes Workspace
3. Empty state shown if no notes exist

---

### 7.2 Create Note
1. User clicks **+ New Note**
2. Note Editor opens with default category
3. User enters title and content
4. Note autosaves
5. Closing editor returns to grid with new note visible

---

### 7.3 Browse & Filter Notes
1. User selects a category in sidebar
2. Notes grid filters to selected category
3. “All Categories” shows all notes

---

### 7.4 Edit Existing Note
1. User clicks an existing note card
2. Note Editor opens with content loaded
3. User edits title, content, or category
4. Changes autosave
5. Closing editor updates the grid

---

## 8. Data Model

### 8.1 User
id (uuid)
- email (unique)
- password_hash
- created_at
- updated_at

###8.2 Category
- id (uuid)
- name (string)
- color (rgb)
- sort_order (int)
- The default categories need to be added to the in-memory SQLite DB

### 8.3 Note
- id (uuid)
- user_id (uuid)
- category_id (uuid)
- title (string)
- content (text)
- created_at
- updated_at
- last_edited_at (timestamp)

Use in-memory SQLite DB with the django application

## 9. API Requirements

### Authentication
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`

### Categories
- `GET /categories`


### Notes
- `GET /notes?categoryId=`
- `GET /notes/{id}`
- `POST /notes`
- `PATCH /notes/{id}`

#### Notes API Behavior
- List endpoint returns previews only
- Full content fetched for editor view

---

## 10. Frontend Components (Suggested)

- `AppShell`
- `SidebarCategories`
- `NotesGrid`
- `NoteCard`
- `NoteEditorModal`
- `CategoryDropdown`

---

## 11. Component States (UI-Driven)

All interactive UI components must support the visual and behavioral states defined in the Figma designs.  
Figma is the source of truth for how each state looks and transitions.

No additional states should be introduced beyond what is explicitly shown in the designs.

### Standard States

Where applicable, components must support the following states:

- **Default**: Resting, non-interactive state
- **Hover**: Pointer hover feedback
- **Active / Selected**: Currently selected or pressed state
- **Focus**: Keyboard focus state for accessibility
- **Disabled**: Non-interactive state (only if shown in Figma)
- **Empty**: No data or initial state
- **Loading**: Transitional state while data is being fetched or saved (only if shown in Figma)

---

### Component-Specific States

#### Category Item (Sidebar)
- Default (unselected)
- Selected (active category)
- Hover
- Focus (keyboard navigation)

#### Note Card (Notes Grid)
- Default (idle)
- Hover
- Selected / Open (if visually distinct in Figma)

#### “+ New Note” Button
- Default
- Hover
- Active (pressed)
- Disabled (if applicable)

#### Note Editor
- Closed
- Open
- Autosaving / Loading (if indicated in Figma)
- Error state (only if explicitly designed)

---

### Implementation Notes

- Visual styles, spacing, colors, and transitions for each state must match Figma exactly
- Developers should not invent or assume additional states or behaviors
- Accessibility states (focus, keyboard navigation) must be visually represented where defined

---

## 12. Interaction Rules

- Click targets follow Figma hit-area sizes
- Hover states appear only where defined
- Transitions and easing follow Figma prototypes (if present)
- No additional animations beyond Figma

---

## 12. Acceptance Criteria

### Authentication
- User can sign up and access Notes Workspace
- Existing users can sign in successfully

### Notes Workspace
- Categories visible with note counts
- Notes render correctly in grid
- Category filtering works as expected

### Note Editor
- Editor opens for new and existing notes
- Category dropdown updates theme and persists
- Autosave reliably persists changes
- Last Edited timestamp updates correctly

### Figma Design
- All interactive components render correct visual states as defined in Figma
- Keyboard focus states are visible and usable

---

## 13. Non-Functional Requirements

- Secure password hashing (`bcrypt` / `argon2`)
- Autosave resilient to transient network failures
- Responsive layout for desktop and tablet
- Basic keyboard accessibility