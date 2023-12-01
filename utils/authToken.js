const jwt = require('jsonwebtoken');
require("dotenv").config();

function generateAuthToken(payload,expiresIn) {
  const token = jwt.sign(payload, process.env.HASHPASS,{expiresIn});
  return token;
}

module.exports={
    generateAuthToken
}