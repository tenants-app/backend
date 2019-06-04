import express from 'express';
import passport from 'passport';
import GroupController from '../controllers/groups'
import BillController from '../controllers/bills'
import DebtController from '../controllers/debts'
import Validator from '../validators/requests';
import isGroupMember from "../middlewares/IsGroupMember";
const router = express.Router();
const checkAuth = passport.authenticate('jwt', {session: false});

router.get('/:groupId', checkAuth, GroupController.getGroup);
router.get('/:groupId/members', [checkAuth, isGroupMember], GroupController.getGroupMembers);
router.get('/:groupId/members/:id', [checkAuth, isGroupMember], GroupController.getGroupMember);
router.post('/new', checkAuth, Validator.addGroupRequest, GroupController.addGroup);
router.post('/generate_member_link', checkAuth, Validator.generateMemberLinkRequest, GroupController.generateMemberLink);
router.get('/activate_member/:token', GroupController.activateMember);

router.post('/:groupId/bills', [checkAuth, isGroupMember], Validator.addBillRequest, BillController.addBill);
router.get('/:groupId/bills', [checkAuth, isGroupMember], BillController.getBills);
router.get('/:groupId/bills/:id', [checkAuth, isGroupMember], BillController.getBill);
router.post('/:groupId/bills/:id/paid', [checkAuth, isGroupMember], BillController.setAsPaid);

router.post('/:groupId/debts', [checkAuth, isGroupMember], Validator.addDebtRequest, DebtController.addDebt);
router.get('/:groupId/debts', [checkAuth, isGroupMember], DebtController.getDebts);
router.get('/:groupId/debts/given', [checkAuth, isGroupMember], DebtController.getLoansGiven);
router.post('/:groupId/debts/:id/paid', [checkAuth, isGroupMember], DebtController.setAsPaid);

export default router;