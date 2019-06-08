import mongoose from 'mongoose';

const Group = mongoose.model('Group');
const Duty = mongoose.model('Duty');
const DutyOrder = mongoose.model('DutyOrder');
const MembersOrder = mongoose.model('MembersOrder');

export default {
    addDuty: async (request, response) => {
        let groupId = request.params.groupId;
        let oldDuty = await Duty.findOne().where('groupId').equals(groupId);
        if (oldDuty) {
            let oldMembersOrders = await MembersOrder.find().where('groupId').equals(groupId);
            await oldMembersOrders.forEach(function (member) {
                member.delete();
            });
            let oldDutyOrders = await DutyOrder.find().where('groupId').equals(groupId);
            await oldDutyOrders.forEach(async function (duty) {
                await duty.delete();
            });
            await oldDuty.delete();
        }

        let dutyList = new Duty();
        dutyList.length = request.body.length;
        dutyList.groupId = groupId;

        let group = await Group.findOne({_id: groupId}).populate('members');
        await group.attachDuty(dutyList);

        let todayDate = new Date();

        let count = 0;
        do {
            request.body.order.forEach(function (member) {
                for (let i = 0; i < dutyList.length; i++) {
                    let dutyOrder = new DutyOrder();
                    dutyOrder.user = member;
                    dutyOrder.username = member.username;
                    dutyOrder.groupId = groupId;
                    todayDate.setDate(todayDate.getDate() + 1);
                    dutyOrder.date = todayDate.toISOString().slice(0, 10);
                    dutyOrder.save().catch((err) => {
                        return response.status(400).json(err);
                    });

                    dutyList.attachDutyOrder(dutyOrder)
                    count++;
                }
            });
        } while (count < 7);

        request.body.order.forEach(function (member) {
            let membersOrder = new MembersOrder();
            membersOrder.user = member;
            membersOrder.username = member.username;
            membersOrder.groupId = groupId;
            membersOrder.save().catch((err) => {
                return response.status(400).json(err);
            });

            dutyList.attachMembersOrder(membersOrder)
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
            let duties;
            group.duties[0] ? duties = group.duties[0].dutyOrder : duties = [];
            return response.json({duties: duties});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    runCron: async () => {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        let yesterday = date.toISOString().slice(0, 10);

        let oldDuties = await DutyOrder.find().where('date').equals(yesterday);
        if (oldDuties.length) {
            await oldDuties.forEach(async function (oldDuty) {
                let updatedDuty = await Duty.findOne().where('groupId').equals(oldDuty.groupId);
                await updatedDuty.detachDutyOrder(oldDuty._id);
                oldDuty.delete();
            });
        }

        let duties = await Duty.find({}, async function (err, duties) {
            let dutyMap = [];

            await duties.forEach(function (duty) {
                dutyMap.push(duty);
            });
            return dutyMap;
        });

        duties.forEach(async function (dutyOrder) {
                if (dutyOrder.dutyOrder.length <= 7) {
                    let membersOrder = await MembersOrder.find().where('groupId').equals(dutyOrder.groupId)
                    let schedule = await DutyOrder.find().where('groupId').equals(dutyOrder.groupId)
                    let lastDate = new Date(schedule[schedule.length - 1].date);
                    membersOrder.forEach(async function (member) {
                        for (let i = 0; i < dutyOrder.length; i++) {
                            let newDutyOrder = new DutyOrder();
                            newDutyOrder.user = member;
                            newDutyOrder.username = member.username;
                            newDutyOrder.groupId = member.groupId;
                            lastDate.setDate(lastDate.getDate() + 1);
                            newDutyOrder.date = lastDate.toISOString().slice(0, 10);
                            newDutyOrder.save();

                            let updatedDuty = await Duty.findOne().where('groupId').equals(member.groupId);
                            await updatedDuty.attachDutyOrder(newDutyOrder)
                            updatedDuty.save();
                        }
                    })
                }
            }
        )
    }
}
