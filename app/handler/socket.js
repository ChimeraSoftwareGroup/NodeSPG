import {
    leaveRoom,
    kickAll,
    postInfoPlayer,
    getAllOtherPlayerInRoom,
} from "./controller/controllers.js";

export async function onDisconnected(socket) {
    socket.broadcast.emit("player quit");
    let results = await leaveRoom({
        params: { idPlayer: socket.id },
    });
    let isHost = results.rows[0].is_host;
    ù * $;
    let idRoomToDelete = results.rows[0].id_room;
    console.log("- user disconnected: " + socket.id);
    if (isHost) {
        kickAll({ params: { idRoom: idRoomToDelete } });
        console.log("- deleting all the players");
        socket.broadcast.emit("delete room");
        deleteRoomDB(idRoomToDelete);
    }
}

export function startGame(socket, data) {
    console.log("|", socket.id, ":", data);
    socket.broadcast.emit("start game", data);
}

export function initJoin(socket, id_room) {
    joinRoomDB(socket.id, id_room);
    socket.broadcast.emit("player join");
}

export function endingGame(socket, userScore) {
    const { nbLifeLeft, nbGamesPlayed } = userScore;
    let listIdPlayer = getAllOtherPlayerInRoom({
        params: { id_player },
    });
    let position = handler.countNull(listIdPlayer);
    postInfoPlayer({
        params: { nbLifeLeft, nbGamesPlayed, position },
    });

    if (position > 2) return;

    if (position == 2 && nbLifeLeft == 0) {
        socket.broadcast.emit("send last data");
        return;
    }

    //position == 1
    listIdPlayer = getAllOtherPlayerInRoom({
        params: { id_player },
    });
    for (let index = 0; index < listIdPlayer.length; index++) {
        const element = listIdPlayer[index];
        io.to(socketId).emit("end game", {
            user_score: {
                nbGamesPlayed: element.nmb_minigame ?? nbGamesPlayed,
                nbLifeLeft: element.pv_left ?? nbLifeLeft,
            },
            user_position: element.position ?? position,
            highscore: userScore,
        });
    }
}
