# EventHub Frontend - Dragon Edition 🟠

The modern, Saiyan-styled React 18 interface for the EventHub management platform. This frontend is built for speed, responsiveness, and a premium aesthetic inspired by the DragonBall universe.

## 🐉 Features

- **Glow & Aura Design**: Interactive elements with glowing orbs, Saiyan gold accents, and deep space backgrounds.
- **Dynamic Orb Logo**: A custom-animated Dragon Ball orb with pulsing Ki energy.
- **Role-Based Views**: Tailored dashboards for Attendees, Organizers, and Admins.
- **Optimized Data Fetching**: Centralized Axios service layer with `withCredentials` support.
- **Bangers Typography**: Bold headings utilizing the "Bangers" Google Font for that authentic comic-book feel.

## 🛠️ Tech Stack

- **React 18**: Functional components and hooks (`useState`, `useEffect`, `useContext`).
- **React Router v6**: Client-side routing with role-protected route guards.
- **Axios**: All API communication with global configuration.
- **Lucide React**: High-quality iconography.
- **Vite**: Modern development and build toolchain.

## 🚀 Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Backend Integration**:
   The application is pre-configured to proxy `/api` requests to the .NET backend running at `http://localhost:5000`.

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Navbar, ProtectedRoute)
├── context/        # Global session management (AuthContext)
├── pages/          # Management Views (Events, Organizers, Attendees)
├── services/       # Axios API Service Layer (api.js)
├── App.jsx         # Main router and provider configuration
└── index.css       # DragonBall Design System & CSS Variables
```

## 🛡️ API Access Control

| Page | Endpoint | Access Role |
| :--- | :--- | :--- |
| **Events** | `/events` | Public |
| **New Event** | `/events/new` | Organizer, Admin |
| **Organizers** | `/organizers` | Organizer, Admin |
| **Attendees** | `/attendees` | Admin |
| **Edit Profile** | `/attendees/:id/edit` | Admin, Self |

---

> [!NOTE]
> All API calls are executed via the shared Axios instance in `src/services/api.js` to ensure HttpOnly cookies are correctly handled.
