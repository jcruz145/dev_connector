const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private

router.get('/me', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if(!profile) {
            res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

// @route  POST api/profile
// @desc   Create or update a user profile
// @access Private

router.post('/', [ auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
] ], 
async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company, 
        website, 
        location, 
        bio, 
        status, 
        githubusername, 
        skills, 
        youtube, 
        facebook, 
        twitter, 
        instagram, 
        linkedin 
    } = req.body;

    const profileFields = {};

    profileFields.iuser = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(youtube) profileFields.youtube = youtube;
    if(facebook) profileFields.facebook = facebook;
    if(twitter) profileFields.twitter = twitter;
    if(instagram) profileFields.instagram = instagram;
    if(linkedin) profileFields.linkedin = linkedin;

    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: profileFileds },
                { new: true }
            );
            return res.json(profile);
        }

        profile = new Profile(profileFields);

        await profile.save();

        return res.json(profile);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;