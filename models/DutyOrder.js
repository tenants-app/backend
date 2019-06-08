import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DutyOrderSchema = new mongoose.Schema({
    groupId: String,
    date: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

mongoose.model('DutyOrder', DutyOrderSchema);
