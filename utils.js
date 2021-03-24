const { BadRequestError } = require("./expressError");


/** Convert strNums like ["1","2","3"] to [1, 2, 3]. */

function validateNums(strNums) {
  nums = strNums.map(num => isNaN(parseInt(num))? num : parseInt(num));
  //catch not number in query string
  if( nums.some(num => !Number.isInteger(num) )){
    firstWrong = nums.filter(num => !Number.isInteger(num))[0];
    
    throw new BadRequestError(`${firstWrong} is not a number`);
  }
}


module.exports = { validateNums };