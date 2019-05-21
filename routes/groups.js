import express from 'express';
import passport from 'passport';
import GroupController from '../controllers/groups'
import Validator from '../validators/requests';
const router = express.Router();
const checkAuth = passport.authenticate('jwt', {session: false});

router.get('/:id', checkAuth, GroupController.getGroup)
router.post('/new', checkAuth, Validator.addGroupRequest, GroupController.addGroup)
router.post('/generate_member_link', checkAuth, Validator.generateMemberLinkRequest, GroupController.generateMemberLink)
router.get('/activate_member/:token', GroupController.activateMember)


export default router;