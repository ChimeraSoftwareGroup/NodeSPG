const unitTest = require("../app/routes/controllers");

// id_player that exist -999 / that don't exist -789
// idRoom that exist -999 / that don't exist -789

describe("Make a player leave a room that exist", function () {
  test("Make a player leave a room that exist", async () => {
    const leaveRoom = await unitTest.leaveRoom(
      { params: { idPlayer: -999} },
      true
    );
    expect(leaveRoom.rowCount).toBe(1);
    const joinRoom = await unitTest.joinRoom(
      { body: { id_player: -999, password: -9999 } },
      true
    );
    expect(joinRoom.rowCount).toBe(1);
  });
});

describe("Make an inexistante player leave a room that exist", function () {
  test("Make an inexistante player leave a room that exist", async () => {
    const leaveRoom = await unitTest.leaveRoom(
      { params: { idPlayer: -789} },
      true
    );
    expect(leaveRoom.rowCount).toBe(0);
  });
});
