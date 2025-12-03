# Whisper 📖  
*A calm little corner of the internet where people write and share their stories.*

Whisper is a storytelling web app built with **MERN + TypeScript** where users can write, publish, and read stories from others.  
Think of it as a minimal, cozy writing space focused on words, not noise.

---

## ✨ Features

- 📝 **Create & publish stories**  
  Rich text / simple markdown-like editor for writing and posting stories.

- 🌐 **Public story feed**  
  Browse stories written by other users.

- 👤 **User accounts & profiles**  
  Users can sign up, log in, and manage their own stories.

- 🔐 **Authentication & Authorization**
  - **Firebase** for login/signup (email/password).
  - **JWT** to protect backend routes and associate stories with users.

- ⚙️ **MERN + TypeScript stack**
  - Type-safe codebase on both frontend and backend.

- 🎨 **Modern UI**
  - **Tailwind CSS** for styling.
  - **lucide-react** for crisp, minimal icons.
  - **react-icons**  additional icon packs for UI flexibility

- 🔁 **Smooth UX**
  - **React Router DOM** for SPA navigation.
  - **Axios** for API calls to the backend.

---

## 🛠 Tech Stack

**Frontend**
- React + TypeScript
- Tailwind CSS
- lucide-react
- react-icons
- React Router DOM
- Axios
- Firebase

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- TypeScript
- JWT (JSON Web Tokens) for auth
- bcrypt for password hashing

---

## 📂 Project Structure

```bash
MERN-STORIES/
├── client/                     # Frontend (React + TS)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level pages (Home, Story, Profile, etc.)
│   │   ├── layouts/            # Layout components 
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # Auth / User context
│   │   ├── lib/                # Axios instance, helpers, Firebase config
│   │   ├── router/             # React Router configuration
│   │   ├── types/              # TypeScript types/interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── tailwind.config.ts
│
├── server/                     # Backend (Node + Express + TS)
│   ├── src/
│   │   ├── config/             # DB connection, env config
│   │   ├── controllers/        # Route controllers (stories, auth, users)
│   │   ├── middleware/         # Auth middleware, error handlers
│   │   ├── models/             # Mongoose models (User, Story, etc.)
│   │   ├── routes/             # Express routes
│   │   ├── utils/              # Helper functions, JWT utils
│   │   ├── app.ts              # Express app
│   │   └── server.ts           # Server entry
│   └── tsconfig.json
│
├── .env.example                # Example env variables
├── README.md
└── package.json                # Root-level
