import {
    deleteRoomDB,
    leaveRoomDB,
    kickAllDB,
    postInfoPlayerDB,
    getAllPlayerInRoomDB,
    joinRoomDB,
} from "./queries.js";
import { countNull } from "./handler.js";

class SocketManager {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
    }

    async onDisconnected() {
        this.messageAll("player quit");
        let results = await leaveRoomDB(this.socket.id);
        let isHost = results.rows[0].is_host;
        let idRoomToDelete = results.rows[0].id_room;
        console.log("- user disconnected: " + this.socket.id);
        if (isHost) {
            kickAllDB(idRoomToDelete);
            console.log("- deleting all the players");
            this.messageAll("delete room");
            deleteRoomDB(idRoomToDelete);
        }
    }

    onStartGame(data) {
        console.log("|", this.socket.id, ":", data);
        this.messageAll("start game", (user) => {
            return data;
        });
    }

    initJoin(id_room) {
        joinRoomDB(this.socket.id, id_room);
        this.messageAll("player join");
    }

    async endingGame(userScore) {
        const { nbLifeLeft, nbGamesPlayed } = userScore;
        const listIdPlayer = await getAllPlayerInRoomDB(this.socket.id);
        const position = countNull(listIdPlayer);
        postInfoPlayerDB(nbLifeLeft, nbGamesPlayed);

        if (position > 2) return;

        if (position == 2 && nbLifeLeft == 0) {
            this.messageAll("send last data");
            return;
        }

        //position == 1

        this.messageAll("end game", (user) => {
            return {
                user_score: {
                    nbGamesPlayed: user.nmb_minigame ?? nbGamesPlayed,
                    nbLifeLeft: user.pv_left ?? nbLifeLeft,
                },
                user_position: user.position ?? position,
                highscore: userScore,
            };
        });
    }

    async messageAll(
        action,
        message = (elt) => {
            return "";
        }
    ) {
        const listPlayer = await getAllPlayerInRoomDB(this.socket.id);
        console.log("|-- Emit all --|");
        for (let i = 0; i < listPlayer.rows.length; i++) {
            console.log(
                "   | Send message to (" +
                    this.socket.id +
                    ") -> " +
                    message(listPlayer.rows[i])
            );
            this.io
                .to(this.socket.id)
                .emit(action, message(listPlayer.rows[i]));
        }
    }
}

export default SocketManager;
