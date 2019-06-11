import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ShoppingListSchema = new mongoose.Schema({
    name: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    debtors: [{ type: Schema.Types.ObjectId, ref: 'Debtor' }]
}, {timestamps: true});

ShoppingListSchema.methods.attachProduct = function(product) {
    this.products.push(product._id);
};

ShoppingListSchema.methods.attachDebtor = function(debtor) {
    this.debtors.push(debtor._id);
};

mongoose.model('ShoppingList', ShoppingListSchema);
