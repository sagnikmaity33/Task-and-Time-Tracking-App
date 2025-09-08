# **Full Stack Task Manager Web Application**

_Hello Everyone..._
<br/>
This is Proffesional Task Manager App  which I build<br>
using `React, Redux, Material UI, Express, MongoDB, Node JS, CSS`.<br/>If you Want to try then Go to the link Below...<br/>_

- link : https://task-and-time-tracking-app-7lmn.vercel.app/

### _If you like the application then give a star as a feedback.._

<br/>

In this application you can store your personal, proffesional and other tasks with theire subtasks. You can also edit them later.<br>
All the user Information and All the tasks are stored in Backend so you can also access them later.

## Technologies :

#### Frontend :

- ReactJS
- Redux
- Material UI

### Backend :

- Express
- NodeJS
- MongoDB

## Features :

- Register User
- Login User
- Create Task
- Read Tasks
- Update Tasks
- Long time access

## Screenshots of Application :

- ### SignUp section
  ![alt text](/Images/signup.png)

---

- ### SignIn section
  ![alt text](/Images/signin.png)

---

- ### Home Page section

 ![alt text](/Images/home.png)

- ### Tasks Pages Section
  ![alt text](/Images/tasks.png)

---

- ### Add New Task Section
  ![alt text](/Images/addtask.png)

---

- ### Responsive Design
  ![alt text](/Images/response.png)

## Local Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)

### 1) Clone the repository
```bash
git clone <repo-url>
cd Task-Manager-Web-App-main
```

### 2) Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see `.gitignore`):
```env
# Required
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret

# Optional
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_if_using_ai
NODE_ENV=development
PORT=3001
```

Start the backend:
```bash
npm run dev
# Server: http://localhost:3001
# Health: http://localhost:3001/health and http://localhost:3001/health/detailed
```

### 3) Frontend setup
In a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (optional):
```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

Start the frontend:
```bash
npm start
# App: http://localhost:3000
```

### 4) Login/Usage Notes
- Register a user at the app, then login.
- Cookies are used to store `Token` and `Name` for auth.
- Tasks API requires `Authorization: Bearer <token>` (frontend handles this).

### 5) Optional: AI Suggestions
- Set `GEMINI_API_KEY` in backend `.env` to enable AI title/description suggestions.
- Endpoint: `POST /ai/generate-suggestions` with `{ input: string }`.

### 6) Time Tracking
- Start: `POST /time/start/:taskId`
- Stop: `POST /time/stop/:taskId`
- Logs + total: `GET /time/task/:taskId`

### 7) Common issues
- If using Windows WSL/local Mongo, ensure `MONGODB_URI` is reachable.
- If you previously installed `bcrypt`, remove it; this app uses `bcryptjs`:
  ```bash
  cd backend && npm uninstall bcrypt && npm install
  ```
- CORS allows localhost ports 3000/3001/3002 by default.
