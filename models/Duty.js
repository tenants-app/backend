import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DutySchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    inOrder: Number,
}, {timestamps: true});

mongoose.model('Duty', DutySchema);
