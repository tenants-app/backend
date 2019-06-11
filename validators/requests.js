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

    addShoppingListRequest: (request, response, next) => {
        request.check('name').exists().withMessage('Name is required');
        request.check('products').exists().withMessage('Products are required');
        request.check('products').notEmpty().withMessage('Product list can\'t be empty');
        request.check('products').isArray().withMessage('Products needs to be array');

        handle(request, response, next);
    },

    addDutyRequest: (request, response, next) => {
        request.check('length').exists().withMessage('Length is required');
        request.check('length').isNumeric().withMessage('Length must be integer');
        request.check('length').isLength({min: 1, max: 1}).withMessage('Length must be up to 9 days');
        request.check('order').exists().withMessage('Order is required');

        handle(request, response, next);
    },
}

const handle = (request, response, next) => {
    request.getValidationResult()
    .then(r => !r.isEmpty() ? r.throw() : next())
    .catch(r => response.status(422).json(r.mapped()));
}

