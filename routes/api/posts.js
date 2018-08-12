const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('./../../models/Post');
const Profile = require('./../../models/Profile');
const validatePostInput = require('../../validation/post');

const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => {
    res.json({
        message: "Posts Works!",
    });
});

// @route   GET api/posts/
// @desc    Get all Posts
// @access  Public
router.get('/', (req, res) => {

    const errors = {};

    Post.find().sort({
        date: -1
    }).then(posts => {
        return res.json(posts);
    }).catch(() => {
        errors.nopostsfound = 'No posts found!';
        return res.status('404').json(err);
    });

});

// @route   GET api/posts/:id
// @desc    Get Post by ID
// @access  Public
router.get('/:id', (req, res) => {

    const errors = {};

    Post.findById(req.params.id).then(posts => {
        res.json(posts);
    }).catch(() => {
        errors.nopostfound = 'No post found!';
        return res.status('404').json(errors);
    });

});

// @route   DELETE api/posts/:id
// @desc    Delete Post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const errors = {};

    Post.findById(req.params.id).then(post => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
            errors.notauthorised = 'User not authorised to delete this post';
            return res.status('401').json(errors);
        }

        // Delete post
        post.remove().then(() => {
            res.json({
                'success': true
            });
        });
    }).catch(() => {
        errors.postnotfound = "This post doesnt exist!"
        return res.status('404').json(errors);
    });

});

// @route   POST api/posts/
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    if (!isValid) {
        return res.status('400').json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    });

    newPost.save().then(post => {
        return res.json(post);
    });

});

// @route   POST api/posts/like/:id
// @desc    Like Post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const errors = {};

    Post.findById(req.params.id).then(post => {
        // Check if user has already liked the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            errors.alreadyliked = 'User already liked this post!';
            return res.status('400').json(errors);
        }

        // Add user id to likes array
        post.likes.unshift({
            user: req.user.id
        });
        post.save().then(post => {
            return res.json(post);
        });

    }).catch(() => {
        errors.postnotfound = "This post doesnt exist!"
        return res.status('404').json(errors);
    });
});

// @route   POST api/posts/unlike/:id
// @desc    Unike Post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const errors = {};

    Post.findById(req.params.id).then(post => {
        // Check if user has already liked the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {

            // Get remove Index
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);

            post.save().then(post => {
                return res.json(post);
            });

        }

        errors.notliked = 'User hasnt liked the post!';
        return res.status('400').json(errors);

    }).catch(() => {
        errors.postnotfound = "This post doesnt exist!"
        return res.status('404').json(errors);
    });
});

module.exports = router