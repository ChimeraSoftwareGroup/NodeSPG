import express from "express";
import { returnApi } from "../handler/handler.js";
import { getAllPlayerInRoom, addRoom, joinRoom, updateRoom, deleteRoom, leaveRoom, kickAll, getInfoPlayer, postInfoPlayer, getRoomByPassword } from "../controller/controllers.js";

export const router = express.Router();

router.post("/", (req, res) => {
    returnApi(req, res, addRoom);
});
router.post("/join", (req, res) => {
    returnApi(req, res, joinRoom);
});

//Debug for Unity -- Need improvement
router.post("/password", (req, res) => {
    returnApi(req, res, getRoomByPassword);
});
router.put("/:id", (req, res) => {
    returnApi(req, res, updateRoom);
});
router.delete("/:id", (req, res) => {
    returnApi(req, res, deleteRoom);
});
router.get("/:id/players", (req, res) => {
    returnApi(req, res, getAllPlayerInRoom);
});
router.delete("/:id/players", (req, res) => {
    returnApi(req, res, kickAll);
});
router.get("/players/:id/", (req, res) => {
    returnApi(req, res, getInfoPlayer);
});
router.post("/players/:id/", (req, res) => {
    returnApi(req, res, postInfoPlayer);
});
router.delete("/players/:idPlayer/leave", (req, res) => {
    returnApi(req, res, leaveRoom);
});

export default router;
