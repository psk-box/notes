import express from "express";
import UserController from "../controllers/User.controller.js";

const router = express.Router();

router.get("/", UserController.getUsers);
router.post("/", UserController.createUser);
router.get("/:user_id", UserController.getUserById);
router.put("/:user_id", UserController.updateUser);
router.delete("/:user_id", UserController.deleteUser);


export default router;