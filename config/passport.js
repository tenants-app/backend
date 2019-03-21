const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const secret = require('.').secret;
const User = mongoose.model('User');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
	  usernameField: 'email',
	  passwordField: 'password'
	}, function(email, password, done) {
	  return User.findOne({email: email})
	  		.then(user => {
			    if(!user || !user.validPassword(password)){
			      return done(null, false, {errors: {'email or password': 'is invalid'}});
			    }
			    return done(null, user);
		    })
		    .catch(err => {
	            return done(err);
	        });
	}
));

passport.use(new JWTStrategy({
	    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	    secretOrKey: secret
	}, function (jwtPayload, done) {
	    return User.findById(jwtPayload.id)
	        .then(user => {
	            return done(null, user);
	        })
	        .catch(err => {
	            return done(err);
	        });
	}
));