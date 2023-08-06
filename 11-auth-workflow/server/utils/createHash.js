const crypto = require('crypto')

// This function is to hash the tokens sent during authentication
const hashString= (string)=> crypto.createHash('md5').update(string).digest('hex')

module.exports= hashString;

/* 
    1. createHash method takes a name of an algorithm for hashing i.e. md5 in this case

    2. update method takes the string to be hashed

    3. digest method returns a string if encoding i.e. hex is provided

*/ 