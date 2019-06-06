import mongoose from 'mongoose';

const Group = mongoose.model('Group');
const Duty = mongoose.model('Duty');
const DutyList = mongoose.model('DutyList');

export default {
    addDuty: async (request, response) => {
        let dutyList = new DutyList();

        let group = await Group.findOne({_id: request.params.groupId}).populate('members');
        await group.attachDutyList(dutyList);

        request.body.duties.forEach(function (duty) {
            let newDuty = new Duty();
            newDuty.user = duty.member;
            newDuty.name = duty.duty;

            newDuty.save().catch((err) => {
                return response.status(400).json(err);
            });

            dutyList.attachDuty(newDuty)
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
                        path: 'user',
                        model: 'User'
                    },
                    {
                        path: 'duties',
                        model: 'Duty'
                    }
                ],
                options: {
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
