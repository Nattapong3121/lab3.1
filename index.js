const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Sample data

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Routes

//check status
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Get all users
app.get('/users', (req, res) => res.json(users));

// Get user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.json(user);
    }
});

// Create a new user (POST)
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update a user (PUT)
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const { name, email } = req.body || {};
    if (name) user.name = name;
    if (email) user.email = email;
    res.json(user);
});

// Delete a user (DELETE)
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    const deletedUser = users.splice(index, 1);
    res.json({ message: 'User deleted', user: deletedUser[0] });
});

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});