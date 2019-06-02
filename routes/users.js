import express from 'express';
import passport from 'passport';
import UserController from '../controllers/users'
const router = express.Router();
const checkAuth = passport.authenticate('jwt', {session: false});


router.get('/', checkAuth, UserController.getUsers);
router.get('/groups', checkAuth, UserController.getUserGroups);


export default router;