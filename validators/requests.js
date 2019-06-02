import { check, validationResult } from 'express-validator/check';

export default {

    loginRequest: (req, res, next) => {
        req.check('email').exists().withMessage('Email is required');
        req.check('email').isEmail().withMessage('Invalid email');
        req.check('password').exists().withMessage('Password is required');

        handle(req, res, next);
    },

    registerRequest: (req, res, next) => {
        req.check('email').exists().withMessage('Email is required');
        req.check('email').isEmail().withMessage('Invalid email');
        req.check('password').exists().withMessage('Password is required');
        req.check('username').exists().withMessage('Username is required');
        req.check('bank_account_number').exists().withMessage('Bank account number is required');

        handle(req, res, next);
    },

    addGroupRequest: (req, res, next) => {
        req.check('name').exists().withMessage('Name is required');

        handle(req, res, next);
    },

    generateMemberLinkRequest: (req, res, next) => {
        req.check('email').exists().withMessage('Email is required');
        req.check('group_id').exists().withMessage('Group id is required');

        handle(req, res, next);
    },
    
}

const handle = (req, res, next) => {
    req.getValidationResult()
    .then(r => !r.isEmpty() ? r.throw() : next())
    .catch(r => res.status(422).json(r.mapped()));
}

