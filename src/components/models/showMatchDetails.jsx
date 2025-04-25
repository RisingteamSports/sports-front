import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MatchDetailsPopup = ({ match, currentUser, onRequestClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const safeParse = (data) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  };

  const teamMembers = safeParse(match.players);
  const rules = safeParse(match.rules);
  const equipment = safeParse(match.equipment);
  const facilities = safeParse(match.facilities);

  const handleOpen = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <a href="#" onClick={handleOpen} className="border-0 text-decoration-none small">
        Match Details
      </a>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Match Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">

                  {/* Team Members */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h5 className="mb-3">Team Squad</h5>
                      <div className="row g-3">
                        {teamMembers.map((member, index) => (
                          <div className="col-md-6" key={index}>
                            <div className="d-flex align-items-center p-2 bg-light rounded">
                              <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <div className="fw-bold">
                                  {member.name}
                                  {member.isCaptain && (
                                    <span className="badge bg-warning ms-2">Captain</span>
                                  )}
                                </div>
                                <small className="text-muted">{member.role}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <i className="fas fa-info-circle me-2"></i>
                          Basic Info
                        </div>
                        <div className="card-body">
                          <dl className="row mb-0">
                            <dt className="col-6">Category:</dt>
                            <dd className="col-6">{match.category}</dd>

                            <dt className="col-6">Date:</dt>
                            <dd className="col-6">
                              {new Date(match.match_datetime).toLocaleDateString()}
                            </dd>

                            <dt className="col-6">Time:</dt>
                            <dd className="col-6">
                              {new Date(match.match_datetime).toLocaleTimeString()}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <i className="fas fa-cogs me-2"></i>
                          Match Specs
                        </div>
                        <div className="card-body">
                          <dl className="row mb-0">
                            <dt className="col-6">Overs:</dt>
                            <dd className="col-6">{match.overs || "20"}</dd>

                            <dt className="col-6">Ball Type:</dt>
                            <dd className="col-6">{match.ball_type || "Unknown"}</dd>

                            <dt className="col-6">Bid:</dt>
                            <dd className="col-6">
                              {match.match_bid === "yes" ? `Rs. ${match.custom_bid ?? "0"}` : "No"}
                            </dd>

                            <dt className="col-6">Security:</dt>
                            <dd className="col-6">
                              {match.security == 1 ? `Rs. ${match.security_amount ?? "0"}` : "No"}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rules & Requirements */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <i className="fas fa-scroll me-2"></i>
                          Match Rules
                        </div>
                        <div className="card-body">
                          <ul className="list-unstyled mb-0">
                            {rules.map((rule, index) => (
                              <li key={index} className="d-flex mb-2">
                                <i className="fas fa-angle-right text-primary me-2 mt-1"></i>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <i className="fas fa-clipboard-list me-2"></i>
                          Requirements
                        </div>
                        <div className="card-body">
                          <ul className="list-unstyled mb-0">
                            <li className="d-flex mb-2">
                              <i className="fas fa-tshirt text-primary me-2 mt-1"></i>
                              {match.dress_code || "Not specified"}
                            </li>
                            <li className="d-flex mb-2">
                              <i className="fas fa-baseball-ball text-primary me-2 mt-1"></i>
                              {equipment.length > 0 ? equipment.join(", ") : "Bring your own equipment"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button className="btn btn-primary px-4" onClick={onRequestClick}>
                      <i className="fas fa-calendar-check me-2"></i>Request Match
                    </button>
                    <button className="btn btn-outline-secondary px-4">Edit</button>
                    <button className="btn btn-outline-secondary px-4" onClick={() => setShowHistory(!showHistory)}>
                      {showHistory ? "Hide History" : "Show History"}
                    </button>
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

export default MatchDetailsPopup;
