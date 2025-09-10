const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/checkEmail', async (req, res) => {
    const { email } = req.body;

    try {
        const exists = await User.emailExists(email);
        return res.json({ exists });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
