import {
    joinRoomDB as _joinRoomDB,
    leaveRoomDB as _leaveRoomDB,
} from "../../app/handler/queries";

// id_player that exist -999 / that don't exist -998
// idRoom that exist -999 / that don't exist -998

describe("Make a player leave a room that exist", function () {
    test("Make a player leave a room that exist", async () => {
        const leaveRoom = await _leaveRoomDB(-999);
        expect(leaveRoom.rowCount).toBe(1);
        const joinRoom = await _joinRoomDB(-999, -999);
        expect(joinRoom.rowCount).toBe(1);
    });
});

describe("Make an inexistante player leave a room that exist", function () {
    test("Make an inexistante player leave a room that exist", async () => {
        try {
            const leaveRoom = await _leaveRoomDB(-998);
            expect(leaveRoom.rowCount).toBe(0);
        } catch (error) {}
    });
});
