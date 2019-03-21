import mongoose from 'mongoose';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import config from '.';
const secret = config.secret;
const User = mongoose.model('User');
const LocalStrategy = passportLocal.Strategy;
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