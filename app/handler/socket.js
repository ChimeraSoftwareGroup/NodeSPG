import {
    deleteRoomDB,
    leaveRoomDB,
    kickAllDB,
    setHasLostPlayer,
    getAllPlayerInRoomDB,
    joinRoomDB,
    getPlayerRoomBySocketID,
} from "./queries.js";
import { countNull } from "./handler.js";

class SocketManager {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
    }

    async onDisconnected() {
        this.messageAll("player quit");
        let player = await getPlayerRoomBySocketID(this.socket.id);
        let isHost = player.rows[0].is_host;
        let idRoomToDelete = player.rows[0].id_room;
        console.log("- user disconnected: " + this.socket.id);
        if (isHost) {
            console.log("- deleting all the players");
            await this.messageAll("delete room");
            await kickAllDB(idRoomToDelete);
            deleteRoomDB(idRoomToDelete);
        } else {
            await leaveRoomDB(this.socket.id);
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
        const position = countNull(listIdPlayer.rows);
        setHasLostPlayer(this.socket.id);

        if (position == 2 && nbLifeLeft == 0) {
            this.messageAll("send last data");
        }

        //position == 1
        this.io
            .to(this.socket.id)
            .emit("end game", { user_position: position });
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
                    listPlayer.rows[i].id_player +
                    ") -> " +
                    action +
                    ": " +
                    message(listPlayer.rows[i])
            );
            this.io
                .to(listPlayer.rows[i].id_player)
                .emit(action, message(listPlayer.rows[i]));
        }
        console.log("-----------------------------------------");
    }
}

export default SocketManager;
