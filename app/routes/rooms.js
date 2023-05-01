import express from "express";

import { getAllPlayerInRoom, addRoom, joinRoom, updateRoom, deleteRoom, leaveRoom, kickAll, getInfoPlayer, postInfoPlayer } from "../controller/controllers";

const router = express.Router();

router.post("/", (req, res) => {
    handler.returnApi(req, res, addRoom);
});
router.post("/join", (req, res) => {
    handler.returnApi(req, res, joinRoom);
});

//Debug for Unity -- Need improvement
router.post("/password", (req, res) => {
    handler.returnApi(req, res, () => {
        return true;
    });
});
router.put("/:id", (req, res) => {
    handler.returnApi(req, res, updateRoom);
});
router.delete("/:id", (req, res) => {
    handler.returnApi(req, res, deleteRoom);
});
router.get("/:id/players", (req, res) => {
    handler.returnApi(req, res, getAllPlayerInRoom);
});
router.delete("/:id/players", (req, res) => {
    handler.returnApi(req, res, kickAll);
});
router.get("/players/:id/", (req, res) => {
    handler.returnApi(req, res, getInfoPlayer);
});
router.post("/players/:id/", (req, res) => {
    handler.returnApi(req, res, postInfoPlayer);
});
router.delete("/players/:idPlayer/leave", (req, res) => {
    handler.returnApi(req, res, leaveRoom);
});

export default router;
