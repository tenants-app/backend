import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BillSchema = new mongoose.Schema({
    name: String,
    value: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    debtors: [{ type: Schema.Types.ObjectId, ref: 'Debtor' }],
  }, {timestamps: true});

BillSchema.methods.attachDebtor = function(debtor) {
    this.debtors.push(debtor._id);
};

mongoose.model('Bill', BillSchema);