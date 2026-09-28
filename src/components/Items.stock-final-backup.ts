import { useEffect, useMemo, useState } from 'react'
import type { Item } from '../types'

const API_URL = 'http://localhost:5000/api'

type MasterItem = {
  name: string
  category: string
}

type StockItem = Item & {
  openingStock?: number
  addedStock?: number
  usedStock?: number
  remainingStock?: number
  stockStatus?: string
}

const defaultMasterItems: MasterItem[] = [
  { name: 'Milk', category: 'किराणा' },
  { name: 'Sugar', category: 'किराणा' },
  { name: 'Rice', category: 'किराणा' },
  { name: 'Wheat', category: 'किराणा' },
  { name: 'Oil', category: 'किराणा' },
  { name: 'Tea', category: 'किराणा' },
  { name: 'Salt', category: 'किराणा' },
  { name: 'Onion', category: 'किराणा' },
  { name: 'Potato', category: 'किराणा' },
  { name: 'Tomato', category: 'किराणा' },
  { name: 'Soap', category: 'घर' },
  { name: 'Detergent', category: 'साफसफाई' },
  { name: 'Toothpaste', category: 'घर' },
  { name: 'Gas', category: 'किचन' },
  { name: 'Battery', category: 'घर' },
]

function Items() {
  const [showForm, setShowForm] = useState(false)

  const [itemList, setItemList] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [masterItems, setMasterItems] =
    useState<MasterItem[]>(defaultMasterItems)

  const [showItemDropdown, setShowItemDropdown] =
    useState(false)

  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [usedDate, setUsedDate] = useState('')
  const [person, setPerson] = useState('')
  const [notes, setNotes] = useState('')

  const loadItems = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/items`)
      const result = await response.json()

      if (result.success) {
        setItemList(result.data || [])
      }
    } catch (error) {
      console.error('Items load error:', error)
      alert(
        'Items load होत नाहीत. API चालू आहे का ते check करा.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const formatDate = (
    date: string | null | undefined
  ) => {
    if (!date) return ''
    return date.substring(0, 10)
  }

  const resetForm = () => {
    setItemName('')
    setCategory('')
    setQuantity('')
    setPrice('')
    setPurchaseDate('')
    setUsedDate('')
    setPerson('')
    setNotes('')
    setShowItemDropdown(false)
  }

  const filteredMasterItems = useMemo(() => {
    const search = itemName.trim().toLowerCase()

    if (!search) {
      return masterItems
    }

    return masterItems.filter((item) =>
      item.name.toLowerCase().includes(search)
    )
  }, [itemName, masterItems])

  const selectItem = (item: MasterItem) => {
    setItemName(item.name)
    setCategory(item.category)
    setShowItemDropdown(false)
  }

  const addNewMasterItem = () => {
    const newItemName = window.prompt(
      'नवीन वस्तूचे नाव लिहा'
    )

    if (!newItemName) return

    const cleanName = newItemName.trim()

    if (!cleanName) return

    const alreadyExists = masterItems.some(
      (item) =>
        item.name.toLowerCase() ===
        cleanName.toLowerCase()
    )

    if (alreadyExists) {
      alert('ही वस्तू आधीच list मध्ये आहे.')
      setItemName(cleanName)
      setShowItemDropdown(true)
      return
    }

    const newMasterItem: MasterItem = {
      name: cleanName,
      category: 'इतर',
    }

    setMasterItems((previousItems) => [
      newMasterItem,
      ...previousItems,
    ])

    setItemName(cleanName)
    setCategory('इतर')
    setShowItemDropdown(false)
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      setSaving(true)

      const newItem = {
        name: itemName,
        category,
        quantity: Number(quantity),
        price: Number(price),
        purchaseDate,
        usedDate,
        person,
        notes,
      }

      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Item save failed'
        )
      }

      /*
       * Reload from API so calculated stock values
       * are immediately reflected.
       */
      await loadItems()

      resetForm()
      setShowForm(false)

      alert('वस्तू successfully save झाली!')
    } catch (error) {
      console.error('Item save error:', error)

      alert(
        'वस्तू save झाली नाही. API check करा.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="items-page">

      {/* Header */}
      <div className="items-header">
        <div>
          <h2>📦 घरातील वस्तू</h2>

          <p>
            घरातील वस्तूंची नोंद आणि वापराचा हिशोब
          </p>
        </div>

        <button
          className="add-item-btn"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + वस्तू जोडा
        </button>
      </div>

      {/* Item List */}
      <div className="dashboard-section">

        <div className="section-title">
          <div>
            <h3>📋 वस्तूंची यादी</h3>

            <p>
              एकूण {itemList.length} वस्तू
            </p>
          </div>
        </div>

        {loading ? (

          <div className="empty-activity">
            <div>⏳</div>
            <p>वस्तू load होत आहेत...</p>
          </div>

        ) : itemList.length === 0 ? (

          <div className="empty-activity">
            <div>📦</div>

            <p>
              अजून कोणतीही वस्तू जोडलेली नाही.
            </p>

            <small>
              वरच्या "वस्तू जोडा" button वर click करा.
            </small>
          </div>

        ) : (

          <div className="item-list">

            {itemList.map((item) => {

              const opening =
                Number(item.openingStock ?? 0)

              const added =
                Number(
                  item.addedStock ??
                  item.quantity ??
                  0
                )

              const used =
                Number(item.usedStock ?? 0)

              const remaining =
                Math.max(
                  0,
                  Number(
                    item.remainingStock ??
                    opening + added - used
                  )
                )

              const status =
                item.stockStatus ??
                (
                  remaining <= 0
                    ? 'Out of Stock'
                    : remaining <= 5
                      ? 'Low'
                      : 'Available'
                )

              return (
                <div
                  className="item-row"
                  key={item.id}
                >

                  {/* Item */}
                  <div className="item-main">

                    <div className="item-icon">
                      📦
                    </div>

                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.category}
                      </span>
                    </div>

                  </div>

                  {/* Opening Stock */}
                  <div className="item-detail">
                    <span>
                      Opening Stock
                    </span>

                    <strong>
                      {opening}
                    </strong>
                  </div>

                  {/* Added Stock */}
                  <div className="item-detail">
                    <span>
                      Added Stock
                    </span>

                    <strong>
                      {added}
                    </strong>
                  </div>

                  {/* Used / Sold */}
                  <div className="item-detail">
                    <span>
                      Used / Sold
                    </span>

                    <strong>
                      {used}
                    </strong>
                  </div>

                  {/* Remaining */}
                  <div className="item-detail">
                    <span>
                      Remaining
                    </span>

                    <strong>
                      {remaining}
                    </strong>
                  </div>

                  {/* Rate */}
                  <div className="item-detail">
                    <span>
                      किंमत
                    </span>

                    <strong>
                      ₹ {item.price}
                    </strong>
                  </div>

                  {/* Status */}
                  <div className="item-detail">
                    <span>
                      Status
                    </span>

                    <strong>
                      {status}
                    </strong>
                  </div>

                  {/* Person */}
                  <div className="item-detail">
                    <span>
                      नोंद केली
                    </span>

                    <strong>
                      {item.person || '-'}
                    </strong>
                  </div>

                  {/* Purchase Date */}
                  <div className="item-detail">
                    <span>
                      आणल्याची तारीख
                    </span>

                    <strong>
                      {formatDate(
                        item.purchaseDate
                      )}
                    </strong>
                  </div>

                  {/* Used Date */}
                  <div className="item-detail">
                    <span>
                      वापरायला काढले
                    </span>

                    <strong>
                      {item.usedDate
                        ? formatDate(item.usedDate)
                        : 'अजून वापरले नाही'}
                    </strong>
                  </div>

                </div>
              )
            })}

          </div>
        )}

      </div>

      {/* Add Item Modal */}
      {showForm && (

        <div className="form-overlay">

          <div className="item-form">

            {/* Form Header */}
            <div className="form-header">

              <h2>
                📦 नवीन वस्तू जोडा
              </h2>

              <button
                className="close-btn"
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Item Name */}
              <div className="form-group item-name-wrapper">

                <label>
                  वस्तूचे नाव
                </label>

                <div className="item-search-input">

                  <input
                    type="text"
                    placeholder="वस्तू शोधा..."
                    value={itemName}
                    autoComplete="off"
                    onFocus={() =>
                      setShowItemDropdown(true)
                    }
                    onChange={(e) => {

                      setItemName(
                        e.target.value
                      )

                      setShowItemDropdown(true)

                      const exactItem =
                        masterItems.find(
                          (item) =>
                            item.name
                              .toLowerCase() ===
                            e.target.value
                              .trim()
                              .toLowerCase()
                        )

                      if (exactItem) {
                        setCategory(
                          exactItem.category
                        )
                      } else {
                        setCategory('')
                      }
                    }}
                    required
                  />

                  <span className="item-dropdown-arrow">
                    ▾
                  </span>

                </div>

                {/* Dropdown */}
                {showItemDropdown && (

                  <div className="item-name-dropdown">

                    {filteredMasterItems.length > 0 ? (

                      filteredMasterItems.map(
                        (item) => (

                          <button
                            type="button"
                            className="item-dropdown-option"
                            key={`${item.name}-${item.category}`}
                            onClick={() =>
                              selectItem(item)
                            }
                          >

                            <span className="item-option-icon">
                              📦
                            </span>

                            <span className="item-option-content">

                              <strong>
                                {item.name}
                              </strong>

                              <small>
                                {item.category}
                              </small>

                            </span>

                          </button>
                        )
                      )

                    ) : (

                      <div className="item-no-result">

                        <span>
                          🔍
                        </span>

                        <p>
                          "{itemName}" सापडले नाही
                        </p>

                        <button
                          type="button"
                          onClick={addNewMasterItem}
                        >
                          + नवीन वस्तू जोडा
                        </button>

                      </div>
                    )}

                    {filteredMasterItems.length > 0 && (

                      <button
                        type="button"
                        className="item-dropdown-add"
                        onClick={addNewMasterItem}
                      >
                        ＋ नवीन वस्तू जोडा
                      </button>
                    )}

                  </div>
                )}

              </div>

              {/* Category */}
              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Category निवडा
                  </option>

                  <option value="किचन">
                    किचन
                  </option>

                  <option value="घर">
                    घर
                  </option>

                  <option value="साफसफाई">
                    साफसफाई
                  </option>

                  <option value="किराणा">
                    किराणा
                  </option>

                  <option value="इतर">
                    इतर
                  </option>

                </select>

              </div>

              {/* Quantity + Price */}
              <div className="form-row">

                <div className="form-group">

                  <label>
                    किती आणले?
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    किंमत ₹
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="900"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              {/* Dates */}
              <div className="form-row">

                <div className="form-group">

                  <label>
                    आणल्याची तारीख
                  </label>

                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) =>
                      setPurchaseDate(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    वापरायला काढल्याची तारीख
                  </label>

                  <input
                    type="date"
                    value={usedDate}
                    onChange={(e) =>
                      setUsedDate(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* Person */}
              <div className="form-group">

                <label>
                  कोणाने नोंद केली?
                </label>

                <select
                  value={person}
                  onChange={(e) =>
                    setPerson(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    नाव निवडा
                  </option>

                  <option value="Ganesh">
                    Ganesh
                  </option>

                  <option value="Divya">
                    Divya
                  </option>

                </select>

              </div>

              {/* Notes */}
              <div className="form-group">

                <label>
                  Notes
                </label>

                <textarea
                  rows={3}
                  placeholder="काही अतिरिक्त माहिती..."
                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* Actions */}
              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? '⏳ Saving...'
                    : '💾 Save करा'}
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
