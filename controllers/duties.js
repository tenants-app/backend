import mongoose from 'mongoose';

const Group = mongoose.model('Group');
const Duty = mongoose.model('Duty');
const DutyOrder = mongoose.model('DutyOrder');

export default {
    addDuty: async (request, response) => {
        let dutyList = new Duty();
        dutyList.length = request.body.length;

        let group = await Group.findOne({_id: request.params.groupId}).populate('members');
        await group.attachDuty(dutyList);

        request.body.order.forEach(function (duty) {
            let dutyOrder = new DutyOrder();
            dutyOrder.user = duty.member;
            dutyOrder.order = duty.order;

            dutyOrder.save().catch((err) => {
                return response.status(400).json(err);
            });

            dutyList.attachDutyOrder(dutyOrder)
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
                model: 'Duty',
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
