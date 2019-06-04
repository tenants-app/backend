import mongoose from 'mongoose';

const Group = mongoose.model('Group');
const Debt = mongoose.model('Debt');

export default {

    addDebt: async (request, response) => {
        let debt = new Debt();
        debt.name = request.body.name;
        debt.holder = request.user._id;
        debt.debtor = request.body.debtor;
        debt.value = request.body.value;

        let group = await Group.findOne({_id: request.params.groupId});
        await group.attachDebt(debt);

        debt.save().then((debt) => {
            return response.json({debt: debt});
        }).catch((err) => {
            return response.status(400).json(err);
        });
    },

    getDebts: (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate([
            {
                path: 'debts',
                populate: [
                    {
                        path: 'holder',
                        model: 'User'
                    },
                    {
                        path: 'debtor',
                        model: 'User',
                    }
                ],
                match: {
                    debtor: request.user._id
                },
                options: {
                    sort: {
                        createdAt: -1
                    }
                }
            }
        ]).then((group) => {
            return response.json({debts: group.debts});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    getLoansGiven: (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate([
            {
                path: 'debts',
                populate: [
                    {
                        path: 'holder',
                        model: 'User'
                    },
                    {
                        path: 'debtor',
                        model: 'User',
                    }
                ],
                match: {
                    holder: request.user._id
                },
                options: {
                    sort: {
                        createdAt: -1
                    }
                }
            }
        ]).then((group) => {
            return response.json({debts: group.debts});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    setAsPaid: (request, response) => {
        Debt.findOne({_id: request.params.id}).then((debt) => {
            debt.paid = !debt.paid;

            debt.save().then((debt) => {
                return response.json({debt: debt});
            }).catch((err) => {
                return response.status(400).json(err);
            });
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

}