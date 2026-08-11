# EventHub - 

EventHub is a premium, full-stack event management platform. It allows users to discover, register for, and manage professional events through a powerful, role-based interface.

## 🐉 Application Description

The application is built to handle three distinct user roles:
- **Attendees**: Can browse events and register to attend.
- **Organizers**: Can create and manage their own events, view other organizers, and track registrations.
- **Administrators**: Have full control over the system, including deleting events and managing the entire list of attendees.

The project features a **high-performance .NET 10 API** on the backend and a **dynamic React 18 frontend** with a design system inspired by Goku's iconic style, featuring glowing Dragon Ball orbs, Saiyan-themed gradients, and bold typography.

---

## 🚀 Setup Instructions

### 1. Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js & npm](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for SQL Server)

### 2. Backend Setup (.NET 10 API)
1. **Database**: Ensure the SQL Server container is running.
   ```bash
   docker start eventhub_db
   ```
2. **Run API**:
   ```bash
   cd EventHubAPI
   dotnet run --urls "http://localhost:5000"
   ```
   *The API will listen at `http://localhost:5000`.*

### 3. Frontend Setup (React 18)
1. **Install Packages**:
   ```bash
   cd event-hub-ui
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   *The UI will be available at `http://localhost:3000`.*

---

## 🛡️ API Routes Used

The following endpoints are consumed by the frontend application via Axios:

### Authentication Endpoints
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/attendee/login` | Login for attendees | Public |
| `POST` | `/api/auth/organizer/login` | Login for organizers | Public |
| `POST` | `/api/auth/logout` | Clear session cookies | All |

### Event Management
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Fetch all events | Public |
| `GET` | `/api/events/:id` | Fetch single event details | Public |
| `POST` | `/api/events` | Create a new event | Organizer, Admin |
| `PUT` | `/api/events/:id` | Update event details | Organizer, Admin |
| `DELETE` | `/api/events/:id` | Permanently remove event | Admin |
| `POST` | `/api/events/:id/register` | Register for an event | Attendee |

### User Management
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendees` | Register a new attendee | Public |
| `GET` | `/api/attendees` | Fetch all registered attendees | Admin |
| `POST` | `/api/organizers` | Register a new organizer | Public |
| `GET` | `/api/organizers` | Fetch all registered organizers | Organizer, Admin |

---

## 🛠️ Technology Stack
- **Frontend**: React 18, React Router v6, Axios, Lucide Icons, CSS3.
- **Backend**: ASP.NET Core (Web API) .NET 10.
- **Database**: Entity Framework Core with SQL Server 2022.
- **Styling**: DragonBall "Ki" Design System with Bangers & Inter fonts.
