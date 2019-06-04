import mongoose from 'mongoose';

const Bill = mongoose.model('Bill');
const Group = mongoose.model('Group');
const BillDebtor = mongoose.model('BillDebtor');

export default {

    addBill: async (request, response) => {
        let bill = new Bill();
        bill.name = request.body.name;
        bill.value = request.body.value;
        bill.user = request.user._id;

        let group = await Group.findOne({_id: request.params.groupId}).populate('members');
        await group.attachBill(bill);

        group.members.forEach(function (debtor) {
            let billDebtor = new BillDebtor();
            billDebtor.user = debtor._id;
            billDebtor.value = Math.round(bill.value / group.members.length * 100) / 100;

            billDebtor.save().catch((err) => {
                return response.status(400).json(err);
            });

            bill.attachDebtor(billDebtor)
        });

        bill.save().then((bill) => {
            return response.json({bill: bill});
        }).catch((err) => {
            return response.status(400).json(err);
        });
    },

    getBills: (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate([
            {
                path: 'bills',
                populate: [
                    {
                        path: 'user',
                        model: 'User'
                    },
                    {
                        path: 'debtors',
                        model: 'BillDebtor',
                        match: {
                            user: request.user._id
                        },
                        options: {limit: 1}
                    }
                ],
                options: {
                    sort: {
                        createdAt: -1
                    }
                }
            }
        ]).then((group) => {
            return response.json({bills: group.bills});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    getBill: (request, response) => {
        Bill.findOne({_id: request.params.id}).populate([
            {
                path: 'user',
                model: 'User'
            },
            {
                path: 'debtors',
                model: 'BillDebtor',
                populate: [
                    {
                        path: 'user',
                        model: 'User'
                    },
                ],
            }
        ]).then((bill) => {
            return response.json({bill: bill});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    setAsPaid: (request, response) => {
        Bill.findOne({_id: request.params.id}).populate([
            {
                path: 'debtors',
                model: 'BillDebtor',
                match: {
                    user: request.user._id
                },
            }
        ]).then((bill) => {
            let debtor = bill.debtors[0];
            debtor.paid = !debtor.paid;

            debtor.save().then((debtor) => {
                return response.json({debtor: debtor});
            }).catch((err) => {
                return response.status(400).json(err);
            });
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

}