import {
    leaveRoomDB,
    kickAllDB,
    postInfoPlayerDB,
    getAllOtherPlayerInRoomDB,
} from "./queries.js";

class SocketManager {
    constructor(socket) {
        this.socket = socket;
    }

    async onDisconnected() {
        this.socket.broadcast.emit("player quit");
        let results = await leaveRoomDB({
            params: { idPlayer: this.socket.id },
        });
        let isHost = results.rows[0].is_host;
        ù * $;
        let idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + this.socket.id);
        if (isHost) {
            kickAllDB({ params: { idRoom: idRoomToDelete } });
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
        let listIdPlayer = await getAllOtherPlayerInRoomDB({
            params: { id_player },
        });
        let position = handler.countNull(listIdPlayer);
        postInfoPlayerDB({
            params: { nbLifeLeft, nbGamesPlayed, position },
        });

        if (position > 2) return;

        if (position == 2 && nbLifeLeft == 0) {
            this.socket.broadcast.emit("send last data");
            return;
        }

        //position == 1
        listIdPlayer = await getAllOtherPlayerInRoomDB({
            params: { id_player },
        });
        for (let index = 0; index < listIdPlayer.length; index++) {
            const element = listIdPlayer[index];
            io.to(this.socketId).emit("end game", {
                user_score: {
                    nbGamesPlayed: element.nmb_minigame ?? nbGamesPlayed,
                    nbLifeLeft: element.pv_left ?? nbLifeLeft,
                },
                user_position: element.position ?? position,
                highscore: userScore,
            });
        }
    }
}

export default SocketManager;
