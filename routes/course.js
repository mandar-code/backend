var express = require('express');
var router = express.Router();
var Course = require('./../model/courseModel');

/* get courses */
router.get('/fetch', function (req, res, next) {
    let response = {};
    Course.find(function (err, courses) {
      if (err) {
        response = { success: false, message: err };
      } else {
        response = { success: true, data: courses };
      }
      return res.json(response);
    });
  });
  
  /* save courses */
  router.post('/save', function (req, res, next) {
    let response = {};
    let newCourse = new Course(req.body)
    newCourse.save(function (err, courses) {
      if (err) {
        response = { success: false, message: err };
      } else {
        response = { success: true, message: 'course added successfully' };
      }
      return res.json(response);
    });
  });

module.exports = router;
