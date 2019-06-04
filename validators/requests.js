import { check, validationResult } from 'express-validator/check';

export default {

    loginRequest: (request, response, next) => {
        request.check('email').exists().withMessage('Email is required');
        request.check('email').isEmail().withMessage('Invalid email');
        request.check('password').exists().withMessage('Password is required');

        handle(request, response, next);
    },

    registerRequest: (request, response, next) => {
        request.check('email').exists().withMessage('Email is required');
        request.check('email').isEmail().withMessage('Invalid email');
        request.check('password').exists().withMessage('Password is required');
        request.check('username').exists().withMessage('Username is required');
        request.check('bank_account_number').exists().withMessage('Bank account number is required');

        handle(request, response, next);
    },

    addGroupRequest: (request, response, next) => {
        request.check('name').exists().withMessage('Name is required');

        handle(request, response, next);
    },

    generateMemberLinkRequest: (request, response, next) => {
        request.check('email').exists().withMessage('Email is required');
        request.check('group_id').exists().withMessage('Group id is required');

        handle(request, response, next);
    },

    addBillRequest: (request, response, next) => {
        request.check('name').exists().withMessage('Name is required');
        request.check('name').isString().withMessage('Name must be string');
        request.check('value').exists().withMessage('Value is required');
        request.check('value').isNumeric().withMessage('Value must be numeric');

        handle(request, response, next);
    },

    addDebtRequest: (request, response, next) => {
        request.check('name').exists().withMessage('Name is required');
        request.check('name').isString().withMessage('Name must be string');
        request.check('value').exists().withMessage('Value is required');
        request.check('value').isNumeric().withMessage('Value must be numeric');
        request.check('debtor').exists().withMessage('Debtor is required');

        handle(request, response, next);
    },
    
}

const handle = (request, response, next) => {
    request.getValidationResult()
    .then(r => !r.isEmpty() ? r.throw() : next())
    .catch(r => response.status(422).json(r.mapped()));
}

