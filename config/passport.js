var passport      = require('passport');        //passport package is the most common package for controlling accounts.
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../models/User');

passport.serializeUser(function(user, done) {         //Session 생성 시에 어떠한 정보를 저장할지를 설정.
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {         //Session으로부터 개체를 가져올 때 어떻게 가져올 지를 정하는 것.
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login',
  new LocalStrategy({             //Used local-strategy
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      User.findOne({ 'email' :  email }, function(err, user) {
        if (err) return done(err);

        if (!user){
            req.flash("email", req.body.email);
            return done(null, false, req.flash('loginError', 'No user found.'));
        }
        if (!user.authenticate(password)){
            req.flash("email", req.body.email);
            return done(null, false, req.flash('loginError', 'Password does not Match.'));
        }
        req.flash('postsMessage', 'Welcome '+user.nickname+'!');
        return done(null, user);
      });
    }
  )
);

module.exports = passport;
