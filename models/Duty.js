import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DutySchema = new mongoose.Schema({
    groupId: String,
    length: Number,
    dutyOrder: [{type: Schema.Types.ObjectId, ref: 'DutyOrder'}],
    membersOrder: [{type: Schema.Types.ObjectId, ref: 'MembersOrder'}],
}, {timestamps: true});

DutySchema.methods.attachDutyOrder = function (dutyOrder) {
    this.dutyOrder.push(dutyOrder._id);
};

DutySchema.methods.detachDutyOrder = function (dutyOrder) {
    for (let i = 0; i < this.dutyOrder.length; i++) {
        if (this.dutyOrder[i].toString() === dutyOrder.toString()) {
            this.dutyOrder.splice(i, 1);
        }
    }
    this.save()
};

DutySchema.methods.attachMembersOrder = function (membersOrder) {
    this.membersOrder.push(membersOrder._id);
};

mongoose.model('Duty', DutySchema);
