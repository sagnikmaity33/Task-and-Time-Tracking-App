# Task Manager Frontend

This is the frontend for the Task Manager application built with React and Redux.

## Environment Setup

Create a `.env` file in the frontend directory with the following variables:

```bash
# API Configuration
# For development - use localhost
REACT_APP_API_BASE_URL=http://localhost:3001

# For production - use your hosted backend URL
# REACT_APP_API_BASE_URL=https://mytask-managerapp.herokuapp.com
```

## How It Works

The frontend now uses environment variables to automatically switch between:
- **Development**: `http://localhost:3001` (your local backend)
- **Production**: `https://mytask-managerapp.herokuapp.com` (your hosted backend)

## Features

- User authentication (login/register)
- Task management (create, read, update, delete)
- Real-time time tracking with start/stop functionality
- Daily productivity summary
- Task filtering by status and tag
- Responsive design

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Project Structure

- `src/components/` - React components
- `src/redux/` - Redux store, actions, and reducers
- `src/components/Summary/` - Daily summary component
- `src/components/TasksPages/` - Task list with timer functionality
- `src/components/AddTask/` - Task creation form
- `src/components/Sidebar/` - Navigation sidebar

## Deployment

1. **Development**: Set `REACT_APP_API_BASE_URL=http://localhost:3001`
2. **Production**: Set `REACT_APP_API_BASE_URL=https://your-backend-url.com`
3. **Build**: Run `npm run build` and deploy the build folder
