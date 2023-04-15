// Will generate a 4 random digit number for the password
function createPassword() {
  var password = Math.floor(1000 + Math.random() * 9000);
  return password;
}

async function returnApi(request, response, callBack){
  const results = await callBack(request);
  response.status(200).json(results);
}

// Return the password
module.exports = {
  createPassword,
  returnApi
};
