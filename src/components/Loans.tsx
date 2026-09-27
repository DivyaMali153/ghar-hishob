import { useEffect, useState } from "react"

type Loan = {
  id: number
  name: string
  principalAmount: number
  interestRate: number
  tenureMonths: number
  emiAmount: number
  startDate: string
  endDate: string | null
  person: string | null
  status: string
  notes: string | null
}

type LoanPayment = {
  id: number
  loanId: number
  amount: number
  paymentDate: string
  principalAmount: number
  interestAmount: number
  notes: string | null
}

const API = "http://localhost:5000/api"

const today = () => new Date().toISOString().slice(0, 10)

const formatAmount = (value: number) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN")}`

const formatDate = (value: string) => value?.slice(0, 10) || "-"

const calculateEMI = (principal: number, annualRate: number, tenureMonths: number) => {
  if (principal <= 0 || tenureMonths <= 0) return 0

  if (annualRate <= 0) {
    return principal / tenureMonths
  }

  const monthlyRate = annualRate / 12 / 100
  const factor = Math.pow(1 + monthlyRate, tenureMonths)

  return principal * monthlyRate * factor / (factor - 1)
}


function Loans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [payments, setPayments] = useState<LoanPayment[]>([])

  const [form, setForm] = useState({
    name: "",
    principalAmount: "",
    interestRate: "",
    tenureMonths: "",
    emiAmount: "",
    person: "Ganesh",
    startDate: today(),
    endDate: "",
    notes: "",
  })

  const [paymentForm, setPaymentForm] = useState({
    loanId: "",
    amount: "",
    paymentDate: today(),
    principalAmount: "",
    interestAmount: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const loadLoans = async () => {
    try {
      const response = await fetch(`${API}/loans`)
      const result = await response.json()

      if (result.success) {
        setLoans(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch loans:", error)
    }
  }

  const loadPayments = async () => {
    try {
      const response = await fetch(`${API}/loan-payments`)
      const result = await response.json()

      if (result.success) {
        setPayments(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch loan payments:", error)
    }
  }

  useEffect(() => {
    loadLoans()
    loadPayments()
  }, [])

  const handleLoanChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setForm((previous) => {
      const next = {
        ...previous,
        [name]: value,
      }

      if (["principalAmount", "interestRate", "tenureMonths"].includes(name)) {
        const emi = calculateEMI(
          Number(next.principalAmount || 0),
          Number(next.interestRate || 0),
          Number(next.tenureMonths || 0)
        )

        next.emiAmount = emi > 0 ? emi.toFixed(2) : ""
      }

      return next
    })
  }

  const deleteLoan = async (loanId: number) => {
    const confirmed = window.confirm(
      "हे कर्ज आणि त्याचे EMI payments delete करायचे आहेत?"
    )

    if (!confirmed) return

    try {
      const response = await fetch(`${API}/loans/${loanId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        alert(result.message || "कर्ज delete करता आले नाही.")
        return
      }

      await loadLoans()
      await loadPayments()

      alert("कर्ज delete झाले.")
    } catch (error) {
      console.error("Delete loan error:", error)
      alert("कर्ज delete करताना समस्या आली.")
    }
  }

  const handlePaymentChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setPaymentForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (name === "loanId") {
      const selectedLoan = loans.find(
        (loan) => String(loan.id) === value
      )

      if (selectedLoan) {
        setPaymentForm((previous) => ({
          ...previous,
          loanId: value,
          amount: String(selectedLoan.emiAmount),
        }))
      }
    }
  }

  const addLoan = async (event: React.FormEvent) => {
    event.preventDefault()

    if (
      !form.name ||
      !form.principalAmount ||
      !form.tenureMonths ||
      !form.emiAmount ||
      !form.startDate
    ) {
      alert("कृपया आवश्यक माहिती भरा.")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API}/loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          principalAmount: Number(form.principalAmount),
          interestRate: Number(form.interestRate || 0),
          tenureMonths: Number(form.tenureMonths),
          emiAmount: Number(form.emiAmount),
          startDate: form.startDate,
          endDate: form.endDate || null,
          person: form.person,
          status: "ACTIVE",
          notes: form.notes || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        alert(result.message || "कर्ज सेव्ह करता आले नाही.")
        return
      }

      setForm({
        name: "",
        principalAmount: "",
        interestRate: "",
        tenureMonths: "",
        emiAmount: "",
        person: "Ganesh",
        startDate: today(),
        endDate: "",
        notes: "",
      })

      await loadLoans()
      alert("कर्ज यशस्वीपणे नोंदवले.")
    } catch (error) {
      console.error("Add loan error:", error)
      alert("कर्ज सेव्ह करताना समस्या आली.")
    } finally {
      setLoading(false)
    }
  }

  const addPayment = async (event: React.FormEvent) => {
    event.preventDefault()

    if (
      !paymentForm.loanId ||
      !paymentForm.amount ||
      !paymentForm.paymentDate
    ) {
      alert("कर्ज, रक्कम आणि Payment Date भरा.")
      return
    }

    try {
      setPaymentLoading(true)

      const response = await fetch(`${API}/loan-payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanId: Number(paymentForm.loanId),
          amount: Number(paymentForm.amount),
          paymentDate: paymentForm.paymentDate,
          principalAmount: Number(paymentForm.principalAmount || 0),
          interestAmount: Number(paymentForm.interestAmount || 0),
          notes: paymentForm.notes || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        alert(result.message || "EMI सेव्ह करता आली नाही.")
        return
      }

      setPaymentForm({
        loanId: "",
        amount: "",
        paymentDate: today(),
        principalAmount: "",
        interestAmount: "",
        notes: "",
      })

      await loadPayments()
      alert("EMI payment यशस्वीपणे नोंदवला.")
    } catch (error) {
      console.error("Add loan payment error:", error)
      alert("EMI सेव्ह करताना समस्या आली.")
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <div className="page-section">

      {/* LOAN FORM */}
      <div className="page-header">
        <div>
          <h1>कर्ज</h1>
          <p>घरातील कर्जाची नोंद करा</p>
        </div>
      </div>

      <form className="form-card" onSubmit={addLoan}>
        <div className="form-row">

          <div className="form-group">
            <label>कर्जाचे नाव</label>
            <input
              name="name"
              value={form.name}
              onChange={handleLoanChange}
              placeholder="उदा. Home Loan"
            />
          </div>

          <div className="form-group">
            <label>कर्जाची रक्कम</label>
            <input
              name="principalAmount"
              type="number"
              value={form.principalAmount}
              onChange={handleLoanChange}
              placeholder="₹ 0"
            />
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>व्याजदर (%)</label>
            <input
              name="interestRate"
              type="number"
              step="0.01"
              value={form.interestRate}
              onChange={handleLoanChange}
              placeholder="उदा. 8.5"
            />
          </div>

          <div className="form-group">
            <label>कालावधी (महिने)</label>
            <input
              name="tenureMonths"
              type="number"
              value={form.tenureMonths}
              onChange={handleLoanChange}
              placeholder="उदा. 240"
            />
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>EMI रक्कम</label>
            <input
              name="emiAmount"
              type="number"
              value={form.emiAmount}
              readOnly
              placeholder="₹ 0"
            />
          </div>

          <div className="form-group">
            <label>सदस्य</label>
            <select
              name="person"
              value={form.person}
              onChange={handleLoanChange}
            >
              <option value="Ganesh">Ganesh</option>
              <option value="Divya">Divya</option>
            </select>
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>सुरुवातीची तारीख</label>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleLoanChange}
            />
          </div>

          <div className="form-group">
            <label>समाप्तीची तारीख</label>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleLoanChange}
            />
          </div>

        </div>

        <div className="form-group">
          <label>नोंद</label>
          <input
            name="notes"
            value={form.notes}
            onChange={handleLoanChange}
            placeholder="ऐच्छिक"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "सेव्ह होत आहे..." : "＋ कर्ज नोंदवा"}
          </button>
        </div>
      </form>

      {/* LOANS LIST */}
      <div className="list-section">
        <div className="section-title">
          <div>
            <h2>अलीकडील कर्ज</h2>
            <p>तुमच्या घरातील कर्जांची नोंद</p>
          </div>
        </div>

        {loans.length === 0 ? (
          <div className="empty-activity">
            🏦
            <p>अजून कोणतेही कर्ज नोंदवलेले नाही.</p>
          </div>
        ) : (
          <div className="activity-list">
            {loans.map((loan) => {
              const loanPayments = payments.filter(
                (payment) => payment.loanId === loan.id
              )

              const totalPaid = loanPayments.reduce(
                (sum, payment) => sum + Number(payment.amount || 0),
                0
              )

              const remainingPrincipal = Math.max(
                Number(loan.principalAmount) - totalPaid,
                0
              )

              return (
                <div className="recent-activity-item" key={loan.id}>
                  <div className="recent-activity-info">
                    <strong>{loan.name}</strong>

                    <small>
                      Principal {formatAmount(loan.principalAmount)}
                      {" • "}
                      Interest {loan.interestRate}%
                    </small>

                    <small>
                      EMI {formatAmount(loan.emiAmount)}
                      {" • "}
                      {loan.tenureMonths} महिने
                    </small>

                    <small>
                      Total Paid {formatAmount(totalPaid)}
                      {" • "}
                      Remaining Principal {formatAmount(remainingPrincipal)}
                    </small>

                    <small>
                      {formatDate(loan.startDate)}
                      {" • "}
                      {loan.person || "-"}
                    </small>
                  </div>

                  <div className="recent-activity-amount">
                    {formatAmount(loan.emiAmount)}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteLoan(loan.id)}
                    style={{ marginLeft: "12px" }}
                  >
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* EMI PAYMENT */}
      <div className="list-section">
        <div className="section-title">
          <div>
            <h2>EMI / कर्ज भरणा</h2>
            <p>भरलेली EMI किंवा कर्जाची रक्कम नोंदवा</p>
          </div>
        </div>

        <form className="form-card" onSubmit={addPayment}>

          <div className="form-row">

            <div className="form-group">
              <label>कर्ज निवडा</label>
              <select
                name="loanId"
                value={paymentForm.loanId}
                onChange={handlePaymentChange}
              >
                <option value="">कर्ज निवडा</option>

                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.name} — EMI {formatAmount(loan.emiAmount)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>EMI रक्कम</label>
              <input
                name="amount"
                type="number"
                value={paymentForm.amount}
                onChange={handlePaymentChange}
                placeholder="₹ 0"
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Payment Date</label>
              <input
                name="paymentDate"
                type="date"
                value={paymentForm.paymentDate}
                onChange={handlePaymentChange}
              />
            </div>

            <div className="form-group">
              <label>Principal रक्कम</label>
              <input
                name="principalAmount"
                type="number"
                value={paymentForm.principalAmount}
                onChange={handlePaymentChange}
                placeholder="₹ 0"
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Interest रक्कम</label>
              <input
                name="interestAmount"
                type="number"
                value={paymentForm.interestAmount}
                onChange={handlePaymentChange}
                placeholder="₹ 0"
              />
            </div>

            <div className="form-group">
              <label>नोंद</label>
              <input
                name="notes"
                value={paymentForm.notes}
                onChange={handlePaymentChange}
                placeholder="उदा. September EMI"
              />
            </div>

          </div>

          <div className="form-actions">
            <button type="submit" disabled={paymentLoading}>
              {paymentLoading
                ? "सेव्ह होत आहे..."
                : "＋ EMI नोंदवा"}
            </button>
          </div>

        </form>
      </div>

      {/* PAYMENT HISTORY */}
      <div className="list-section">
        <div className="section-title">
          <div>
            <h2>EMI Payment History</h2>
            <p>भरलेल्या EMI ची नोंद</p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="empty-activity">
            💳
            <p>अजून कोणतीही EMI नोंदवलेली नाही.</p>
          </div>
        ) : (
          <div className="activity-list">
            {payments.map((payment) => {
              const loan = loans.find(
                (item) => item.id === payment.loanId
              )

              return (
                <div
                  className="recent-activity-item"
                  key={payment.id}
                >
                  <div className="recent-activity-info">
                    <strong>
                      {loan?.name || `Loan #${payment.loanId}`}
                    </strong>

                    <small>
                      {formatDate(payment.paymentDate)}
                    </small>

                    <small>
                      Principal {formatAmount(payment.principalAmount)}
                      {" • "}
                      Interest {formatAmount(payment.interestAmount)}
                    </small>
                  </div>

                  <div className="recent-activity-amount">
                    {formatAmount(payment.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

export default Loans
