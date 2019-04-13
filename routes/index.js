import express from 'express';
import auth from './auth';
import users from './users';
import groups from './groups';
const router = express.Router();

router.use('/auth', auth);
router.use('/groups', groups);
router.use('/users', users);

export default router;