/** Simple demo Express app. */

const express = require("express");
const app = express();
const {findMean, findMedian, findMode} = require('./stats');
const {ExpressError,NotFoundError,UnauthorizedError,BadRequestError,ForbiddenError} = require('./expressError')
const { validateNums } = require('./utils');
// useful error class to throw


const MISSING = "Expected key `nums` with comma-separated list of numbers.";

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next) {
  if(!req.query.nums){
    return next( new BadRequestError(MISSING));
  }
  let params = req.query.nums.split(',');
  validateNums(params);
  req.query.nums = params.map(num => parseInt(num));
  return next();
})
/** Finds mean of nums in qs: returns {operation: "mean", result } */

app.get('/mean', function(req, res, next) {
  nums = req.query.nums;
  let value = findMean(nums);
  response = {operation: 'mean', value};
  return res.json({response});
});


/** Finds median of nums in qs: returns {operation: "median", result } */
app.get('/median', function(req, res, next) {
  nums = req.query.nums;
  let value = findMedian(nums);
  response = {operation: 'median', value};
  return res.json({response});
});

/** Finds mode of nums in qs: returns {operation: "mean", result } */
app.get('/mode', function(req, res, next) {
  nums = req.query.nums;
  let value = findMode(nums);
  response = {operation: 'mode', value};
  return res.json({response});
});

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