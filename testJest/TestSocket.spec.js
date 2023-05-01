const io = require('socket.io-client');
const unitTest = require("../app/handler.js");

test('test socket "start game" event', (done) => {
  const client1 = io.connect('http://localhost:3000');

  client1.on('connect', () => {
    const client2 = io.connect('http://localhost:3000');

    client2.on('connect', () => {
      // Simulate data
      const data = unitTest.countGames(5,10,20);

      // Emit "start game" event from client 1
      client1.emit('start game', data);

      // Test that client 2 receives the event
      client2.on('start game', (receivedData) => {
        expect(receivedData).toEqual(expect.arrayContaining(data));
        done();
      });
    });
  });
});