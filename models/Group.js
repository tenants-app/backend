import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GroupSchema = new mongoose.Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }, {timestamps: true});

GroupSchema.methods.attachMember = (user) => {
  let memberExist = this.members.some(member => member.equals(user._id));

  if(!memberExist){
    this.members.push(user._id);
  }
}

mongoose.model('Group', GroupSchema);