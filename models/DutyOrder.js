import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DutyOrderSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    order: Number,
}, {timestamps: true});

mongoose.model('DutyOrder', DutyOrderSchema);
