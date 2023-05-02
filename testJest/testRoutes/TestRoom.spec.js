import { addRoom, deleteRoom } from "../../app/routes/controllers";

// room that exist name:"roomTest" / that don't exist id:-9999

describe("add and delete room that exist", function () {
    test("add and delete room", async () => {
        const addroom = await addRoom({ body: { name: "roomTest" } });
        expect(addroom.room.rowCount).toBe(1);
        expect(
            await deleteRoom({ params: { id: addroom.room.rows[0].id } })
        ).toBe(1);
    });
});
describe("delete room that don't exist", function () {
    test("delete room", async () => {
        expect(await deleteRoom({ params: { id: -9999 } })).toBe(0);
    });
});
