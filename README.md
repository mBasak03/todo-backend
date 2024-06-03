# Task Management RESTful API

This project is a simple RESTful API built using Node.js and Express.js for managing a collection of tasks. The API supports basic CRUD (Create, Read, Update, Delete) operations and stores the tasks in memory (using an array).

## Features
- **Create** a new task
- **Retrieve** all tasks
- **Retrieve** a specific task by ID
- **Update** an existing task by ID
- **Delete** a task by ID
- Basic authentication using an API key
- Validation using Zod

## Endpoints
- `GET /tasks`: Retrieve a list of all tasks.
- `GET /tasks/:id`: Retrieve a specific task by ID.
- `POST /tasks`: Create a new task (requires API key).
- `PUT /tasks/:id`: Update an existing task by ID (requires API key).
- `DELETE /tasks/:id`: Delete a task by ID (requires API key).

## API Documentation

### Postman Documentation
You can view the full API documentation and test the endpoints using Postman by following this link: [Postman API Documentation](https://documenter.getpostman.com/view/27273401/2sA3Qy4oLS)

