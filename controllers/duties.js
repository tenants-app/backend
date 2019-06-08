import mongoose from 'mongoose';

const Group = mongoose.model('Group');
const Duty = mongoose.model('Duty');
const DutyOrder = mongoose.model('DutyOrder');

export default {
    addDuty: async (request, response) => {
        let groupId = request.params.groupId;
        let oldDuty = await Duty.findOne().where('groupId').equals(groupId);
        if (oldDuty) {
            let oldDutyOrders = await DutyOrder.find().where('groupId').equals(groupId);
            await oldDutyOrders.forEach(function (duty) {
                duty.delete();
            });
        }

        let dutyList = new Duty();
        dutyList.length = request.body.length;
        dutyList.groupId = groupId;

        let group = await Group.findOne({_id: groupId}).populate('members');
        await group.attachDuty(dutyList);

        let todayDate = new Date();

        request.body.order.forEach(function (duty) {
            for (let i = 0; i < dutyList.length; i++) {
                let dutyOrder = new DutyOrder();
                dutyOrder.user = duty.member;
                dutyOrder.groupId = groupId;
                todayDate.setDate(todayDate.getDate() + 1);
                dutyOrder.date = todayDate.toISOString().slice(0, 10);
                dutyOrder.save().catch((err) => {
                    return response.status(400).json(err);
                });

                dutyList.attachDutyOrder(dutyOrder)
            }
        });

        dutyList.save().then((dutyList) => {
            return response.json({dutyList: dutyList});
        }).catch((err) => {
            return response.status(400).json(err);
        });
    },

    getDuties: (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate([
            {
                path: 'duties',
                populate: [
                    {
                        path: 'dutyOrder',
                        model: 'DutyOrder',
                    },
                ],

                options: {
                    limit: 1,
                    sort: {
                        createdAt: -1
                    }
                }
            }
        ]).then((group) => {
            let duties = group.duties;

            return response.json({duties: duties});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

}
