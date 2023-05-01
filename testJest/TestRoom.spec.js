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

const unitTest = require("../app/routes/controllers");

describe("update room that exist", function() {
 test('update room', async () => {
   const addroom = await unitTest.addRoom({body:{name:"roomTest"}}, true)
   expect(addroom.rowCount).toBe(1);
   const updateRoom = (await unitTest.updateRoom({params:{id:addroom.rows[0].id},body:{name:"roomTest2"}}))
   expect(updateRoom.rowCount).toBe(1);
   expect(await unitTest.deleteRoom({params:{id:addroom.rows[0].id}})).toBe(1);
 });
});

describe("update room that don't exist", function() {
 test('update room', async () => {
   const updateRoom = (await unitTest.updateRoom({params:{id:-9999},body:{name:"roomTest2"}}))
   expect(updateRoom.rowCount).toBe(0);
 });
});


// get all player in a room et si n'existe pas = 2

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