const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const validateProfileInput = require('./../../validation/profile');
const validateExperienceInput = require('./../../validation/experience');
const validateEducationInput = require('./../../validation/education');

const router = express.Router();

// Load Models
const Profile = require('./../../models/Profile');
const User = require('./../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => {
    res.json({
        message: "Profile Works!",
    });
});

// @route   GET api/profile/handle/:handle
// @desc    Get Profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {

    const errors = {};

    Profile.findOne({
        handle: req.params.handle
    }).populate('user', ['name', 'avatar']).then(profile => {
        if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status('404').json(errors);
        }
        res.json(profile);
    }).catch(err => {
        return res.status('404').json(err);
    });
});

// @route   GET api/profile/user/:user_id
// @desc    Get Profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {

    const errors = {};

    Profile.findOne({
        handle: req.params.user_id
    }).populate('user', ['name', 'avatar']).then(profile => {
        if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status('404').json(errors);
        }
        res.json(profile);
    }).catch(err => {
        return res.status('404').json(err);
    });
});

// @route   GET api/profile/all
// @desc    Get all Profiles
// @access  Public
router.get('/all', (req, res) => {

    const errors = {};

    Profile.find().populate('user', ['name', 'avatar']).then(profile => {
        if (!profile) {
            errors.noprofile = 'No profile exists!';
            return res.status('404').json(errors);
        }
        res.json(profile);
    }).catch(err => {
        return res.status('404').json(err);
    });
});

// @route   GET api/profile
// @desc    Get Logged User Profile
// @access  Private
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const errors = {};

    Profile.findOne({
        user: req.user.id
    }).populate('user', ['name', 'avatar']).then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user'
            return res.status('404').json(errors);
        }
        res.json(profile);
    }).catch(err => {
        return res.status('404').json(err);
    });
});

// @route   POST api/profile
// @desc    Create or Edit User Profile
// @access  Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status('400').json(errors);
    }

    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills -> Split into an array (Comes as CSV)
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',').map(skill => skill.trim());
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (profile) {
            // Update
            Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            }).then(profile => {
                res.json(profile);
            });
        } else {
            // Create
            // Check if handle exists.
            Profile.findOne({
                handle: profileFields.handle
            }).then(profile => {
                if (profile) {
                    errors.handle = "Handle already Exists!";
                    return res.status('400').json(errors);
                }
                new Profile(profileFields).save().then(profile => {
                    res.json(profile);
                });
            });
        }
    });

});

// @route   POST api/profile/experience
// @desc    Add experience to Profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status('400').json(errors);
    }

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) {
            errors.noprofile = 'Profile doesnt exist!';
            return res.status('404').json(errors);
        }
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description,
        }

        // Add to exp array
        profile.experience.unshift(newExp);
        profile.save().then(profile => {
            res.json(profile);
        });

    });
});

// @route   POST api/profile/education
// @desc    Add education to Profile
// @access  Private
router.post('/education', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status('400').json(errors);
    }

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) {
            errors.noprofile = 'Profile doesnt exist!';
            return res.status('404').json(errors);
        }
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description,
        }

        // Add to exp array
        profile.education.unshift(newEdu);
        profile.save().then(profile => {
            res.json(profile);
        });

    });
});

// @route   DELETE api/profile/experience/:id
// @desc    Delete experience from profile by id
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) {
            errors.noprofile = 'Profile doesnt exist!';
            return res.status('404').json(errors);
        }

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => {
            res.json(profile);
        }).catch(err => {
            return res.status('404').json(err);
        });
    });
});

// @route   DELETE api/profile/education/:id
// @desc    Delete education from profile by id
// @access  Private
router.delete('/education/:exp_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) {
            errors.noprofile = 'Profile doesnt exist!';
            return res.status('404').json(errors);
        }

        // Get remove index and delete item
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id);
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => {
            res.json(profile);
        }).catch(err => {
            return res.status('404').json(err);
        });
    });
});

// @route   POST api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOneAndRemove({
        user: req.user.id
    }).then(() => {
        User.findOneAndRemove({
            _id: req.user.id
        }).then(() => {
            res.json({
                'Success': true
            });
        });
    });

});

module.exports = router