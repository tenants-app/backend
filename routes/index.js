import express from 'express';
import passport from 'passport';
import auth from './auth';
import users from './users';
const router = express.Router();

router.use('/auth', auth);
router.use('/users', passport.authenticate('jwt', {session: false}), users);

export default router;