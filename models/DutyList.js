import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DutyListSchema = new mongoose.Schema({
    date: String,
    duties: [{ type: Schema.Types.ObjectId, ref: 'Duty' }]
}, {timestamps: true});

DutyListSchema.methods.attachDuty = function(duty) {
    this.duties.push(duty._id);
};

mongoose.model('DutyList', DutyListSchema);
