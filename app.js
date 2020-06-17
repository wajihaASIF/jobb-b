const express = require ('express');
const expressLayouts = require ('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

 const app= express();

 // configure passport
 require('./config/passport')(passport);
 
 //Database
 const db = require('./config/keys').MongoURI;

 //Connection
 mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('mongo connected')) 
 .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//BodyParser
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true

}));
 // passport middleware
 app.use(passport.initialize());
 app.use(passport.session());
 
//Connect flash
app. use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
 // Routes
 app.use('/', require('./routes/index'));
 app.use('/users', require('./routes/users'));




 
 



 const PORT = process.env.PORT || 5000;

 app.listen(PORT,console.log(`server started on port ${PORT}`));
 