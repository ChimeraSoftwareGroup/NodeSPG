import { addRoomDB } from "../../app/handler/queries.js";
import { connect } from "socket.io-client";

test('test socket "start game" event', async () => {
    const room = await addRoomDB(-99, "0000");
    const client1 = connect("http://localhost:3000");
    const client2 = connect("http://localhost:3000");

    client1.on("connect", () => {
        client1.emit("init join", room.rows[0].id);
        client2.on("connect", () => {
            client2.emit("init join", room.rows[0].id);
        });
        client1.emit("quit room");
    });
});
