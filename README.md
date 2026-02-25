<div align="center">

# 🏢 Enterprise HRMS Platform

### A Production-Grade Human Resource Management System

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

*A full-stack, role-based Human Resource Management System built with React, Supabase, and PostgreSQL — designed for scalability, security, and enterprise usability.*

[🚀 Live Demo](#) · [📖 Documentation](#-table-of-contents) · [🐛 Report Bug](https://github.com/SAK-SHI14/Postgresql-hrms-platform/issues) · [✨ Request Feature](https://github.com/SAK-SHI14/Postgresql-hrms-platform/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Role-Based Access Control](#-role-based-access-control)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Supabase Setup](#1-supabase-setup)
  - [Database Initialization](#2-database-initialization)
  - [Frontend Setup](#3-frontend-setup)
  - [Admin Promotion](#4-admin-promotion)
- [Environment Variables](#-environment-variables)
- [Module Breakdown](#-module-breakdown)
- [Security Model](#-security-model)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Enterprise HRMS Platform** is a modern, full-stack Human Resource Management System designed to streamline core HR operations for small to medium-sized enterprises. It provides a clean, role-aware interface for managing employees, processing payroll, and handling leave requests — all backed by a secure, cloud-native Supabase + PostgreSQL database with Row Level Security (RLS) enforced at the database layer.

> Built with a "security-first" philosophy — every data operation is authenticated and authorized via Supabase Auth and PostgreSQL RLS policies, ensuring data isolation between roles.

---

## ✨ Key Features

| Module | Features |
|---|---|
| 🔐 **Authentication** | Email/password login, session persistence, JWT-based auth, safety timeout on auth checks |
| 👥 **Employee Management** | Add, edit, view, and manage employee records — restricted to `admin` and `hr` roles |
| 💰 **Payroll Management** | Track payroll records per employee, view payment status (Paid / Pending / Failed) |
| 🗓️ **Leave Management** | Submit leave requests, approve/reject as admin/HR, filter by status tabs, search by employee name |
| 📊 **Dashboard** | Real-time stats (total employees, pending requests, total payroll, active leaves), quick action shortcuts |
| 🔒 **Role-Based Access** | Three-tier role system (`admin`, `hr`, `employee`) with route-level and UI-level guards |
| 🎨 **Pastel Design System** | Custom glassmorphism UI with soft shadows, pastel color tokens, and smooth micro-animations |
| 📱 **Responsive Layout** | Mobile-first design, responsive grid system, collapsible sidebar |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.0 | UI Framework |
| React Router DOM | ^7.13.0 | Client-side Routing |
| Vite | ^8.0.0 | Build Tool & Dev Server |
| Tailwind CSS | ^4.1.18 | Utility-first Styling |
| Lucide React | ^0.563.0 | Icon Library |
| clsx + tailwind-merge | Latest | Conditional Class Utilities |

### Backend & Infrastructure
| Technology | Purpose |
|---|---|
| Supabase | BaaS — Auth, Realtime DB, REST API |
| PostgreSQL | Relational database via Supabase |
| Row Level Security (RLS) | Database-level authorization |
| Supabase JS SDK v2 | Frontend client for all DB operations |
| Node.js (backend scripts) | Admin utility scripts |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                           │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────────────────────┐  │
│   │  React SPA   │    │         React Router v7              │  │
│   │  (Vite Dev)  │───▶│  /login  /  /employees /payroll      │  │
│   └──────────────┘    │  /leaves  /debug-auth                │  │
│                        └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼  Supabase JS SDK (HTTPS)
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE CLOUD                           │
│                                                                 │
│   ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐  │
│   │  Auth (JWT) │   │  REST API    │   │   Realtime Engine  │  │
│   │             │   │  (PostgREST) │   │                    │  │
│   └─────────────┘   └──────────────┘   └────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │               PostgreSQL Database                       │   │
│   │                                                         │   │
│   │   ┌────────────┐  ┌───────────┐  ┌──────────────────┐  │   │
│   │   │  employees │  │  payroll  │  │  leave_request   │  │   │
│   │   │  (+ RLS)   │  │  (+ RLS)  │  │  (+ RLS)         │  │   │
│   │   └────────────┘  └───────────┘  └──────────────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼  node set_admin.js
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND UTILITY SCRIPTS                      │
│   (Node.js + @supabase/supabase-js) — Role promotion scripts   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

The database consists of three core tables, all protected by Row Level Security (RLS):

### `employees`
```sql
CREATE TABLE public.employees (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  first_name  TEXT    NOT NULL,
  last_name   TEXT    NOT NULL,
  email       TEXT    NOT NULL UNIQUE,
  phone       TEXT,
  department  TEXT,
  job_role    TEXT,
  status      TEXT    DEFAULT 'Active'    CHECK (status IN ('Active', 'Inactive', 'On Leave')),
  joined_date DATE    DEFAULT CURRENT_DATE,
  system_role TEXT    DEFAULT 'employee'  CHECK (system_role IN ('admin', 'hr', 'employee'))
);
```

### `payroll`
```sql
CREATE TABLE public.payroll (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  employee_id  UUID    REFERENCES public.employees(id) ON DELETE CASCADE,
  amount       DECIMAL(10, 2) NOT NULL,
  payment_date DATE    NOT NULL,
  status       TEXT    DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Failed'))
);
```

### `leave_request`
```sql
-- To be added to schema.sql
CREATE TABLE public.leave_request (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  employee_id  UUID    REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type   TEXT    NOT NULL,
  start_date   DATE    NOT NULL,
  end_date     DATE    NOT NULL,
  reason       TEXT,
  status       TEXT    DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);
```

> ⚡ **All tables have RLS enabled.** Policies enforce that only authenticated users can read, insert, update, and delete records.

---

## 🔐 Role-Based Access Control

The system implements a three-tier RBAC model stored in the `system_role` column of the `employees` table.

| Role | Dashboard | Employees | Payroll | Leave Requests |
|---|---|---|---|---|
| `admin` | ✅ Full Access | ✅ CRUD | ✅ View | ✅ View + Approve/Reject |
| `hr` | ✅ Full Access | ✅ CRUD | ✅ View | ✅ View + Approve/Reject |
| `employee` | ✅ Own Stats | ❌ No Access | ✅ Own Records | ✅ Own Requests Only |

### How it works

1. **Authentication**: Supabase Auth issues a JWT on login.
2. **Role Lookup**: On session init, the app queries `employees.system_role` by the authenticated user's email.
3. **Route Guards**: `<RequireAuth allowedRoles={['admin', 'hr']}>` wraps sensitive routes.
4. **UI Guards**: Conditional rendering hides admin-only actions (approve/reject buttons) for `employee` role.
5. **Database Layer**: RLS policies enforce access at the PostgreSQL level — even if the frontend is bypassed, the database rejects unauthorized queries.

---

## 📁 Project Structure

```
Postgresql-hrms-platform/
│
├── backend/                       # Backend utility scripts
│   ├── schema.sql                 # Full database schema (run in Supabase SQL Editor)
│   ├── set_admin.js               # Script to promote a user to admin role
│   ├── package.json               # Node.js dependencies for backend scripts
│   └── README.md                  # Backend-specific setup guide
│
└── hrms-frontend/                 # React SPA (Vite + Tailwind)
    ├── index.html                 # App entry point
    ├── vite.config.js             # Vite configuration
    ├── postcss.config.js          # PostCSS/Tailwind config
    ├── .env                       # 🔒 Environment variables (not committed)
    ├── .gitignore
    └── src/
        ├── main.jsx               # React DOM render + root setup
        ├── App.jsx                # Router, protected routes, layout wiring
        ├── index.css              # Global styles, design tokens, Tailwind layers
        │
        ├── context/
        │   └── AuthContext.jsx    # Auth state, role resolution, session management
        │
        ├── services/
        │   └── supabase.js        # Supabase client initialization
        │
        ├── pages/
        │   ├── Dashboard.jsx      # Overview stats + quick actions
        │   ├── Employees.jsx      # Employee list, add/edit/delete (admin/hr only)
        │   ├── Payroll.jsx        # Payroll records per employee
        │   ├── Leaves.jsx         # Leave request management + approval workflow
        │   ├── Login.jsx          # Auth page (email + password)
        │   └── DebugAuth.jsx      # Auth state debugger (dev utility)
        │
        ├── components/
        │   ├── common/
        │   │   ├── Button.jsx     # Reusable button with variants (primary, ghost, outline)
        │   │   ├── Badge.jsx      # Status badge component (colors: green, red, yellow, gray)
        │   │   ├── Card.jsx       # Glassmorphic card container
        │   │   ├── Table.jsx      # Composable table (Table, Header, Body, Row, Cell)
        │   │   └── ...            # Additional shared UI primitives
        │   └── layout/
        │       ├── MainLayout.jsx # App shell (sidebar + topbar + outlet)
        │       └── ...            # Sidebar, Navbar components
        │
        └── utils/
            └── cn.js              # Class name utility (clsx + tailwind-merge)
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>= 18.x` — [Download](https://nodejs.org/)
- **npm** `>= 9.x` (comes with Node.js)
- **A Supabase account** — [Sign up free](https://supabase.com/)
- **Git** — [Download](https://git-scm.com/)

---

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com/) and create a **new project**.
2. Wait for the project to finish provisioning (~2 minutes).
3. Navigate to **Project Settings → API** and note down:
   - `Project URL` (your `VITE_SUPABASE_URL`)
   - `anon / public` key (your `VITE_SUPABASE_ANON_KEY`)

---

### 2. Database Initialization

1. In your Supabase dashboard, go to **SQL Editor**.
2. Open `backend/schema.sql` from this repository.
3. Copy the entire contents and paste it into the SQL Editor.
4. Click **Run** to create all tables and RLS policies.

> ⚠️ You also need to create the `leave_request` table. Add it to the SQL editor (schema provided in [Database Schema](#-database-schema) above).

---

### 3. Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/SAK-SHI14/Postgresql-hrms-platform.git
cd Postgresql-hrms-platform

# 2. Navigate to the frontend
cd hrms-frontend

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Edit .env and fill in your Supabase credentials (see Environment Variables section)

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

### 4. Admin Promotion

After creating your first user via the login screen, promote them to `admin` using the backend utility script:

```bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Promote a user to admin by email
node set_admin.js your-email@example.com
```

> **Note**: This script updates the `system_role` field in the `employees` table directly via the Supabase service role key. Ensure the user has already registered and their email exists in the `employees` table.

---

## 🔑 Environment Variables

Create a `.env` file in the `hrms-frontend/` directory with the following variables:

```env
# ============================================================
# Supabase Configuration
# Get these from: Supabase Dashboard → Settings → API
# ============================================================

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> 🚨 **Security Note**: Never commit your `.env` file to version control. It is already listed in `.gitignore`. The `anon` key is safe to use client-side (Supabase restricts it via RLS), but treat `service_role` keys as secrets and never expose them in the frontend.

---

## 🧩 Module Breakdown

### 🔐 Authentication (`AuthContext.jsx`)

- Uses `supabase.auth.getSession()` on mount to restore active sessions.
- Listens to `onAuthStateChange` for login/logout/token refresh events.
- Fetches the user's `system_role` from the `employees` table and stores it in React context.
- Implements a **5-second safety timeout** to prevent the app from being stuck in a loading state if Supabase is unreachable.

### 📊 Dashboard (`Dashboard.jsx`)

- Fetches four live stats in **parallel** using `Promise.all()`:
  - Total employee count
  - Pending leave requests
  - Total payroll (sum of all `amount` values)
  - Active leaves (approved leaves whose date range includes today)
- Shows skeleton loading states while data is fetched.

### 👥 Employees (`Employees.jsx`)

- Full CRUD interface for employee records.
- Guarded by `RequireAuth allowedRoles={['admin', 'hr']}`.
- Supports search, filter by status/department, and paginated views.

### 💰 Payroll (`Payroll.jsx`)

- Lists payroll records linked to employees via `employee_id` foreign key.
- Displays payment status with color-coded badges.

### 🗓️ Leave Management (`Leaves.jsx`)

- **Employees** see only their own requests.
- **Admin / HR** see all requests with approve/reject action buttons.
- Tab-based filtering: Pending | Approved | Rejected | All History.
- Real-time search across employee name and leave type.
- Success notifications auto-dismiss after 3 seconds.

---

## 🛡️ Security Model

```
┌────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                            │
│                                                                │
│  1. HTTPS (all Supabase traffic is TLS encrypted)             │
│                                                                │
│  2. Supabase Auth (JWT)                                        │
│     └─ Tokens expire, auto-refresh handled by SDK             │
│                                                                │
│  3. React Route Guards (frontend)                              │
│     └─ <RequireAuth allowedRoles> blocks unauthorized pages    │
│                                                                │
│  4. UI-Level Conditionals (frontend)                           │
│     └─ action buttons rendered only for authorized roles       │
│                                                                │
│  5. PostgreSQL Row Level Security (database — strongest layer) │
│     └─ auth.role() = 'authenticated' enforced per table/op     │
│     └─ Cannot be bypassed from the frontend                    │
└────────────────────────────────────────────────────────────────┘
```

> Supabase's `anon` key alone cannot access data unless a valid session JWT is present AND the RLS policies pass. This means your data is protected even if the `anon` key is exposed.

---

## 📦 Available Scripts

### Frontend (`hrms-frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

### Backend (`backend/`)

| Command | Description |
|---|---|
| `npm install` | Install backend script dependencies |
| `node set_admin.js <email>` | Promote user to admin role |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes with a descriptive message: `git commit -m 'feat: add payroll export to CSV'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** against the `main` branch

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     A new feature
fix:      A bug fix
docs:     Documentation changes
style:    Code style changes (formatting, etc.)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Maintenance tasks
```

---

## 🗺️ Roadmap

- [ ] Payroll PDF/CSV export
- [ ] Employee self-service leave portal (submit own requests)
- [ ] Department & team hierarchy management
- [ ] Attendance tracking module
- [ ] Real-time notifications (Supabase Realtime)
- [ ] Analytics charts on Dashboard (Recharts / Chart.js)
- [ ] Docker + CI/CD pipeline for deployment

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — Copyright (c) 2025 SAK-SHI14

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software... (see LICENSE for full text)
```

---

<div align="center">

**Built with ❤️ using React, Supabase & PostgreSQL**

⭐ If you found this project useful, please give it a star!

[![GitHub stars](https://img.shields.io/github/stars/SAK-SHI14/Postgresql-hrms-platform?style=social)](https://github.com/SAK-SHI14/Postgresql-hrms-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/SAK-SHI14/Postgresql-hrms-platform?style=social)](https://github.com/SAK-SHI14/Postgresql-hrms-platform/network/members)

</div>
