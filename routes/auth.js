import mongoose from 'mongoose';
import express from 'express';
import passport from 'passport';
import { login, register } from '../controllers/auth';
const User = mongoose.model('User');
const router = express.Router();


router.post('/login', login);
router.post('/register', register);


export default router;