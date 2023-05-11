import {
    addRoomDB as _addRoomDB,
    deleteRoomDB as _deleteRoomDB,
} from "../../app/handler/queries";
// room that exist id = -9999 / that don't exist id:-9998

describe("add and delete room that exist", function () {
    test("add and delete room", async () => {
        const addroom = await _addRoomDB(-9999);
        expect(addroom.rowCount).toBe(1);
        const deleteRoom = await _deleteRoomDB(addroom.rows[0].id);
        expect(deleteRoom.rowCount).toBe(1);
    });
});
describe("delete room that don't exist", function () {
    test("delete room", async () => {
        const deleteRoom = await _deleteRoomDB(-9998);
        expect(deleteRoom.rowCount).toBe(0);
    });
});
