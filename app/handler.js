function createPassword(){
    var password = Math.floor(1000 + Math.random() * 9000);
    return password
}

module.exports = {
    createPassword
  };
  