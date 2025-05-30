# To-Do App Backend

A full-stack To-Do application backend built with Node.js, Express, and Prisma ORM using MongoDB as the database. The frontend is built with Vite and hosted on Netlify, while the backend is deployed on Render. This repository contains the backend source code.

## Features

- RESTful API for CRUD operations on tasks  
- Prisma ORM for database interaction  
- MongoDB as the database  
- CORS enabled for cross-origin requests  
- Environment variable configuration for sensitive data  
- Error handling for robust API  

## Environment Setup

### Prerequisites

- Node.js (v14+ recommended)  
- npm or yarn  
- MongoDB database (cloud or local)  

### Installation Steps

1. Clone the repository:  
`git clone https://github.com/yourusername/your-backend-repo.git`  
`cd your-backend-repo`

2. Install dependencies:  
`npm install` or `yarn install`

3. Create `.env` file in the root with:  
DATABASE_URL="your_mongodb_connection_string"
PORT=3001


4. Run database migrations:  
`npx prisma migrate dev --name init`

5. Start the server:  
`npm run dev`  

The backend server will run on `http://localhost:3001` or your specified port.

## API Endpoints

| Method | Endpoint      | Description                   |
|--------|---------------|------------------------------|
| GET    | `/todos`      | Get all tasks                |
| POST   | `/todos`      | Create a new task            |
| PUT    | `/todos/:id`  | Update a task (e.g., complete) |
| DELETE | `/todos/:id`  | Delete a task                |

## Deployment

- Backend deployed on Render  
- Frontend hosted on Netlify  

## Security Notes

- Do **not** commit your `.env` file to GitHub. Add `.env` to `.gitignore`.  
- Use environment variables for sensitive data like database URLs.  
- CORS enabled for frontend-backend communication.

## License

MIT License