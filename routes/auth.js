const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;

   
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'Username already exists' });


        const hashedPassword = await bcrypt.hash(password, 10);

    
        const newUser = new User({ username, firstname, lastname, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
