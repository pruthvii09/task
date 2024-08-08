import express from "express";
import {
  createBill,
  getAllBills,
  getSingleBill,
} from "../controllers/bills.controller.js";

const router = express.Router();

router.post("/", createBill);

router.get("/", getAllBills);
router.get("/:id", getSingleBill);

export default router;
