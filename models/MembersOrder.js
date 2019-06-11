import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MembersOrderSchema = new mongoose.Schema({
    groupId: String,
    username: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

mongoose.model('MembersOrder', MembersOrderSchema);
