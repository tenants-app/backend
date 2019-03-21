const router = require('express').Router();
const passport = require('passport');


router.use('/auth', require('./auth'));

router.use('/users', passport.authenticate('jwt', {session: false}), require('./users'));


module.exports = router;