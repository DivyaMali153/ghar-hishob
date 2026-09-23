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

const toInstant = (date: string) =>
  Temporal.Instant.from(`${date}T00:00:00Z`);

const getMemberId = async (name?: string | null) => {
  if (!name) return null;

  const member = await db.orm.public.Member
    .where({ name })
    .first();

  return member ? Number(member.id) : null;
};

const getCategoryId = async (
  name?: string | null,
  type = "EXPENSE"
) => {
  if (!name) return null;

  const category = await db.orm.public.Category
    .where({ name, type })
    .first();

  return category ? Number(category.id) : null;
};

/* =========================
   HEALTH
========================= */

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Ghar Hishob API is running",
  });
});

/* =========================
   MEMBERS
========================= */

app.get("/api/members", async (_req, res) => {
  try {
    const members = await db.orm.public.Member.all();

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("GET /api/members error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
});

/* =========================
   CATEGORIES
========================= */

app.get("/api/categories", async (_req, res) => {
  try {
    const categories = await db.orm.public.Category.all();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});

/* =========================
   ITEMS
========================= */

app.get("/api/items", async (_req, res) => {
  try {
    const transactions = await db.orm.public.ItemTransaction.all();

    const items = await Promise.all(
      transactions.map(async (transaction) => {
        const item = await db.orm.public.ItemMaster
          .where({ id: transaction.itemId })
          .first();

        const category = item?.categoryId
          ? await db.orm.public.Category
              .where({ id: item.categoryId })
              .first()
          : null;

        const member = transaction.memberId
          ? await db.orm.public.Member
              .where({ id: transaction.memberId })
              .first()
          : null;

        return {
          id: transaction.id,
          name: item?.name ?? "",
          category: category?.name ?? null,
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

    let itemMaster = await db.orm.public.ItemMaster
      .where({ name })
      .first();

    if (!itemMaster) {
      const categoryId = await getCategoryId(category, "EXPENSE");

      itemMaster = await db.orm.public.ItemMaster.create({
        name,
        categoryId,
      });
    }

    const memberId = await getMemberId(person);

    const transaction = await db.orm.public.ItemTransaction.create({
      itemId: itemMaster.id,
      quantity: Number(quantity ?? 1),
      price: Number(price ?? 0),
      purchaseDate: toInstant(purchaseDate),
      usedDate: usedDate ? toInstant(usedDate) : null,
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

/* =========================
   EXPENSES
========================= */

app.get("/api/expenses", async (_req, res) => {
  try {
    const expenses = await db.orm.public.Expense.all();

    const data = await Promise.all(
      expenses.map(async (expense) => {
        const category = expense.categoryId
          ? await db.orm.public.Category
              .where({ id: expense.categoryId })
              .first()
          : null;

        const member = expense.memberId
          ? await db.orm.public.Member
              .where({ id: expense.memberId })
              .first()
          : null;

        return {
          id: expense.id,
          category: category?.name ?? null,
          amount: expense.amount,
          expenseDate: expense.expenseDate,
          person: member?.name ?? null,
          description: expense.description,
          notes: expense.notes,
        };
      })
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/expenses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const {
      category,
      amount,
      expenseDate,
      person,
      description,
      notes,
    } = req.body;

    if (!amount || !expenseDate || !description) {
      return res.status(400).json({
        success: false,
        message: "Amount, date and description are required",
      });
    }

    const categoryId = await getCategoryId(category, "EXPENSE");
    const memberId = await getMemberId(person);

    const expense = await db.orm.public.Expense.create({
      categoryId,
      amount: Number(amount),
      expenseDate: toInstant(expenseDate),
      memberId,
      description,
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    console.error("POST /api/expenses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add expense",
    });
  }
});

/* =========================
   BILLS
========================= */

app.get("/api/bills", async (_req, res) => {
  try {
    const bills = await db.orm.public.Bill.all();

    const data = await Promise.all(
      bills.map(async (bill) => {
        const category = bill.categoryId
          ? await db.orm.public.Category
              .where({ id: bill.categoryId })
              .first()
          : null;

        const member = bill.memberId
          ? await db.orm.public.Member
              .where({ id: bill.memberId })
              .first()
          : null;

        return {
          id: bill.id,
          name: bill.name,
          category: category?.name ?? null,
          amount: bill.amount,
          dueDate: bill.dueDate,
          paidDate: bill.paidDate,
          status: bill.status,
          person: member?.name ?? null,
          notes: bill.notes,
        };
      })
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/bills error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
    });
  }
});

app.post("/api/bills", async (req, res) => {
  try {
    const {
      name,
      category,
      amount,
      dueDate,
      paidDate,
      status,
      person,
      notes,
    } = req.body;

    if (!name || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Bill name, amount and due date are required",
      });
    }

    const categoryId = await getCategoryId(category, "BILL");
    const memberId = await getMemberId(person);

    const bill = await db.orm.public.Bill.create({
      name,
      categoryId,
      amount: Number(amount),
      dueDate: toInstant(dueDate),
      paidDate: paidDate ? toInstant(paidDate) : null,
      status: status || "PENDING",
      memberId,
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Bill added successfully",
      data: bill,
    });
  } catch (error) {
    console.error("POST /api/bills error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add bill",
    });
  }
});

/* =========================
   INCOME
========================= */

app.get("/api/income", async (_req, res) => {
  try {
    const incomes = await db.orm.public.Income.all();

    const data = await Promise.all(
      incomes.map(async (income) => {
        const member = income.memberId
          ? await db.orm.public.Member
              .where({ id: income.memberId })
              .first()
          : null;

        return {
          id: income.id,
          source: income.source,
          amount: income.amount,
          incomeDate: income.incomeDate,
          person: member?.name ?? null,
          notes: income.notes,
        };
      })
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/income error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch income",
    });
  }
});

app.post("/api/income", async (req, res) => {
  try {
    const {
      source,
      amount,
      incomeDate,
      person,
      notes,
    } = req.body;

    if (!source || !amount || !incomeDate) {
      return res.status(400).json({
        success: false,
        message: "Source, amount and date are required",
      });
    }

    const memberId = await getMemberId(person);

    const income = await db.orm.public.Income.create({
      source,
      amount: Number(amount),
      incomeDate: toInstant(incomeDate),
      memberId,
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      data: income,
    });
  } catch (error) {
    console.error("POST /api/income error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add income",
    });
  }
});

/* =========================
   LOANS
========================= */

app.get("/api/loans", async (_req, res) => {
  try {
    const loans = await db.orm.public.Loan.all();

    const data = await Promise.all(
      loans.map(async (loan) => {
        const member = loan.memberId
          ? await db.orm.public.Member
              .where({ id: loan.memberId })
              .first()
          : null;

        return {
          id: loan.id,
          name: loan.name,
          principalAmount: loan.principalAmount,
          interestRate: loan.interestRate,
          tenureMonths: loan.tenureMonths,
          emiAmount: loan.emiAmount,
          startDate: loan.startDate,
          endDate: loan.endDate,
          person: member?.name ?? null,
          status: loan.status,
          notes: loan.notes,
        };
      })
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/loans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch loans",
    });
  }
});

app.post("/api/loans", async (req, res) => {
  try {
    const {
      name,
      principalAmount,
      interestRate,
      tenureMonths,
      emiAmount,
      startDate,
      endDate,
      person,
      status,
      notes,
    } = req.body;

    if (
      !name ||
      !principalAmount ||
      !tenureMonths ||
      !emiAmount ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Required loan fields are missing",
      });
    }

    const memberId = await getMemberId(person);

    const loan = await db.orm.public.Loan.create({
      name,
      principalAmount: Number(principalAmount),
      interestRate: Number(interestRate ?? 0),
      tenureMonths: Number(tenureMonths),
      emiAmount: Number(emiAmount),
      startDate: toInstant(startDate),
      endDate: endDate ? toInstant(endDate) : null,
      memberId,
      status: status || "ACTIVE",
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Loan added successfully",
      data: loan,
    });
  } catch (error) {
    console.error("POST /api/loans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add loan",
    });
  }
});

/* =========================
   LOAN PAYMENTS
========================= */

app.get("/api/loan-payments", async (_req, res) => {
  try {
    const payments = await db.orm.public.LoanPayment.all();

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("GET /api/loan-payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch loan payments",
    });
  }
});

app.post("/api/loan-payments", async (req, res) => {
  try {
    const {
      loanId,
      amount,
      paymentDate,
      principalAmount,
      interestAmount,
      notes,
    } = req.body;

    if (!loanId || !amount || !paymentDate) {
      return res.status(400).json({
        success: false,
        message: "Loan, amount and payment date are required",
      });
    }

    const payment = await db.orm.public.LoanPayment.create({
      loanId: Number(loanId),
      amount: Number(amount),
      paymentDate: toInstant(paymentDate),
      principalAmount: Number(principalAmount ?? 0),
      interestAmount: Number(interestAmount ?? 0),
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Loan payment added successfully",
      data: payment,
    });
  } catch (error) {
    console.error("POST /api/loan-payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add loan payment",
    });
  }
});

/* =========================
   DASHBOARD
========================= */

app.get("/api/dashboard", async (_req, res) => {
  try {
    const [
      transactions,
      expenses,
      bills,
      incomes,
      loans,
      loanPayments,
      itemMasters,
      members,
    ] = await Promise.all([
      db.orm.public.ItemTransaction.all(),
      db.orm.public.Expense.all(),
      db.orm.public.Bill.all(),
      db.orm.public.Income.all(),
      db.orm.public.Loan.all(),
      db.orm.public.LoanPayment.all(),
      db.orm.public.ItemMaster.all(),
      db.orm.public.Member.all(),
    ]);

    const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    const isCurrentMonth = (date: unknown) =>
      String(date).startsWith(currentMonth);

    const monthlyItemSpend = transactions
      .filter((item) => isCurrentMonth(item.purchaseDate))
      .reduce((sum, item) => sum + Number(item.price), 0);

    const monthlyExpenses = expenses
      .filter((expense) => isCurrentMonth(expense.expenseDate))
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    const monthlyBills = bills
      .filter((bill) => isCurrentMonth(bill.dueDate))
      .reduce((sum, bill) => sum + Number(bill.amount), 0);

    const monthlyIncome = incomes
      .filter((income) => isCurrentMonth(income.incomeDate))
      .reduce((sum, income) => sum + Number(income.amount), 0);

    const monthlyLoanPayments = loanPayments
      .filter((payment) => isCurrentMonth(payment.paymentDate))
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    const activeLoans = loans.filter(
      (loan) => loan.status === "ACTIVE"
    );

    const totalMonthlyOutflow =
      monthlyItemSpend +
      monthlyExpenses +
      monthlyBills +
      monthlyLoanPayments;

    const recentActivity = [
      ...transactions.map((item) => {
        const itemMaster = itemMasters.find(
          (master) => Number(master.id) === Number(item.itemId)
        );

        const member = members.find(
          (person) => Number(person.id) === Number(item.memberId)
        );

        return {
          type: "ITEM",
          date: item.purchaseDate,
          amount: Number(item.price),
          id: item.id,
          itemName: itemMaster?.name ?? "वस्तू",
          memberName: member?.name ?? "",
        };
      }),

      ...expenses.map((expense) => ({
        type: "EXPENSE",
        date: expense.expenseDate,
        amount: Number(expense.amount),
        id: expense.id,
        itemName: expense.description,
        memberName:
          members.find(
            (person) => Number(person.id) === Number(expense.memberId)
          )?.name ?? "",
      })),

      ...bills.map((bill) => ({
        type: "BILL",
        date: bill.dueDate,
        amount: Number(bill.amount),
        id: bill.id,
        itemName: bill.name,
        memberName:
          members.find(
            (person) => Number(person.id) === Number(bill.memberId)
          )?.name ?? "",
      })),

      ...incomes.map((income) => ({
        type: "INCOME",
        date: income.incomeDate,
        amount: Number(income.amount),
        id: income.id,
        itemName: income.source,
        memberName:
          members.find(
            (person) => Number(person.id) === Number(income.memberId)
          )?.name ?? "",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(String(b.date)).getTime() -
          new Date(String(a.date)).getTime()
      )
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        monthlyItemSpend,
        monthlyExpenses,
        monthlyBills,
        monthlyIncome,
        monthlyLoanPayments,
        totalMonthlyOutflow,
        activeLoans: activeLoans.length,
        totalLoans: loans.length,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    `🚀 Ghar Hishob API running on http://localhost:${PORT}`
  );
});
