import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DutySchema = new mongoose.Schema({
    length: Number,
    dutyOrder: [{type: Schema.Types.ObjectId, ref: 'DutyOrder'}]
}, {timestamps: true});

DutySchema.methods.attachDutyOrder = function (dutyOrder) {
    this.dutyOrder.push(dutyOrder._id);
};

mongoose.model('Duty', DutySchema);
