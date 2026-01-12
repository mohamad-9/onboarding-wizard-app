# Onboarding Wizard (RVS Engineering Leader/Co-Founder Exercise)

A full-stack onboarding wizard with an admin-configurable Step 2/3 form, plus a data table for verifying database persistence.

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

### 3) Data Table (`/data`)
Simple HTML table showing all users and their saved onboarding data.  
Refreshing `/data` shows the latest DB state (useful for verifying persistence while testing).

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

### Tooling
- Git
- Docker + Docker Compose (for packaging frontend + backend)

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
