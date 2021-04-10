var express = require('express');
var router = express.Router();
var ApplicationForm = require('./../model/applicationFormModel');
var User = require('./../model/userModel');

/* add appliction form by id */
router.post('/add', function (req, res) {
    var response = {};
    let newApplicationForm = new ApplicationForm(req.body);
    User.findOne({ _id: req.body.id}, function (err, user) {
        if (err) {
            response = { success: false, message: err };
        } else {
            if(user == null ) {
                response = { success: true, message: 'user is not exist' };
            } else{
                newApplicationForm.user = user._id;
                newApplicationForm.save();
                response = { success: true, message: 'application form submitted' };
            }
        }
        res.json(response);
    });

});

/* get appliction form by id */
router.post('/get', function (req, res) {
    ApplicationForm.findOne({ user: req.body.id}, function (err, appForm) {
        if (err) {
            response = { success: false, message: err };
        } else {
            if(appForm == null ) {
                response = { success: true, message: 'Application form is not exist' };
            } else{
                response = { success: true, data: appForm };
            }
        }
        res.json(response);
    });

});

module.exports = router;
