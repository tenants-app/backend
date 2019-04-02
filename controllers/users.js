import mongoose from 'mongoose';
const User = mongoose.model('User');

export const getUsers = (req, res, next) => {
  User.find({},{"username":1, "email":1}).then((users) => {
    return res.json({users: users});
  }).catch(next);
}