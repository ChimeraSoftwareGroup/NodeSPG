const unitTest = require("../app/routes/controllers");

// id_player that exist -99 / that don't exist -98
// idRoom that exist -99
// password that exist -1234 / that don't exist -1235

describe("add a player in a room that exist and make him leave", function() {
    test('add a player in a room that exist and make him leave', async () => {
      const joinRoom = await unitTest.joinRoom({body:{id_player:-99, password:-1234}}, true)
      expect(joinRoom.rowCount).toBe(1);
      const leaveRoom = await unitTest.leaveRoom({params:{idPlayer: -99, idRoom:-99}}, true)
      expect(leaveRoom.rowCount).toBe(1);
    });
  });

describe("add an inexistante player in a room that exist", function() {
  test('add an inexistante player in a room that exist', async () => {
    try {
        const joinRoom = await unitTest.joinRoom({body:{id_player:-98, password:-1234}}, true)
        expect(joinRoom).toThrowError;
      } catch (error) {
        console.log(error.detail)
      }
  });
});

describe("add an existante player in a room that do not exist", function() {
    test('add an existante player in a room that do not exist', async () => {
          const joinRoom = await unitTest.joinRoom({body:{id_player:-99, password:-1235}}, true)
          expect(joinRoom).toThrowError;
    });
  });
  