import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GroupSchema = new mongoose.Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }],
    debts: [{ type: Schema.Types.ObjectId, ref: 'Debt' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }, {timestamps: true});

GroupSchema.methods.attachMember = function(user) {
  let memberExist = this.members.some(member => member.equals(user._id));

  if(!memberExist){
    this.members.push(user._id);
  }
};

GroupSchema.methods.attachBill = function(bill) {
    this.bills.push(bill._id);

    this.save().catch((err) => {
        throw new Error("Couldn't attach bill")
    });
};

GroupSchema.methods.attachDebt = function(debt) {
    this.debts.push(debt._id);

    this.save().catch((err) => {
        throw new Error("Couldn't attach debt")
    });
};


mongoose.model('Group', GroupSchema);