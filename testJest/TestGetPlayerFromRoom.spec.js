const unitTest = require("../app/routes/controllers");

describe("get all player in a room that exist", function() {
    test('get all player in a room', async () => {
      const addroom = await unitTest.addRoom({body:{name:"roomTest"}}, true)
      expect(await unitTest.getAllPlayerInRoom({params:{id:addroom.rows[0].id}})).toBeInstanceOf(Array);
      expect(await unitTest.deleteRoom({params:{id:addroom.rows[0].id}})).toBe(1);
    });
   });
   
   describe("get all player in a room that don't exist", function() {
    test('get all player in a room', async () => {
      // catch error
      const getAllPlayerInRoom = await unitTest.getAllPlayerInRoom({params:{id:-9999}})
      expect(getAllPlayerInRoom).toThrowError;
    });
    });