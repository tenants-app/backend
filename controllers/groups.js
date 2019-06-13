import mongoose from 'mongoose';
import crypto from 'crypto';

const User = mongoose.model('User');
const Group = mongoose.model('Group');
const GroupActivationLink = mongoose.model('GroupActivationLink');

export default {

    addGroup: (request, response) => {
        let group = new Group();
        group.name = request.body.name;
        group.owner = request.user._id;
        group.members.push(request.user._id);

        group.save().then(() => {
            return response.json({group: group});
        }).catch((err) => {
            return response.status(400).json(err);
        });
    },

    getGroup: async (request, response) => {
        Group.findOne({_id: request.params.groupId}).then((group) => {
            if (!group.members.some(member => member.equals(request.user._id))) {
                return response.status(403).json({message: "Not a group member"});
            }
            return response.json({group: group});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    leaveGroup: async (request, response) => {
        await Group.findOne({_id: request.params.groupId}).then(async (group) => {
            if (!group.members.some(member => member.equals(request.user._id))) {
                return response.status(403).json({message: "Not a group member"});
            } else {
                await group.detachMember(request.user._id);
            }
            return response.json("Group left successfully");
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    getGroupMembers: async (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate(['members']).then((group) => {
            return response.json({members: group.members});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    getGroupMember: (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate({
            path: 'members',
            match: {
                _id: request.params.id
            }
        }).then((group) => {
            if (group.members[0] == null) {
                throw new Error('Member not found');
            }
            return response.json({member: group.members[0]});
        }).catch((err) => {
            return response.status(404).json({error: {message: err.message}});
        });
    },

    generateMemberLink: (request, response, next) => {
        let memberLink = new GroupActivationLink();
        memberLink.email = request.body.email;
        memberLink.group_id = request.body.group_id;
        memberLink.token = crypto.randomBytes(64).toString('hex');
        memberLink.link = `${request.protocol}://${request.get('host')}/groups/activate_member/${memberLink.token}`;

        memberLink.save().then(() => {
            return response.json({link: memberLink.link});
        }).catch((err) => {
            return response.status(400).json(err);
        });
    },

    activateMember: async (request, response) => {
        let linkToken = request.params.token;

        let activationLink = await GroupActivationLink.findOne({token: linkToken});
        let user = await User.findOne({email: activationLink.email});
        let group = await Group.findOne({_id: activationLink.group_id});

        if (!activationLink || !user || !group) {
            return response.redirect(process.env.FRONTEND_URL + '/fail');
        }

        group.attachMember(user);

        group.save().then(() => {
            return response.redirect(process.env.FRONTEND_URL + '/success');
        }).catch((err) => {
            return response.redirect(process.env.FRONTEND_URL + '/fail');
        });
    }

}
