import express from "express";
import cors from "cors";
import "./redis/init.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Routes import
import itemsRoutes from "./routes/items.routes.js";
import billsRoutes from "./routes/bills.routes.js";
// Routes declaration
app.use("/items", itemsRoutes);
app.use("/bills", billsRoutes);
export { app };
