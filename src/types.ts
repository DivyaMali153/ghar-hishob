export type Item = {
  id: number
  name: string
  category: string
  quantity: number
  price: number
  purchaseDate: string
  usedDate: string
  person: string
  notes: string
}

export type Expense = {
  id: number
  name: string
  category: string
  amount: number
  date: string
  person: string
  paymentMethod: string
  notes: string
}

export type Bill = {
  id: number
  name: string
  category: string
  amount: number
  billDate: string
  dueDate: string
  paymentDate: string
  paymentMethod: string
  person: string
  notes: string
}