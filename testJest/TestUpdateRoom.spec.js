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
