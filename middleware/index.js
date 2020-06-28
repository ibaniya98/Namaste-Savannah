let User = require('../models/user');
let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	// return next();
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to perform the action");
	let requestedUrl = encodeURIComponent(req.url);
	res.redirect('/login?redirectUrl=' + requestedUrl);
};

middlewareObj.isAuthorized = function(req, res, next){
	// return next();
    if (req.isAuthenticated()) {
		if (req.user.isAdmin){
			next();
		}
		else{
			req.flash("error", "You are not authorized user. Please contact the administrator");
			res.redirect('back');
		}		
	} else {
		req.flash("error", "You need to be logged in to perform the action");
		res.redirect('/login');
	}
}

module.exports = middlewareObj;