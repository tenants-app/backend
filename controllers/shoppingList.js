import mongoose from 'mongoose';

const Group = mongoose.model('Group');
const Debtor = mongoose.model('Debtor');
const ShoppingList = mongoose.model('ShoppingList');
const Product = mongoose.model('Product');

export default {

    addShoppingList: async (request, response) => {
        let shoppingList = new ShoppingList();
        shoppingList.name = request.body.name;
        shoppingList.user = request.user._id;

        let group = await Group.findOne({_id: request.params.groupId}).populate('members');
        await group.attachShoppingList(shoppingList);

        let sum = 0;

        request.body.products.forEach(function (product) {
            let newProduct = new Product();
            newProduct.name = product.name;
            newProduct.value = product.value;
            sum += newProduct.value;

            newProduct.save().catch((err) => {
                return response.status(400).json(err);
            });

            shoppingList.attachProduct(newProduct)
        });

        group.members.forEach(function (debtor) {
            let newDebtor = new Debtor();
            newDebtor.user = debtor._id;
            newDebtor.value = Math.round(sum / group.members.length * 100) / 100;

            newDebtor.save().catch((err) => {
                return response.status(400).json(err);
            });

            shoppingList.attachDebtor(newDebtor)
        });

        shoppingList.value = sum;
        shoppingList.save().then((shoppingList) => {
            return response.json({shoppingList: shoppingList});
        }).catch((err) => {
            return response.status(400).json(err);
        });
    },

    getShoppingLists: (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate([
            {
                path: 'shoppingLists',
                populate: [
                    {
                        path: 'user',
                        model: 'User'
                    },
                    {
                        path: 'debtors',
                        model: 'Debtor',
                        match: {
                            user: request.user._id
                        },
                    }
                ],
                options: {
                    sort: {
                        createdAt: -1
                    }
                }
            }
        ]).then((group) => {
            let lists = group.shoppingLists;

            return response.json({shoppingLists: lists});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    getShoppingList: (request, response) => {
        Group.findOne({_id: request.params.groupId}).populate([
            {
                path: 'shoppingLists',
                populate: [
                    {
                        path: 'user',
                        model: 'User'
                    },
                    {
                        path: 'debtors',
                        model: 'Debtor'
                    },
                    {
                        path: 'products',
                        model: 'Product',
                    }
                ],
                options: {
                    sort: {
                        createdAt: -1
                    }
                }
            }
        ]).then((group) => {
            let lists = group.shoppingLists;

            return response.json({shoppingLists: lists});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

}
