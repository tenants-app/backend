import mongoose from 'mongoose';
import crypto from 'crypto';
const User = mongoose.model('User');
const Group = mongoose.model('Group');
const GroupActivationLink = mongoose.model('GroupActivationLink');

export default {

    addGroup: (req, res, next) => {
        let group = new Group();
        group.name = req.body.name;
        group.owner = req.user._id;
        group.members.push(req.user._id);
    
        group.save().then(()=>{
            return res.json({group: group});
        }).catch((err) => {
            return res.status(400).json(err);
        });
    },

    generateMemberLink: (req, res, next) => {
        let memberLink = new GroupActivationLink();
        memberLink.email = req.body.email;
        memberLink.group_id = req.body.group_id;
        memberLink.token = crypto.randomBytes(64).toString('hex');
        memberLink.link = `${req.protocol}://${req.get('host')}/groups/activate_member/${memberLink.token}`;

        memberLink.save().then(()=>{
            return res.json({link: memberLink.link});
        }).catch((err) => {
            return res.status(400).json(err);
        });
    },

    activateMember: async (req, res, next) => {
        let linkToken = req.params.token;

        let activationLink = await GroupActivationLink.findOne({token:linkToken});
        let user = await User.findOne({email: activationLink.email});
        let group = await Group.findOne({_id: activationLink.group_id});

        if(!activationLink || !user || !group){
            return res.redirect(process.env.FRONTEND_URL + '/fail');
        }

        group.attachMember(user);
        
        group.save().then(() => {
            return res.redirect(process.env.FRONTEND_URL + '/success');
        }).catch((err) => {
            return res.redirect(process.env.FRONTEND_URL + '/fail');
        });
    }
    
}