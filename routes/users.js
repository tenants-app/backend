import mongoose from 'mongoose';
import express from 'express';
import { getUsers } from '../controllers/users'
const User = mongoose.model('User');
const router = express.Router();


router.get('/', getUsers);


export default router;
