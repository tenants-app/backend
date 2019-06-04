import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DebtSchema = new mongoose.Schema({
    name: String,
    value: Number,
    paid: { type: Boolean, default: false },
    holder: { type: Schema.Types.ObjectId, ref: 'User' },
    debtor: { type: Schema.Types.ObjectId, ref: 'User' },
  }, {timestamps: true});


mongoose.model('Debt', DebtSchema);