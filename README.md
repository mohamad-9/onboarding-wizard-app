# Onboarding Wizard (RVS Engineering Leader/Co-Founder Exercise)

A full-stack onboarding wizard with an admin-configurable Step 2/3 form, plus a data table for verifying database persistence.

---

## ✅ What this app does

### 1) User Onboarding Wizard (`/`)
A 3-step “wizard” flow:

- **Step 1:** Email + Password (saved to MySQL; password stored as a hash)
- **Step 2 & Step 3:** Dynamic form fields controlled by Admin config:
  - About Me (textarea)
  - Address (street, city, state, zip)
  - Birthdate (date input)
- **Resume behavior:** If a user already submitted Step 1, refreshing or revisiting the app resumes their progress (DB-backed).

### 2) Admin Config (`/admin`)
Admin UI for selecting which components appear in Step 2 and Step 3.

Rules:
- Step 2 must have **at least one** component
- Step 3 must have **at least one** component
- Components can appear on Step 2, Step 3, or both
- Config is persisted in the database
- No authentication required (per exercise instructions)

### 3) Data Table (`/data`)
Simple HTML table showing all users and their saved onboarding data.  
Refreshing `/data` shows the latest DB state (useful for verifying persistence while testing).

---

## 📋 RVS Exercise Requirements & Implementation

This project was built as part of the **RVS Engineering Leader / Co-Founder Exercise**.

The exercise evaluates:
- Hands-on coding ability
- Ability to translate product requirements into a working system
- System design and extensibility thinking

Below is a mapping of the original requirements to the implemented solution.

---

### Section 1 — User Onboarding

**Requirement**
- 3-step onboarding wizard
- Step 1 persists email and password
- Step 2 and Step 3 configurable via admin
- Supported components:
  - About Me
  - Address (street, city, state, zip)
  - Birthdate
- Resume progress after leaving the site (after Step 1)

**Implementation**
- Implemented a 3-step wizard at `/`
- Step 1 creates a user record in MySQL (password stored as a hash)
- Step 2 and Step 3 dynamically render components based on admin configuration
- User progress is persisted in the database and automatically resumed on refresh

---

### Section 2 — Admin Section

**Requirement**
- Admin UI to configure which components appear on Step 2 and Step 3
- Each step must always have at least one component
- Components can appear on either or both steps
- No authentication required
- Accessible at `/admin`

**Implementation**
- Built admin page at `/admin`
- Validation enforces at least one component per step
- Configuration persisted in MySQL
- Changes immediately affect the onboarding wizard UI

---

### Section 3 — Data Table

**Requirement**
- HTML table showing user data
- Refresh shows latest DB state
- No authentication required
- Accessible at `/data`

**Implementation**
- Implemented `/data` page
- Displays all user records from MySQL
- Refresh always reflects current database state
- Designed purely for testing/verification

---

## ✅ Tech Stack (Fixed)

### Backend
- Python
- FastAPI
- SQLModel
- MySQL (local on macOS — NOT Docker)

### Frontend
- React
- Vite
- JavaScript
- React Router

---

## 🗄️ Database Schema (Simplified)

The app uses a relational MySQL database with two main tables:
- `user` — stores onboarding progress and user data
- `config` — stores admin configuration for Step 2 and Step 3

### User Table

```text
┌───────────────────────────────┐
│             user              │
├───────────────────────────────┤
│ id (PK)                       │
│ email (unique)                │
│ password_hash                 │
│                               │
│ about_me (nullable)           │
│ street (nullable)             │
│ city (nullable)               │
│ state (nullable)              │
│ zip (nullable)                │
│ birthdate (nullable)          │
│                               │
│ step2_completed (boolean)     │
│ step3_completed (boolean)     │
│ created_at (timestamp)        │
└───────────────────────────────┘

### Config Table
┌───────────────────────────────┐
│            config             │
├───────────────────────────────┤
│ id (PK)                       │
│                               │
│ step2_about_me (boolean)      │
│ step2_address (boolean)       │
│ step2_birthdate (boolean)     │
│                               │
│ step3_about_me (boolean)      │
│ step3_address (boolean)       │
│ step3_birthdate (boolean)     │
└───────────────────────────────┘


## 📊 Sample Dataset

Below is an example of what the data looks like after a user completes onboarding.

### Example `user` Table Row

```json
{
  "id": 1,
  "email": "test.user@example.com",
  "about_me": "Frontend engineer interested in startups",
  "street": "123 Main St",
  "city": "Riyadh",
  "state": "Riyadh Province",
  "zip": "12345",
  "birthdate": "1995-01-01",
  "step2_completed": true,
  "step3_completed": true,
  "created_at": "2026-01-12T10:15:30"
}

Example config Table Row### Tooling

{
  "step2_about_me": true,
  "step2_address": false,
  "step2_birthdate": true,
  "step3_about_me": false,
  "step3_address": true,
  "step3_birthdate": false
}

- Git
- Docker + Docker Compose (frontend + backend)

---

## 🧱 Project Structure

```text
project-root/
  backend/
    app/
      main.py
      config/
        settings.py
      models/
      schemas/
      api/
    requirements.txt
    Dockerfile

  frontend/
    src/
      pages/
      components/
      lib/
        api.js
    Dockerfile

  docker-compose.yml
