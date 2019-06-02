import mongoose from 'mongoose';

const User = mongoose.model('User');
const Group = mongoose.model('Group');

export default {

    getUsers: (req, res, next) => {
        User.find().then((users) => {
            return res.json({users: users});
        }).catch((err) => {
            return res.status(400).json(err);
        });
    },

    getUserGroups: (req, res, next) => {
        Group.find({members: req.user._id}).populate(['members', 'owner']).then((groups) => {
            return res.json({groups: groups});
        }).catch((err) => {
            return res.status(400).json(err);
        });
    }

}