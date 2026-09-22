function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>🏠 घरहिशोब</h2>
          <p>घरातील खर्च, वस्तू आणि बिलांचा संपूर्ण हिशोब</p>
        </div>

        <div className="today-date">
          📅 आज
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon">💰</div>
          <div>
            <p>या महिन्याचा खर्च</p>
            <h3>₹ 0</h3>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📦</div>
          <div>
            <p>उपलब्ध वस्तू</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔴</div>
          <div>
            <p>संपलेल्या वस्तू</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🧾</div>
          <div>
            <p>Pending Bills</p>
            <h3>0</h3>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <section className="dashboard-section">

        <h3>⚡ जलद नोंद</h3>

        <div className="dashboard-actions">

          <button>
            📦
            <span>वस्तू जोडा</span>
          </button>

          <button>
            💰
            <span>खर्च जोडा</span>
          </button>

          <button>
            🧾
            <span>बिल जोडा</span>
          </button>

        </div>

      </section>

      {/* Monthly Summary */}
      <section className="dashboard-section monthly-summary">

        <div className="section-title">
          <div>
            <h3>📊 या महिन्याचा हिशोब</h3>
            <p>September 2026</p>
          </div>
        </div>

        <div className="monthly-grid">

          <div>
            <span>एकूण खर्च</span>
            <strong>₹ 0</strong>
          </div>

          <div>
            <span>एकूण बिले</span>
            <strong>₹ 0</strong>
          </div>

          <div>
            <span>वस्तूंवर खर्च</span>
            <strong>₹ 0</strong>
          </div>

        </div>

      </section>

      {/* Recent Activity */}
      <section className="dashboard-section">

        <div className="section-title">
          <div>
            <h3>🕐 अलीकडील नोंदी</h3>
            <p>तुमच्या घरातील अलीकडील व्यवहार</p>
          </div>
        </div>

        <div className="empty-activity">
          <div>📋</div>
          <p>अजून कोणतीही नोंद केलेली नाही.</p>
          <small>
            वस्तू, खर्च किंवा बिलाची नोंद केल्यावर ती येथे दिसेल.
          </small>
        </div>

      </section>

    </div>
  )
}

export default Dashboard