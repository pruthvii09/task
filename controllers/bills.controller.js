import prisma from "../prisma/prisma.js";
import { redis } from "../redis/init.js";

export const createBill = async (req, res) => {
  try {
    const { phoneNumber, items } = req.body;

    const itemDetails = await prisma.item.findMany({
      where: {
        id: { in: items.map((item) => item.itemId) },
      },
    });

    const itemMap = itemDetails.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});

    const invalidItems = items.filter(
      (item) =>
        !itemMap[item.itemId] || itemMap[item.itemId].quantity < item.quantity
    );

    if (invalidItems.length > 0) {
      return res.status(400).json({
        message: "Invalid items or insufficient quantity",
        invalidItems,
      });
    }

    const bill = await prisma.bill.create({
      data: {
        phoneNumber: phoneNumber,
        billItem: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: itemMap[item.itemId].price,
            itemId: item.itemId,
          })),
        },
      },
      include: {
        billItem: true,
      },
    });

    const updateOperations = items.map((item) => ({
      where: { id: item.itemId },
      data: { quantity: { decrement: item.quantity } },
    }));

    await prisma.$transaction(
      updateOperations.map((operation) => prisma.item.update(operation))
    );

    res.status(201).json({ ...bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const cachedBills = await redis.get("all:bills");
    if (cachedBills) {
      // If data is found in cache, return it
      console.log("cache => ");
      return res.status(200).json(JSON.parse(cachedBills));
    }
    const bills = await prisma.bill.findMany({
      include: {
        billItem: true,
      },
    });
    if (!bills || bills.length === 0) {
      return res.status(404).json({ error: "No bills found" });
    }
    await redis.set("all:bills", JSON.stringify(bills));
    const expirationTime = Math.floor(Date.now() / 1000) + 120;
    await redis.expireat("all:bills", expirationTime);
    res.status(200).json(bills);
  } catch (error) {
    res.status(200).json({ error: error });
  }
};

export const getSingleBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await prisma.bill.findUnique({
      where: {
        id: id,
      },
      include: {
        billItem: true,
      },
    });
    if (!bill) {
      return res.status(404).json({ error: "No bills found" });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(200).json({ error: error });
  }
};
