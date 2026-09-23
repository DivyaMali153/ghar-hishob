import { Temporal } from "@js-temporal/polyfill";

(globalThis as typeof globalThis & { Temporal: typeof Temporal }).Temporal =
  Temporal;

import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./prisma/db.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Ghar Hishob API is running",
  });
});

// Get all items
app.get("/api/items", async (_req, res) => {
  try {
    const transactions = await db.orm.public.ItemTransaction.all();

    const items = await Promise.all(
      transactions.map(async (transaction) => {
        const item = await db.orm.public.ItemMaster
          .where({ id: transaction.itemId })
          .first();

        const member = transaction.memberId
          ? await db.orm.public.Member
              .where({ id: transaction.memberId })
              .first()
          : null;

        return {
          id: transaction.id,
          name: item?.name ?? "",
          category: null,
          quantity: transaction.quantity,
          price: transaction.price,
          purchaseDate: transaction.purchaseDate,
          usedDate: transaction.usedDate,
          person: member?.name ?? null,
          notes: transaction.notes,
        };
      })
    );

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("GET /api/items error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
});

// Add new item
app.post("/api/items", async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      price,
      purchaseDate,
      usedDate,
      person,
      notes,
    } = req.body;

    if (!name || !purchaseDate) {
      return res.status(400).json({
        success: false,
        message: "Item name and purchase date are required",
      });
    }

    // Find existing item in master
    let itemMaster = await db.orm.public.ItemMaster
      .where({ name })
      .first();

    // Create item master if it does not exist
    if (!itemMaster) {
      let categoryId: number | null = null;

      if (category) {
        const existingCategory = await db.orm.public.Category
          .where({ name: category })
          .first();

        categoryId = existingCategory
          ? Number(existingCategory.id)
          : null;
      }

      itemMaster = await db.orm.public.ItemMaster.create({
        name,
        categoryId,
      });
    }

    // Find member
    let memberId: number | null = null;

    if (person) {
      const member = await db.orm.public.Member
        .where({ name: person })
        .first();

      memberId = member ? Number(member.id) : null;
    }

    // Create transaction
    const transaction = await db.orm.public.ItemTransaction.create({
      itemId: itemMaster.id,
      quantity: Number(quantity ?? 1),
      price: Number(price ?? 0),
      purchaseDate: Temporal.Instant.from(`${purchaseDate}T00:00:00Z`),
      usedDate: usedDate
        ? Temporal.Instant.from(`${usedDate}T00:00:00Z`)
        : null,
      memberId,
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("POST /api/items error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add item",
    });
  }
});

// Expenses
app.get("/api/expenses", (_req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// Bills
app.get("/api/bills", (_req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Ghar Hishob API running on http://localhost:${PORT}`
  );
});