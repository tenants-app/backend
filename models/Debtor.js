import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DebtorSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    value: Number,
    paid: { type: Boolean, default: false }
  }, {timestamps: false});

mongoose.model('Debtor', DebtorSchema);