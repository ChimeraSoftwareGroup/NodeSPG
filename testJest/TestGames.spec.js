const unitTest = require("../app/routes/controllers");

describe("get all games", function() {
  test('get all games', async () => {
    expect(await unitTest.getGames()).toBeInstanceOf(Array);
  });
});
