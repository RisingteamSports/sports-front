import React from "react";

const AccountSummaryModal = ({ show, onClose, stats }) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">My Account Summary</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row text-center mb-4">
              <div className="col-md-4">
                <h6 className="text-muted">Matches Won</h6>
                <h4 className="text-success fw-bold">{stats.matchesWon}</h4>
              </div>
              <div className="col-md-4">
                <h6 className="text-muted">Matches Lost</h6>
                <h4 className="text-danger fw-bold">{stats.matchesLost}</h4>
              </div>
              <div className="col-md-4">
                <h6 className="text-muted">Total Matches</h6>
                <h4 className="text-dark fw-bold">{stats.matchesWon + stats.matchesLost}</h4>
              </div>
            </div>

            <div className="mb-4 text-center">
              <h6 className="text-muted">Current Balance</h6>
              <h3 className="fw-bold text-primary">Rs. {stats.currentBalance}</h3>
            </div>

            <div>
              <h6 className="text-muted mb-3">Transaction History</h6>
              <table className="table table-bordered table-striped">
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
                      <td className={t.amount > 0 ? 'text-success' : 'text-danger'}>
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
  );
};

export default AccountSummaryModal;
