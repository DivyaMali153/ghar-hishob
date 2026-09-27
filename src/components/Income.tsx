import { useEffect, useState } from 'react'

type Income = {
  id: number
  source: string
  amount: number
  incomeDate: string
  person?: string | null
  notes?: string | null
}

function Income() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')
  const [incomeDate, setIncomeDate] = useState(
    new Date().toISOString().substring(0, 10)
  )
  const [person, setPerson] = useState('Ganesh')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const loadIncome = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/income')
      const result = await response.json()

      if (result.success) {
        setIncomes(result.data)
      }
    } catch (error) {
      console.error('Income API error:', error)
    }
  }

  useEffect(() => {
    loadIncome()
  }, [])

  const handleSave = async () => {
    if (!source.trim() || !amount || Number(amount) <= 0) {
      alert('उत्पन्नाचे नाव आणि रक्कम भरा.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: source.trim(),
          amount: Number(amount),
          incomeDate,
          person,
          notes: notes.trim() || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save income')
      }

      setSource('')
      setAmount('')
      setNotes('')

      await loadIncome()
    } catch (error) {
      console.error('Save income error:', error)
      alert('उत्पन्न सेव करता आले नाही.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return date ? date.substring(0, 10) : ''
  }

  const formatAmount = (value: number) => {
    return `₹ ${Number(value).toLocaleString('en-IN')}`
  }

  return (
    <div className="page-section">

      <div className="section-header">
        <div>
          <h2>उत्पन्न</h2>
          <p>घरातील उत्पन्नाची नोंद करा</p>
        </div>
      </div>

      <div className="form-card">

        <div className="form-grid">

          <div className="form-group">
            <label>उत्पन्नाचे नाव</label>
            <input
              type="text"
              placeholder="उदा. पगार"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>रक्कम</label>
            <input
              type="number"
              placeholder="₹ 0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>दिनांक</label>
            <input
              type="date"
              value={incomeDate}
              onChange={(e) => setIncomeDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>सदस्य</label>
            <select
              value={person}
              onChange={(e) => setPerson(e.target.value)}
            >
              <option value="Ganesh">Ganesh</option>
              <option value="Divya">Divya</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>नोंद</label>
            <input
              type="text"
              placeholder="ऐच्छिक"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'सेव्ह होत आहे...' : '＋ उत्पन्न नोंदवा'}
          </button>
        </div>

      </div>

      <div className="list-card">

        <div className="list-header">
          <h3>अलीकडील उत्पन्न</h3>
        </div>

        {incomes.length === 0 ? (
          <div className="empty-state">
            अजून उत्पन्नाची नोंद नाही.
          </div>
        ) : (
          <div className="list-items">
            {incomes.map((income) => (
              <div className="list-item" key={income.id}>
                <div>
                  <strong>{income.source}</strong>
                  <small>
                    {formatDate(income.incomeDate)}
                    {income.person ? ` • ${income.person}` : ''}
                  </small>
                </div>

                <strong>
                  {formatAmount(income.amount)}
                </strong>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  )
}

export default Income
