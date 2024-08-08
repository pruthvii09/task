import prisma from "../prisma/prisma.js";
import { redis } from "../redis/init.js";
export const addNewItem = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and Price are required!!" });
    }
    const item = await prisma.item.create({
      data: {
        name: name,
        description: description,
        price: price,
        quantity: quantity,
      },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const cachedItems = await redis.get("all:items");
    if (cachedItems) {
      // If data is found in cache, return it
      console.log("Fetched from cache => ");
      return res.status(200).json(JSON.parse(cachedItems));
    }
    const items = await prisma.item.findMany();
    if (!items) {
      return res.status(404).json({ error: "No Items Found" });
    }
    await redis.set("all:items", JSON.stringify(items));
    const expirationTime = Math.floor(Date.now() / 1000) + 120;
    await redis.expireat("all:items", expirationTime);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    // Validate the input
    if (!id) {
      return res.status(400).json({ error: "Item ID is required!" });
    }
    if (!name || !price || !quantity) {
      return res
        .status(400)
        .json({ error: "Name, Price, and Quantity are required!" });
    }

    // Update the item
    const item = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        price,
        quantity,
      },
    });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
