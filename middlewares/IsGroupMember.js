import mongoose from 'mongoose';

const Group = mongoose.model('Group');

module.exports = function (request, response, next) {
    Group.findOne({_id: request.params.groupId}).then((group) => {
        if (!group.members.some(member => member.equals(request.user._id))) {
            return response.status(403).json({message: "Not a group member"});
        }
    }).catch((err) => {
        return response.status(404).json({error: {message: "Group cannot be found"}});
    });

    return next();
};
