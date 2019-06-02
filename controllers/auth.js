import mongoose from 'mongoose';
import passport from 'passport';
const User = mongoose.model('User');

export default {

  login: (req, res, next) => {

    passport.authenticate('local', {session: false}, (err, user, info) => {
      
      if(err){ 
        return next(err); 
      }

      if(user){
        user.token = user.generateJWT();
        return res.json({user: user.toAuthJSON()});
      } else {
        return res.status(422).json(info);
      }

    })(req, res, next);
  },

  register: (req, res, next) => {
    let user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.bank_account_number = req.body.bank_account_number;
    user.setPassword(req.body.password);

    user.save().then(() => {
      return res.json({user: user.toAuthJSON()});
    }).catch((err) => {
      return res.status(400).json(err);
    });
  }
  
}