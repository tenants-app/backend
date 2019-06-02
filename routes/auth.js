import express from 'express';
import AuthController from '../controllers/auth';
import Validator from '../validators/requests';
const router = express.Router();


router.post('/login', Validator.loginRequest, AuthController.login);
router.post('/register', Validator.registerRequest, AuthController.register);


export default router;