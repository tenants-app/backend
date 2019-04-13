import mongoose from 'mongoose';

const GroupActivationLinkSchema = new mongoose.Schema({
    link: String,
    token: String,
    email: String,
    group_id: String
}, {timestamps: true});

mongoose.model('GroupActivationLink', GroupActivationLinkSchema);