# 🍽 Meal Tracker Application

A full-stack meal tracking web application with user authentication, calorie logging, image uploads, and detailed reporting. Built with a modern REST API backend and a React SPA frontend.

**Live Demo → [meal-tracker.idemudia.dev](https://meal-tracker.idemudia.dev)**

---

## Features

- **Authentication** — Secure signup and signin using JSON Web Tokens (JWT)
- **Meal Logging** — Log meals with calorie count and a personal rating (0–5)
- **Image Uploads** — Attach a photo to each meal entry via Cloudinary
- **Custom Meals** — Select from existing meals or add your own
- **Paginated History** — Browse your logged meals with 5 entries per page
- **Reports Dashboard** — View most consumed meal, highest calorie meal, favourite by rating, overall totals, and per-meal breakdown
- **Date Filtering** — Filter reports by a custom date range
- **Responsive UI** — Clean dark-themed interface that works on desktop and mobile

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| PostgreSQL | Relational database |
| bcryptjs | Password hashing |
| JSON Web Tokens | Stateless authentication |
| Cloudinary | Image storage and CDN delivery |
| multer + multer-storage-cloudinary | Multipart file upload handling |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | SPA frontend with fast builds |
| React Router DOM | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| React Hook Form | Form state and validation |
| React Hot Toast | User feedback notifications |

### Infrastructure
| Service | Purpose |
|---|---|
| Railway | Backend hosting + managed PostgreSQL |
| Vercel | Frontend hosting with global CDN |
| Cloudinary | Image hosting |
| Squarespace DNS | Custom domain management |

---

## Project Structure

```
meal-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js       # Signup and signin logic
│   │   │   ├── mealsController.js      # CRUD for meal entries
│   │   │   └── reportsController.js    # Aggregated stats and date filtering
│   │   ├── routes/
│   │   │   ├── auth.js                 # POST /api/auth/signup, /signin
│   │   │   ├── meals.js                # GET/POST/PUT/DELETE /api/user-meals
│   │   │   └── reports.js              # GET /api/reports
│   │   ├── middleware/
│   │   │   └── auth.js                 # JWT verification middleware
│   │   ├── db/
│   │   │   ├── pool.js                 # PostgreSQL connection pool
│   │   │   └── schema.sql              # Database table definitions
│   │   ├── config/
│   │   │   └── cloudinary.js           # Cloudinary + multer configuration
│   │   └── index.js                    # Express app entry point
│   ├── .npmrc                          # legacy-peer-deps for CI compatibility
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js                # Axios instance with JWT interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx         # Global auth state (Context API)
    │   ├── components/
    │   │   ├── Navbar.jsx              # Navigation with conditional links
    │   │   ├── PrivateRoute.jsx        # Redirects unauthenticated users
    │   │   └── MealCard.jsx            # Meal entry card with edit/delete
    │   ├── pages/
    │   │   ├── Signup.jsx
    │   │   ├── Signin.jsx
    │   │   ├── Meals.jsx               # Paginated meal list
    │   │   ├── NewMeal.jsx             # Log a meal form
    │   │   ├── EditMeal.jsx            # Edit meal entry
    │   │   └── Reports.jsx             # Reports dashboard
    │   ├── App.jsx                     # Routing and layout
    │   └── main.jsx
    └── package.json
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/signup` | Public | Create a new account |
| POST | `/api/auth/signin` | Public | Sign in and receive a JWT |
| GET | `/api/meals` | Public | Get all meals (for dropdown) |
| GET | `/api/user-meals` | Private | Get current user's meal entries (paginated) |
| POST | `/api/user-meals` | Private | Log a new meal entry |
| PUT | `/api/user-meals/:id` | Private | Update a meal entry |
| DELETE | `/api/user-meals/:id` | Private | Delete a meal entry |
| GET | `/api/reports` | Private | Get report stats with optional date filter |

---

## Database Schema

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(254) UNIQUE NOT NULL,
  password_hash VARCHAR(60) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meals (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_meals (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id    INTEGER NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  calories   INTEGER NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
  image_url  TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Local Development

### Prerequisites
- Node.js v20+
- PostgreSQL (Postgres.app recommended for macOS)
- A free [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository

```bash
git clone https://github.com/engr-idemudia/meal-tracker.git
cd meal-tracker
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5001
DATABASE_URL=postgresql://your_user@localhost:5432/meal-tracker
JWT_SECRET=your_strong_random_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create the database and tables:

```bash
psql -U $(whoami) -c "CREATE DATABASE meal-tracker;"
psql -U $(whoami) -d meal-tracker -f src/db/schema.sql
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5001`. Test it:

```bash
curl http://localhost:5001/api/health
# → {"status":"ok"}
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Deployment

### Backend — Railway
1. Create a new project on [Railway](https://railway.app)
2. Deploy from GitHub → select this repository
3. Set **Root Directory** to `backend`
4. Add a PostgreSQL service to the same project
5. Add environment variables (see `.env` section above)
6. Set `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`
7. Run the schema against the production database:

```bash
psql YOUR_RAILWAY_PUBLIC_URL -f backend/src/db/schema.sql
```

### Frontend — Vercel
1. Import the repository on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-railway-url.up.railway.app/api`
4. Deploy

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (use 5001 locally — port 5000 is reserved on macOS) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS (must match exactly) |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full base URL of the Express API |

---

## Background

This application was originally built in 2022 using AdonisJS with a MySQL database and hosted on Heroku. When Heroku discontinued its free tier, the app went offline. In 2026, it was fully rebuilt with a modern stack — migrating from session-based auth to JWT, from MySQL to PostgreSQL, from base64 image blobs to Cloudinary, and from server-rendered templates to a React SPA — and redeployed to Railway and Vercel.

---

## Author

**Idemudia M. Osaghae**
[idemudia.dev](https://idemudia.dev) · [GitHub](https://github.com/engr-idemudia) · [LinkedIn](https://linkedin.com/in/idemudia-osaghae)

---

## License

MIT
