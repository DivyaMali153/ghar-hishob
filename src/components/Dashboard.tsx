import { useEffect, useState } from "react";

type DashboardData = {
  monthlyItemSpend: number;
  monthlyExpenses: number;
  monthlyBills: number;
  monthlyIncome: number;
  monthlyLoanPayments: number;
  totalMonthlyOutflow: number;
  activeLoans: number;
  totalLoans: number;
  recentActivity: {
    type: string;
    date: string;
    amount: number;
    id: number;
    itemName?: string;
    memberName?: string;
  }[];
};

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      })
      .catch((error) => {
        console.error("Dashboard API error:", error);
      });
  }, []);

  const dashboard = data ?? {
    monthlyItemSpend: 0,
    monthlyExpenses: 0,
    monthlyBills: 0,
    monthlyIncome: 0,
    monthlyLoanPayments: 0,
    totalMonthlyOutflow: 0,
    activeLoans: 0,
    totalLoans: 0,
    recentActivity: [],
  };

  const formatAmount = (amount: number) =>
    `₹ ${amount.toLocaleString("en-IN")}`;

  const formatDate = (date: string) =>
    date.substring(0, 10);

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "ITEM":
        return "📦 वस्तू";
      case "EXPENSE":
        return "💰 खर्च";
      case "BILL":
        return "🧾 बिल";
      case "INCOME":
        return "💵 उत्पन्न";
      default:
        return "📋 नोंद";
    }
  };

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
            <h3>
              {formatAmount(dashboard.totalMonthlyOutflow)}
            </h3>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📦</div>
          <div>
            <p>नोंद केलेल्या वस्तू</p>
            <h3>
              {dashboard.recentActivity.filter(
                (item) => item.type === "ITEM"
              ).length}
            </h3>
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
            <h3>
              {formatAmount(dashboard.monthlyBills)}
            </h3>
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
            <strong>
              {formatAmount(dashboard.totalMonthlyOutflow)}
            </strong>
          </div>

          <div>
            <span>एकूण बिले</span>
            <strong>
              {formatAmount(dashboard.monthlyBills)}
            </strong>
          </div>

          <div>
            <span>वस्तूंवर खर्च</span>
            <strong>
              {formatAmount(dashboard.monthlyItemSpend)}
            </strong>
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

        {dashboard.recentActivity.length === 0 ? (
          <div className="empty-activity">
            <div>📋</div>
            <p>अजून कोणतीही नोंद केलेली नाही.</p>
            <small>
              वस्तू, खर्च किंवा बिलाची नोंद केल्यावर ती येथे दिसेल.
            </small>
          </div>
        ) : (
          <div className="recent-activity-list">
            {dashboard.recentActivity.map((activity) => (
              <div
                className="recent-activity-item"
                key={`${activity.type}-${activity.id}`}
              >
                <div className="recent-activity-info">
                  <strong>
                    {activity.itemName || getActivityLabel(activity.type)}
                  </strong>
                  <small>
                    {formatDate(activity.date)}
                    {activity.memberName ? ` • ${activity.memberName}` : ""}
                  </small>
                </div>

                <strong className="recent-activity-amount">
                  {formatAmount(activity.amount)}
                </strong>
              </div>
            ))}
          </div>
        )}

      </section>

      <footer className="dashboard-footer">
        Developed by <strong>Divya</strong> 
      </footer>

    </div>
  );
}

export default Dashboard;
