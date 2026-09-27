import { useEffect, useState } from 'react'

type Expense = {
  id: number
  description: string
  amount: number
  expenseDate: string
  memberName?: string
  categoryName?: string
  paymentMethod?: string
  notes?: string
}

function Expenses() {
  const [showForm, setShowForm] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [member, setMember] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [notes, setNotes] = useState('')

  const loadExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses')
      const result = await response.json()

      if (result.success) {
        setExpenses(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  const resetForm = () => {
    setDescription('')
    setCategory('')
    setAmount('')
    setExpenseDate(new Date().toISOString().slice(0, 10))
    setMember('')
    setPaymentMethod('')
    setNotes('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!description || !amount || !expenseDate || !member) {
      alert('कृपया आवश्यक माहिती भरा.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: Number(amount),
          expenseDate,
          person: member,
          category: category || null,
          notes: notes || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Expense save failed')
      }

      resetForm()
      setShowForm(false)
      await loadExpenses()
    } catch (error) {
      console.error('Failed to save expense:', error)
      alert('खर्च Save करता आला नाही.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="expenses-page">

      <div className="items-header">
        <div>
          <h2>💰 घरातील खर्च</h2>
          <p>दररोजच्या खर्चाची नोंद आणि महिन्याचा हिशोब</p>
        </div>

        <button
          className="add-item-btn"
          onClick={() => setShowForm(true)}
        >
          + खर्च जोडा
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">

          <div className="item-form">

            <div className="form-header">
              <h2>💰 नवीन खर्च</h2>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>खर्चाचे नाव</label>

                <input
                  type="text"
                  placeholder="उदा. भाजीपाला"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Category निवडा</option>
                  <option value="Grocery">किराणा</option>
                  <option value="Food">भाजीपाला</option>
                  <option value="Grocery">दूध</option>
                  <option value="Travel">प्रवास</option>
                  <option value="Kitchen">गॅस</option>
                  <option value="Other">घर</option>
                  <option value="Other">इतर</option>
                </select>
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>रक्कम ₹</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>तारीख</label>

                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label>कोणाने खर्च केला?</label>

                <select
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                  required
                >
                  <option value="">नाव निवडा</option>
                  <option value="Ganesh">Ganesh</option>
                  <option value="Divya">Divya</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Method</label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Payment निवडा</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>

                <textarea
                  rows={3}
                  placeholder="काही अतिरिक्त माहिती..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '💾 खर्च Save करा'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <div className="recent-activity-list">
        {loading ? (
          <p>खर्चाची माहिती loading...</p>
        ) : expenses.length === 0 ? (
          <p>अजून कोणताही खर्च नोंदवलेला नाही.</p>
        ) : (
          expenses.map((expense) => (
            <div
              className="recent-activity-item"
              key={expense.id}
            >
              <div className="recent-activity-info">
                <strong>{expense.description}</strong>
                <small>
                  {expense.expenseDate?.slice(0, 10)}
                  {expense.memberName ? ` • ${expense.memberName}` : ''}
                </small>
              </div>

              <strong className="recent-activity-amount">
                ₹ {expense.amount.toLocaleString('en-IN')}
              </strong>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Expenses
