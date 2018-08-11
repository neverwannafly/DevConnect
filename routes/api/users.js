const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = require('../../config/keys').secretKey;

const router = express.Router();

// Load User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public route
router.get('/test', (req, res) => {
    res.json({
        message: "Users Works!",
    });
});

// @route   POST api/users/register
// @desc    Register user 
// @access  Public route
router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: "Email Already Exists!"
            });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: gravatar.url(req.body.email, {
                    d: 'mm', // Size
                    r: 'pg', // Rating
                    s: '200' // Default
                }),
                password: req.body.password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => {
                        res.json(user)
                    }).catch(err => {
                        console.log(err);
                    });
                });
            });
        }
    });
});

// @route   POST api/users/login
// @desc    Login user and return a JWT token
// @access  Public route
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user by Email
    User.findOne({
        email: email
    }).then(user => {
        if (!user) {
            return res.status('404').json({
                email: 'User not found!'
            });
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User Matched

                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                };

                // Sign Token
                jwt.sign(payload, secretKey, {
                    expiresIn: 3600
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: `Bearer ${token}`
                    });
                });
            } else {
                return res.status('400').json({
                    password: "Invalid Password"
                });
            }
        });

    });
});

module.exports = router