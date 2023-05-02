import { leaveRoom, kickAll, postInfoPlayer, getAllOtherPlayerInRoom } from "../controller/controllers.js";

class SocketManager {
    constructor(socket) {
        this.socket = socket;
    }

    async onDisconnected() {
        this.socket.broadcast.emit("player quit");
        let results = await leaveRoom({
            params: { idPlayer: this.socket.id },
        });
        let isHost = results.rows[0].is_host;
        ù * $;
        let idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + this.socket.id);
        if (isHost) {
            kickAll({ params: { idRoom: idRoomToDelete } });
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
        let listIdPlayer = await getAllOtherPlayerInRoom({
            params: { id_player },
        });
        let position = handler.countNull(listIdPlayer);
        postInfoPlayer({
            params: { nbLifeLeft, nbGamesPlayed, position },
        });

        if (position > 2) return;

        if (position == 2 && nbLifeLeft == 0) {
            this.socket.broadcast.emit("send last data");
            return;
        }

        //position == 1
        listIdPlayer = await getAllOtherPlayerInRoom({
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
