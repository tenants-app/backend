const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');


router.get('/', (req, res, next) => {
  User.find({},{"username":1, "email":1}).then((users) => {
    return res.json({users: users});
  }).catch(next);
});


module.exports = router;
