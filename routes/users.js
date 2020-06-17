const express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

var ObjectId = require('mongoose').Types.ObjectId;

// Load User model
const User = require('../models/User');


// Login Page
router.get('/login',  (req, res) => res.render('login'));

// Register Page
router.get('/register',(req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2,role } = req.body;

  let errors = [];

  if (!name || !email || !password || !password2|| !role) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      role
     
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          role
         
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role
      
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {

            if (err) throw err;
            newUser.password = hash;
            // save user
            newUser.save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                console.log(newUser.name);
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Show db data
router.get('/dashboard', (req, res) => {
  // working :get all records
  
      User.find((err, docs) => {
          if (!err) { res.send(docs); }
          else { console.log('Error') }
      });
  });

  //Get single user for edit record
  router.get('/edit/:id',function(req,res){
console.log(req.params.id);
User.findById(req.params.id, function(err, User){
  if (err){
    console.log(err);
  }
  else {
    console.log(User);
    res.render('edit',{users: User})
  }
})
  })
  // edit delete
  router.post('/edit/:id', (req, res) => {

    var emp = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2,
    };
    
    User.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/dashboard'); }
        else { console.log("Error"); }
    });
});



router.get('/delete/:id',(req,res)=>{
User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err){
        res.redirect('/dashboard')
      }
        else { console.log('Error') }
        
        
    });

});






module.exports = router;
