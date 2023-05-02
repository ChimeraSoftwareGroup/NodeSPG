import {
    leaveRoomDB,
    kickAllDB,
    postInfoPlayerDB,
    getAllOtherPlayerInRoomDB,
} from "./queries.js";

class SocketManager {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
    }

    async onDisconnected() {
        this.socket.broadcast.emit("player quit");
        let results = await leaveRoomDB(this.socket.id);
        let isHost = results.rows[0].is_host;
        let idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + this.socket.id);
        if (isHost) {
            kickAllDB(idRoomToDelete);
            console.log("- deleting all the players");
            this.socket.broadcast.emit("delete room");
            deleteRoomDB(idRoomToDelete);
        }
    }

    onStartGame(data) {
        console.log("|", this.socket.id, ":", data);
        this.socket.broadcast.emit("start game", data);
    }

    initJoin(id_room) {
        joinRoomDB(this.socket.id, id_room);
        this.socket.broadcast.emit("player join");
    }

    async endingGame(userScore) {
        const { nbLifeLeft, nbGamesPlayed } = userScore;
        let listIdPlayer = await getAllOtherPlayerInRoomDB(id_player);
        let position = handler.countNull(listIdPlayer);
        postInfoPlayerDB(nbLifeLeft, nbGamesPlayed);

        if (position > 2) return;

        if (position == 2 && nbLifeLeft == 0) {
            this.socket.broadcast.emit("send last data");
            return;
        }

        //position == 1
        listIdPlayer = await getAllOtherPlayerInRoomDB(id_player);
        for (let index = 0; index < listIdPlayer.length; index++) {
            const element = listIdPlayer[index];
            this.io.to(this.socket.id).emit("end game", {
                user_score: {
                    nbGamesPlayed: element.nmb_minigame ?? nbGamesPlayed,
                    nbLifeLeft: element.pv_left ?? nbLifeLeft,
                },
                user_position: element.position ?? position,
                highscore: userScore,
            });
        }
    }
    message(action, message, id_player) {
        const listPlayer = getAllOtherPlayerInRoomDB(id_player);
        for (let index = 0; index < listPlayer.length; index++) {
            this.io.to(this.socket.id).emit(action, message);
        }
    }
}

export default SocketManager;
