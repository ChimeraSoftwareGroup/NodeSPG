import express from "express";

import { getAllPlayerInRoom, addRoom, joinRoom, updateRoom, deleteRoom, leaveRoom, kickAll } from "../controller/controllers";

const router = express.Router();

router.get("/:id/players", (req, res) => {
    handler.returnApi(req, res, getAllPlayerInRoom);
});
router.post("/", (req, res) => {
    handler.returnApi(req, res, addRoom);
});
router.post("/join", (req, res) => {
    handler.returnApi(req, res, joinRoom);
});

//Debug for Unity -- Need improvement
router.post("/room/password", (req, res) => {
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
router.delete("/:id/players", (req, res) => {
    handler.returnApi(req, res, kickAll);
});
router.delete("/players/:idPlayer/leave", (req, res) => {
    handler.returnApi(req, res, leaveRoom);
});

router.get("/players/:id/", (req, res) => {
    handler.returnApi(req, res, controllers.getInfoPlayer);
});
router.post("/players/:id/", (req, res) => {
    handler.returnApi(req, res, controllers.postInfoPlayer);
});

export default router;
