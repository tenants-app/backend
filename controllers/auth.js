import mongoose from 'mongoose';
import passport from 'passport';
const User = mongoose.model('User');

export const login = (req, res, next) => {
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

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
};


export const register = (req, res, next) => {
  let user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save().then(() => {
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
};