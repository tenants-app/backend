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

        shoppingList.save().then((shoppingList) => {
            return response.json({shoppingList: shoppingList});
        }).catch((err) => {
            return response.status(400).json(err);
        });
    },

    getShoppingList: (request, response) => {
        ShoppingList.findOne({_id: request.params.id}).populate([
            {
                path: 'products',
            },
            {
                path: 'debtors',
                populate: [
                    {
                        path: 'user',
                        model: 'User'
                    },
                ],
            },
            {
                path: 'user',
            }
        ]).then(shoppingList => {
            return response.json({shoppingList: shoppingList});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Shopping list cannot be found"}});
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

            let lists = group.shoppingLists.map(list => {
                list = list.toObject();

                list.value = 0;
                
                list.debtors.forEach(debtor => {
                    list.value += debtor.value;
                });

                list.debtors.sort((a, b) => {
                    return b._id === request.user._id ? -1 : 1;
                });

                return list;
            });


            return response.json({shoppingLists: lists});
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },

    setAsPaid: (request, response) => {
        ShoppingList.findOne({_id: request.params.id}).populate([
            {
                path: 'debtors',
                model: 'Debtor',
                match: {
                    user: request.user._id
                },
            }
        ]).then(shoppingList => {
            let debtor = shoppingList.debtors[0];
            debtor.paid = !debtor.paid;

            debtor.save().then((debtor) => {
                return response.json({debtor: debtor});
            }).catch((err) => {
                return response.status(400).json(err);
            });
        }).catch((err) => {
            return response.status(404).json({error: {message: "Group cannot be found"}});
        });
    },
}
