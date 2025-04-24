import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AccountSummaryPopup = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // Static data for demo
  const stats = {
    matchesWon: 15,
    matchesLost: 7,
    currentBalance: 8200,
    transactionHistory: [
      { id: 1, date: "2025-04-20", type: "Deposit", amount: 2000 },
      { id: 2, date: "2025-04-21", type: "Withdrawal", amount: -1000 },
      { id: 3, date: "2025-04-22", type: "Prize", amount: 3000 },
    ],
  };

  return (
    <>
      <button onClick={handleOpen} className="dropdown-item text-danger fw-bold">
        My Account
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">My Account Summary</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  {/* Summary Stats Cards */}
                  <div className="row g-3 mb-4 text-center">
                    <div className="col-md-4">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="text-muted">Matches Won</h6>
                          <h4 className="text-success fw-bold">{stats.matchesWon}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="text-muted">Matches Lost</h6>
                          <h4 className="text-danger fw-bold">{stats.matchesLost}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="text-muted">Total Matches</h6>
                          <h4 className="text-dark fw-bold">
                            {stats.matchesWon + stats.matchesLost}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balance Card */}
                  <div className="card mb-4">
                    <div className="card-header bg-light">Current Balance</div>
                    <div className="card-body text-center">
                      <h3 className="fw-bold text-primary">Rs. {stats.currentBalance}</h3>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <i className="fas fa-list me-2"></i>Transaction History
                    </div>
                    <div className="card-body p-0">
                      <table className="table table-bordered table-striped mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.transactionHistory.map((t, index) => (
                            <tr key={t.id}>
                              <td>{index + 1}</td>
                              <td>{t.date}</td>
                              <td>{t.type}</td>
                              <td className={t.amount > 0 ? "text-success" : "text-danger"}>
                                {t.amount > 0 ? `+${t.amount}` : t.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSummaryPopup;
