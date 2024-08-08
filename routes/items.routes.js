import express from "express";
import {
  addNewItem,
  getAllItems,
  updateItem,
} from "../controllers/items.controller.js";

const router = express.Router();

router.post("/", addNewItem);

router.put("/:id", updateItem);

router.get("/", getAllItems);

export default router;
