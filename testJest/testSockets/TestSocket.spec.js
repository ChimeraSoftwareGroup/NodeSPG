import { connect as _connect } from "socket.io-client";
import { countGames as _countGames } from "../../app/handler/handler";

test('test socket "start game" event', (done) => {
    const client1 = _connect("http://localhost:3000");

    client1.on("connect", () => {
        const client2 = _connect("http://localhost:3000");

        client2.on("connect", () => {
            // Simulate data
            const data = _countGames(5, 10, 20);
            // Emit "start game" event from client 1
            client1.emit("start game", data);
            // Test that client 2 receives the event
            client2.on("start game", (receivedData) => {
                expect(receivedData).toEqual(expect.arrayContaining(data));
            });
        });
    });
    done();
});
