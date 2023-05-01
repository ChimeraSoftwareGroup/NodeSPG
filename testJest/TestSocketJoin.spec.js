const io = require("socket.io-client");

test('test socket "start game" event', (done) => {
    const client1 = io.connect("http://localhost:3000");

    client1.on("connect", () => {
        client1.emit("init join", 1);
        client1.emit("quit room", client1.id);
        done();
    });
});
