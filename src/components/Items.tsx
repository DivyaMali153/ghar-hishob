import { useState } from 'react'
import { items } from '../data/store'
import type { Item } from '../types'

function Items() {
  const [showForm, setShowForm] = useState(false)

  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [usedDate, setUsedDate] = useState('')
  const [person, setPerson] = useState('')
  const [notes, setNotes] = useState('')

  const [itemList, setItemList] = useState<Item[]>(items)

  const resetForm = () => {
    setItemName('')
    setCategory('')
    setQuantity('')
    setPrice('')
    setPurchaseDate('')
    setUsedDate('')
    setPerson('')
    setNotes('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newItem: Item = {
      id: Date.now(),
      name: itemName,
      category,
      quantity: Number(quantity),
      price: Number(price),
      purchaseDate,
      usedDate,
      person,
      notes,
    }

    items.push(newItem)
    setItemList([...items])

    resetForm()
    setShowForm(false)
  }

  return (
    <div className="items-page">

      <div className="items-header">
        <div>
          <h2>📦 घरातील वस्तू</h2>
          <p>घरातील वस्तूंची नोंद आणि वापराचा हिशोब</p>
        </div>

        <button
          className="add-item-btn"
          onClick={() => setShowForm(true)}
        >
          + वस्तू जोडा
        </button>
      </div>

      {/* Item List */}
      <div className="dashboard-section">

        <div className="section-title">
          <div>
            <h3>📋 वस्तूंची यादी</h3>
            <p>एकूण {itemList.length} वस्तू</p>
          </div>
        </div>

        {itemList.length === 0 ? (
          <div className="empty-activity">
            <div>📦</div>
            <p>अजून कोणतीही वस्तू जोडलेली नाही.</p>
            <small>
              वरच्या "वस्तू जोडा" button वर click करा.
            </small>
          </div>
        ) : (
          <div className="item-list">

            {itemList.map((item) => (
              <div className="item-row" key={item.id}>

                <div className="item-main">
                  <div className="item-icon">
                    📦
                  </div>

                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.category}</span>
                  </div>
                </div>

                <div className="item-detail">
                  <span>Quantity</span>
                  <strong>{item.quantity}</strong>
                </div>

                <div className="item-detail">
                  <span>किंमत</span>
                  <strong>₹ {item.price}</strong>
                </div>

                <div className="item-detail">
                  <span>नोंद केली</span>
                  <strong>{item.person}</strong>
                </div>

                <div className="item-detail">
                  <span>तारीख</span>
                  <strong>{item.purchaseDate}</strong>
                </div>
                <div className="item-detail">
  <span>वापरायला काढले</span>
  <strong>
    {item.usedDate ? item.usedDate : 'अजून वापरले नाही'}
  </strong>
</div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Add Item Modal */}
      {showForm && (
        <div className="form-overlay">

          <div className="item-form">

            <div className="form-header">
              <h2>📦 नवीन वस्तू जोडा</h2>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>वस्तूचे नाव</label>

                <input
                  type="text"
                  placeholder="उदा. गॅस सिलेंडर"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Category निवडा</option>
                  <option value="किचन">किचन</option>
                  <option value="घर">घर</option>
                  <option value="साफसफाई">साफसफाई</option>
                  <option value="किराणा">किराणा</option>
                  <option value="इतर">इतर</option>
                </select>
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>किती आणले?</label>

                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>किंमत ₹</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="900"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>आणल्याची तारीख</label>

                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>वापरायला काढल्याची तारीख</label>

                  <input
                    type="date"
                    value={usedDate}
                    onChange={(e) => setUsedDate(e.target.value)}
                  />
                </div>

              </div>

              <div className="form-group">
                <label>कोणाने नोंद केली?</label>

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
                >
                  💾 Save करा
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Items