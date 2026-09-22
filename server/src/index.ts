import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Temporary in-memory storage
const items: any[] = []

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Ghar Hishob API is running',
  })
})

// Get all items
app.get('/api/items', (_req, res) => {
  res.json({
    success: true,
    data: items,
  })
})

// Add new item
app.post('/api/items', (req, res) => {
  const newItem = {
    id: Date.now(),
    ...req.body,
  }

  items.push(newItem)

  res.status(201).json({
    success: true,
    message: 'Item added successfully',
    data: newItem,
  })
})

// Expenses
app.get('/api/expenses', (_req, res) => {
  res.json({
    success: true,
    data: [],
  })
})

// Bills
app.get('/api/bills', (_req, res) => {
  res.json({
    success: true,
    data: [],
  })
})

app.listen(PORT, () => {
  console.log(
    `🚀 Ghar Hishob API running on http://localhost:${PORT}`
  )
})