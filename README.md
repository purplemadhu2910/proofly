# Proofly — Testimonial & Social Proof Collector

Proofly is a modern full-stack web application designed for businesses and product owners to collect customer feedback, moderate testimonials, and showcase social proof via customizable "Wall of Love" pages and 1-click iframe embed widgets.

![Proofly Architecture](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 1. Business Owner Authentication
* Secure signup and login with short-lived JWT Access Tokens (15 mins) and long-lived Refresh Tokens (7 days).
* Automatic token rotation delivered securely via httpOnly cookies (with Bearer authorization fallback).
* Simulated email verification and password reset workflow.

### 2. Multi-Space Management
* Create dedicated "Spaces" for each business/product (e.g., `Instagram`, `Acme Corp`, `SaaSify`).
* Unique URL slugs automatically generated or customized (e.g., `/collect/instagram`).
* Customizable review question prompts, custom question lists, logo uploads, and avatar/rating display toggles.

### 3. Public Testimonial Collection Page (`/collect/:spaceSlug`)
* 100% public access — customers submit testimonials **without creating an account**.
* Interactive star rating picker (1 to 5 stars), review text, company role, and image avatar upload.
* Built-in client-side input validation and IP rate limiting (10 requests/min).
* Celebratory confetti animation upon successful feedback submission.

### 4. Comprehensive Moderation Suite (`/dashboard/testimonials`)
* Tabbed views: All, Pending, Approved, Archived.
* Debounced instant search by customer name, email, or review text.
* Rating filter (1–5 stars).
* One-click moderation actions: **Approve**, **Reject**, **Archive**, **Feature**, and **Like**.

### 5. Public Wall of Love (`/wall/:spaceSlug`)
* Showcases approved testimonials in a responsive masonry grid.
* Highlighted **Featured** badges and glowing visual cards.
* Displays total verified review metrics and average satisfaction score.

### 6. Embed Generator & Standalone Widgets (`/dashboard/embed` & `/embed/:spaceSlug`)
* Customizable embed layouts: **Grid**, **Carousel**, **Badge**.
* Color themes: **Dark** & **Light**.
* Live interactive sandbox preview inside the owner dashboard.
* 1-Click HTML `<iframe>` snippet copy button.

### 7. Performance Analytics (`/dashboard/analytics`)
* Summary metrics: Total testimonials, pending queue, approved live reviews, featured items, and overall average rating.
* Rating distribution progress breakdown (5-star down to 1-star).

---

## 🛠️ Technology Stack

* **Backend**: Python 3.11, FastAPI, Motor (Async MongoDB), Pydantic v2, PyJWT, Bcrypt, Python-Dotenv.
* **Database**: MongoDB (with automatic fallback to `mongomock_motor` if no local MongoDB instance is detected).
* **Frontend**: React 18, Vite, Coss UI Design Primitives, Tailwind CSS, Lucide Icons, Axios, Canvas Confetti.

---

## 🚀 Getting Started & Setup Instructions

### Prerequisites
* Python 3.10+
* Node.js v18+ and npm

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment (optional)
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Linux/macOS: source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed Demo Data (Owner, 3 Spaces, 13 Testimonials)
python seed.py

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
Backend API server will run at: `http://localhost:8000`  
API Docs (Swagger UI): `http://localhost:8000/docs`

---

### 2. Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```
Frontend web application will run at: `http://localhost:5173`

---

## 🔑 Demo Credentials & Quick Links

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo Owner** | `demo@proofly.io` | `password123` |

### Sample Public Links:
* **Public Collection**: [http://localhost:5173/collect/instagram](http://localhost:5173/collect/instagram)
* **Public Wall of Love**: [http://localhost:5173/wall/instagram](http://localhost:5173/wall/instagram)
* **Standalone Embed Widget**: [http://localhost:5173/embed/instagram?layout=grid&theme=dark](http://localhost:5173/embed/instagram?layout=grid&theme=dark)

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new business owner | No |
| `POST` | `/api/auth/login` | Login & set httpOnly cookies | No |
| `POST` | `/api/auth/refresh` | Rotate JWT access token | No |
| `POST` | `/api/auth/logout` | Clear authentication cookies | Yes |
| `POST` | `/api/spaces` | Create new Space | Yes |
| `GET` | `/api/spaces` | List owner's Spaces | Yes |
| `GET` | `/api/spaces/{id}` | Get Space details | Yes |
| `PUT` | `/api/spaces/{id}` | Update Space configuration | Yes |
| `DELETE` | `/api/spaces/{id}` | Delete Space and testimonials | Yes |
| `GET` | `/api/public/spaces/{slug}` | Get Space info for collection | No |
| `POST` | `/api/public/spaces/{slug}/testimonials` | Submit feedback (No account required) | No |
| `GET` | `/api/public/spaces/{slug}/testimonials` | Fetch approved reviews for Wall | No |
| `POST` | `/api/public/upload` | Upload avatar/logo image | No |
| `GET` | `/api/testimonials` | Search & filter testimonials | Yes |
| `PATCH` | `/api/testimonials/{id}` | Moderate status/featured/liked | Yes |
| `DELETE` | `/api/testimonials/{id}` | Delete testimonial | Yes |
| `GET` | `/api/spaces/{id}/analytics` | Get rating stats & distribution | Yes |
| `GET` | `/api/spaces/{id}/embed` | Get iframe embed snippet | Yes |

---

## 📸 Screenshots Placeholder

- **Owner Dashboard Overview**: Comprehensive metrics cards and moderation feed.
- **Public Collection Page**: Polished feedback submission wizard.
- **Wall of Love**: Responsive masonry social proof wall.
- **Embed Generator**: Live sandbox & snippet generator.

---

## 📄 License

MIT License © 2026 Proofly Team.
