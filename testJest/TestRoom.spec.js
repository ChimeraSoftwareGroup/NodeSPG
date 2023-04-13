const unitTest = require("../app/routes/controllers");

// room that exist name:"roomTest" / that don't exist id:-9999

describe("add and delete room that exist", function() {
    test('add and delete room', async () => {
      const addroom = await unitTest.addRoom({body:{name:"roomTest"}}, true)
      expect(addroom.rowCount).toBe(1);
      expect(await unitTest.deleteRoom({params:{id:addroom.rows[0].id}})).toBe(1);
    });
  });
  
describe("delete room that don't exist", function() {
    test('delete room', async () => {
      expect(await unitTest.deleteRoom({params:{id:-9999}})).toBe(0);
    });
  });
  