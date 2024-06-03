const express = require('express');
const { z } = require('zod');
const app = express();
require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());

let tasks = [];
let currentId = 1;

const apiKey = process.env.apiKey; 

// Middleware for basic authentication
const authenticate = (req, res, next) => {
    const key = req.header('x-api-key');
    console.log("Key......",key)
    if (key && key === apiKey) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
};

const taskSchema = z.object({
    title: z.string().min(3, "The title is too short").max(30, "The Title is too long"),
    description: z.string().min(3, "This description is too short").max(150, "This description is too long"),
    createdAt: z.string().optional().default(() => new Date().toISOString())
});

// Create a Task (protected endpoint)
app.post('/tasks', authenticate, (req, res) => {
    const validation = taskSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors
        });
    }

    const newTask = {
        id: currentId++,
        title: req.body.title,
        description: req.body.description,
        createdAt: req.body.createdAt || new Date().toISOString()
    };
    tasks.push(newTask);

    return res.status(200).json({
        success: true,
        message: "New Task added successfully",
        task: newTask,
        tasks: tasks
    });
});

// Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    const existingTask = tasks.find(task => task.id === id);
    if (!existingTask) {
        return res.status(404).json({
            success: false,
            message: "There is no such task exists"
        });
    }
    
    return res.status(200).json({
        success: true,
        message: "Task found",
        task: existingTask,
    });
});

// Retrieve a list of all tasks
app.get('/tasks', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "All tasks are fetched",
        tasks: tasks
    });
});

// Update an existing task by ID (protected endpoint)
const updateTaskValidation = z.object({
    title: z.string().min(3, "The title is too short").max(30, "The Title is too long").optional(),
    description: z.string().min(3, "This description is too short").max(150, "This description is too long").optional(),
});

app.put('/tasks/:id', authenticate, (req, res) => {
    const id = parseInt(req.params.id, 10);

    const existingTask = tasks.find(task => task.id === id);
    if (!existingTask) {
        return res.status(404).json({
            success: false,
            message: "No task found"
        });
    }

    const validation = updateTaskValidation.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors
        });
    }

    existingTask.title = req.body.title ? req.body.title : existingTask.title;
    existingTask.description = req.body.description ? req.body.description : existingTask.description;

    return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task: existingTask
    });
});

// Delete a task by ID (protected endpoint)
app.delete('/tasks/:id', authenticate, (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    tasks.splice(taskIndex, 1);
    return res.status(200).json({
        success: true,
        message: "Task is deleted successfully"
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
