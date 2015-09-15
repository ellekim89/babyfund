var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async');
var ejsLayouts = require('express-ejs-layouts');
var stripe = require("stripe")("sk_test_F8Pizi0SuGbisxMw1ogiNkl8");
var app = express();
var db = require('./models');


app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(session({
 secret:"o12i3qwreaq3roj4t5haw4",
 resave: false,
 saveUninitialized: true
}));
app.use(flash());

// USERS LOGGING IN
app.use(function(req,res,next){
	if(req.session.user){
		db.user.findById(req.session.user).then(function(user){
			req.currentUser = user;
			next();
		});
	}else {
		req.currentUser = false;
		next();
	}
});



app.use(function(req,res,next){
	res.locals.currentUser = req.currentUser;
	if(req.currentUser){
		var cleanUser = req.currentUser.get();
		delete cleanUser.password;
	}else{
		var cleanUser = false;
	}
	res.locals.cleanUser = cleanUser;
	res.locals.alerts = req.flash();
	next();
});


app.get('/', function(req, res){
	res.render('index');
})

app.get('/login', function(req, res){
	res.render('main/login');
})

app.post('/login', function(req,res){
	db.user.authenticate(req.body.email, req.body.password, function(err,user){
		if(err){
			res.send(err)
		}else if(user){
			req.session.user = user.id;
			req.flash('success', 'You are logged in.')
			res.redirect('/')
		}else{
			req.flash('danger', 'invalid username or password');
			res.redirect('/login')
		}
	})
})

app.get('/logout',function(req,res){
  req.flash('info','You have been logged out.');
  req.session.user = false;
  res.redirect('/');
});

app.get('/register', function(req, res){
	res.render('main/register');
})

// USERS SIGNING UP

app.post("/register", function(req,res){
	if(req.body.password != req.body.password2){
		req.flash('danger', 'Passwords must match');
		res.redirect('/register');
	}else{
		db.user.findOrCreate({
			where: {
				email: req.body.email
			},
			defaults: {
				email: req.body.email,
				password: req.body.password,
				username: req.body.username
			}
		}).spread(function(user,created){
			if(created){
				req.session.user = user.id;
				req.flash('success', 'You are signed up!');
				res.redirect('/profile');
			}
		}).catch(function(err){
			if(err.message){
				req.flash('danger',err.message);
				console.log(err);
			}
			res.redirect('/register');
		})
	}
})

app.get('/profile', function(req, res){
	res.render('main/profile');
})

app.get('/child', function(req, res){
	var stripeToken = req.body.stripeToken;
	res.render('child/index');
})

app.post('/child/thankyou', function(req,res){
	res.render('child/thankyou');
})

app.listen(3000);