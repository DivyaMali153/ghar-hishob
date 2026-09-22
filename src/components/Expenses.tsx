import { useState } from 'react'

function Expenses() {
  const [showForm, setShowForm] = useState(false)

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

            <form>

              <div className="form-group">
                <label>खर्चाचे नाव</label>

                <input
                  type="text"
                  placeholder="उदा. भाजीपाला"
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select>
                  <option value="">Category निवडा</option>
                  <option value="किराणा">किराणा</option>
                  <option value="भाजीपाला">भाजीपाला</option>
                  <option value="दूध">दूध</option>
                  <option value="प्रवास">प्रवास</option>
                  <option value="वीज">वीज</option>
                  <option value="गॅस">गॅस</option>
                  <option value="घर">घर</option>
                  <option value="इतर">इतर</option>
                </select>
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>रक्कम ₹</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                  />
                </div>

                <div className="form-group">
                  <label>तारीख</label>

                  <input type="date" />
                </div>

              </div>

              <div className="form-group">
                <label>कोणाने खर्च केला?</label>

                <select>
                  <option value="">नाव निवडा</option>
                  <option value="Ganesh">Ganesh</option>
                  <option value="Divya">Divya</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Method</label>

                <select>
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
                  💾 खर्च Save करा
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Expenses