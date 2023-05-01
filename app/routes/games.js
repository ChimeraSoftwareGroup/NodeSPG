import express from "express";

import { getGames } from "../controller/controllers.js";

export const router = express.Router();

router.get("/", (req, res) => {
    handler.returnApi(req, res, getGames);
});
router.get("/random", (req, res) => {
    res.status(500).send({ id: 2, name: "test" });
});

export default router;
