import { useEffect, useState } from 'react'

type Bill = {
  id: number
  name: string
  category?: string
  amount: number
  dueDate: string
  paidDate?: string | null
  status?: string
  person?: string
  notes?: string | null
}

function Bills() {
  const [showForm, setShowForm] = useState(false)
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [billDate, setBillDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [dueDate, setDueDate] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [person, setPerson] = useState('')
  const [notes, setNotes] = useState('')

  const loadBills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bills')
      const result = await response.json()

      if (result.success) {
        setBills(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load bills:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBills()
  }, [])

  const resetForm = () => {
    setName('')
    setCategory('')
    setAmount('')
    setBillDate(new Date().toISOString().slice(0, 10))
    setDueDate('')
    setPaymentDate('')
    setPaymentMethod('')
    setPerson('')
    setNotes('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name || !amount || !dueDate || !person) {
      alert('कृपया आवश्यक माहिती भरा.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('http://localhost:5000/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          category: category || null,
          amount: Number(amount),
          dueDate,
          paidDate: paymentDate || null,
          status: paymentDate ? 'PAID' : 'PENDING',
          person,
          notes: notes || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Bill save failed')
      }

      resetForm()
      setShowForm(false)
      await loadBills()
    } catch (error) {
      console.error('Failed to save bill:', error)
      alert('बिल Save करता आला नाही.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bills-page">

      <div className="items-header">
        <div>
          <h2>🧾 घरातील बिले</h2>
          <p>वीज, मोबाईल, इंटरनेट आणि इतर बिलांचा हिशोब</p>
        </div>

        <button
          className="add-item-btn"
          onClick={() => setShowForm(true)}
        >
          + बिल जोडा
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">

          <div className="item-form">

            <div className="form-header">
              <h2>🧾 नवीन बिल जोडा</h2>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>बिलाचे नाव</label>

                <input
                  type="text"
                  placeholder="उदा. MSEB Electricity"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bill Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Category निवडा</option>
                  <option value="Electricity">वीज</option>
                  <option value="Mobile">मोबाईल</option>
                  <option value="Internet">इंटरनेट</option>
                  <option value="Other">DTH</option>
                  <option value="Kitchen">गॅस</option>
                  <option value="Other">पाणी</option>
                  <option value="Other">इतर</option>
                </select>
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>बिलाची रक्कम ₹</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bill Date</label>

                  <input
                    type="date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Date</label>

                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>

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
                  <option value="Auto Debit">Auto Debit</option>
                </select>
              </div>

              <div className="form-group">
                <label>कोणाने भरले?</label>

                <select
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  required
                >
                  <option value="">नाव निवडा</option>
                  <option value="Ganesh">Ganesh</option>
                  <option value="Divya">Divya</option>
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
                  {saving ? 'Saving...' : '💾 बिल Save करा'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <div className="recent-activity-list">
        {loading ? (
          <p>बिलांची माहिती loading...</p>
        ) : bills.length === 0 ? (
          <p>अजून कोणतेही बिल नोंदवलेले नाही.</p>
        ) : (
          bills.map((bill) => (
            <div
              className="recent-activity-item"
              key={bill.id}
            >
              <div className="recent-activity-info">
                <strong>{bill.name}</strong>
                <small>
                  Due: {bill.dueDate?.slice(0, 10)}
                  {bill.person ? ` • ${bill.person}` : ''}
                  {bill.status ? ` • ${bill.status}` : ''}
                </small>
              </div>

              <strong className="recent-activity-amount">
                ₹ {bill.amount.toLocaleString('en-IN')}
              </strong>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Bills
