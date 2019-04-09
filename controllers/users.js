import mongoose from 'mongoose';
const User = mongoose.model('User');

export default {
  
  getUsers: (req, res, next) => {
    User.find({},{"username":1, "email":1}).then((users) => {
      return res.json({users: users});
    }).catch((err) => {
      return res.status(400).json(err);
    });
  }

}