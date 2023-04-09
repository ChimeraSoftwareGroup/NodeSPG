const unitTest = require("../app/routes/controllers");

describe("get all games", function() {
  test('get all games', async () => {
    expect(await unitTest.getGames()).toBeInstanceOf(Array);
  });
});

describe("add and delete room", function() {
  test('add and delete room', async () => {
    const addroom = await unitTest.addRoom({body:{name:"roomTest"}}, true)
    expect(addroom.rowCount).toBe(1);
    expect(await unitTest.deleteRoom({params:{id:addroom.rows[0].id}})).toBe(1);
  });
});

