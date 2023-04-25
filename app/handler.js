// Will generate a 4 random digit number for the password
function createPassword() {
  var password = Math.floor(1000 + Math.random() * 9000);
  return password;
}

const aze = countGames(5,20,10)
function countGames(min, max, count) {
  const arrayGames = [];
  let previousNum = null;
    for (let i = 0; i < count; i++) {
      let randomGames = Math.floor(Math.random() * (max - min + 1)) + min;
      while (randomGames === previousNum) {
        randomGames = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      arrayGames.push(randomGames);
      previousNum = randomGames;
    }
    return arrayGames;
  }

async function returnApi(request, response, callBack){
  const results = await callBack(request);
  response.status(200).json(results);
}

// Return the password
module.exports = {
  createPassword,
  returnApi,
  countGames
};
