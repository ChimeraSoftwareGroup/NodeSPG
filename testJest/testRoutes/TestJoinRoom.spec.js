import {
    joinRoomDB as _joinRoomDB,
    leaveRoomDB as _leaveRoomDB,
} from "../../app/handler/queries";

// id_player that exist -99 / that don't exist -98
// idRoom that exist -99 / that don't exist -98
describe("add a player in a room that exist and make him leave", function () {
    test("add a player in a room that exist and make him leave", async () => {
        const joinRoomDB = await _joinRoomDB(-99, -99);
        expect(joinRoomDB.rowCount).toBe(1);
        const leaveRoomDB = await _leaveRoomDB(-99);
        expect(leaveRoomDB.rowCount).toBe(1);
    });
});

describe("add an inexistante player in a room that exist", function () {
    test("add an inexistante player in a room that exist", async () => {
        const joinRoomDB = await _joinRoomDB(-98, -99);
        expect(joinRoomDB).toThrowError;
        const leaveRoomDB = await _leaveRoomDB(-98);
        expect(leaveRoomDB.rowCount).toBe(1);
    });
});

describe("add an existante player in a room that do not exist", function () {
    test("add an existante player in a room that do not exist", async () => {
        try {
            const joinRoomDB = await _joinRoomDB(-99, -98);
            expect(joinRoomDB).toThrowError;
        } catch (error) {}
    });
});
