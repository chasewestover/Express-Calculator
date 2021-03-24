/** Simple demo Express app. */

const express = require("express");
const app = express();
const {findMean, findMedian, findMode} = require('./stats');
const {ExpressError,NotFoundError,UnauthorizedError,BadRequestError,ForbiddenError} = require('./expressError')

// useful error class to throw

const MISSING = "Expected key `nums` with comma-separated list of numbers.";

app.use(express.json());

app.use(express.urlencoded({extended: true}));

/** Finds mean of nums in qs: returns {operation: "mean", result } */

app.get('/mean', function(req, res, next) {
  //catch when no nums given in query string
  if(!req.query.nums){
    return next( new BadRequestError(MISSING));
  }
  let params = req.query.nums;
  nums = params.split(',').map(num => isNaN(parseInt(num))? num : parseInt(num));
  //catch not number in query string
  if( nums.some(num => !Number.isInteger(num) )){
    firstWrong = nums.filter(num => !Number.isInteger(num))[0];
    
    return next( new BadRequestError(`${firstWrong} is not a number`) );
  }
  let value = findMean(nums);
  response = {operation: 'mean', value};
  return res.json({response});
});


/** Finds median of nums in qs: returns {operation: "median", result } */


/** Finds mode of nums in qs: returns {operation: "mean", result } */


/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});



module.exports = app;