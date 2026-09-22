import { useState } from 'react'

function Bills() {
  const [showForm, setShowForm] = useState(false)

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

            <form>

              <div className="form-group">
                <label>बिलाचे नाव</label>

                <input
                  type="text"
                  placeholder="उदा. MSEB Electricity"
                />
              </div>

              <div className="form-group">
                <label>Bill Category</label>

                <select>
                  <option value="">Category निवडा</option>
                  <option value="वीज">वीज</option>
                  <option value="मोबाईल">मोबाईल</option>
                  <option value="इंटरनेट">इंटरनेट</option>
                  <option value="DTH">DTH</option>
                  <option value="गॅस">गॅस</option>
                  <option value="पाणी">पाणी</option>
                  <option value="इतर">इतर</option>
                </select>
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>बिलाची रक्कम ₹</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="1500"
                  />
                </div>

                <div className="form-group">
                  <label>Bill Date</label>

                  <input type="date" />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Due Date</label>

                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Payment Date</label>

                  <input type="date" />
                </div>

              </div>

              <div className="form-group">
                <label>Payment Method</label>

                <select>
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

                <select>
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
                />
              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  💾 बिल Save करा
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Bills