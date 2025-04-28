import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RequestPageEditor from "./RequestPageEditor";
import EditMatchModal from "./EditMatch";

const MatchDetailsPopup = ({ match, currentUser, onRequestClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
  const history = safeParse(match.history || []);

  // Check if current user is the creator of the match
  const isCreator = currentUser && match.user_id === match.user.id;
  const handleOpen = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowHistory(false);
  };

  const handleRequestClick = () => {
    setShowModal(false);
    setShowRequestModal(true);
  };

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
                              {/* Player Image */}
                              <div 
                                className="avatar-upload me-3"
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '50%',
                                  overflow: 'hidden'
                                }}
                              >
                                {member.image ? (
                                  <img 
                                    src={member.image} 
                                    alt={`Player ${index + 1}`}
                                    className="w-100 h-100 object-fit-cover" 
                                  />
                                ) : (
                                  <div 
                                    className="d-flex align-items-center justify-content-center h-100 bg-primary text-white"
                                    style={{
                                      fontSize: '1.5rem',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                  </div>
                                )}
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

                  {/* Rest of your existing modal content remains the same */}
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

                  {/* History Section */}
                  {showHistory && (
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-header bg-light">
                            <i className="fas fa-history me-2"></i>
                            Match History
                          </div>
                          <div className="card-body">
                            {history.length > 0 ? (
                              <div className="timeline">
                                {(showFullHistory ? history : history.slice(0, 3)).map((item, index) => (
                                  <div key={index} className="timeline-item mb-3">
                                    <div className="d-flex">
                                      <div className="timeline-badge bg-primary text-white rounded-circle me-3">
                                        <i className={`fas fa-${item.icon || 'calendar'}`}></i>
                                      </div>
                                      <div className="flex-grow-1">
                                        <h6 className="mb-1">{item.title}</h6>
                                        <p className="text-muted small mb-1">{item.description}</p>
                                        <small className="text-muted">
                                          {new Date(item.date).toLocaleString()}
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {history.length > 3 && !showFullHistory && (
                                  <button 
                                    className="btn btn-link p-0"
                                    onClick={() => setShowFullHistory(true)}
                                  >
                                    Show more...
                                  </button>
                                )}
                                {showFullHistory && (
                                  <button 
                                    className="btn btn-link p-0"
                                    onClick={() => setShowFullHistory(false)}
                                  >
                                    Show less
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-3">
                                <i className="fas fa-info-circle fa-2x text-muted mb-2"></i>
                                <p className="text-muted">No history data available for this match</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    {!isCreator && (
                      <button
                        className="btn btn-primary px-4"
                        onClick={handleRequestClick}
                      >
                        <i className="fas fa-calendar-check me-2"></i>Request Match
                      </button>
                    )}
                    {isCreator && (
                      <button 
                        className="btn btn-outline-secondary px-4"
                        onClick={() => {
                          setShowModal(false);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="btn btn-outline-secondary px-4"
                      onClick={() => setShowHistory(!showHistory)}
                    >
                      {showHistory ? "Hide History" : "Show History"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showRequestModal && (
        <RequestPageEditor 
          onClose={() => setShowRequestModal(false)}
          onBack={() => {
            setShowRequestModal(false);
            setShowModal(true);
          }}
        />
      )}

      {showEditModal && (
        <EditMatchModal 
          match={match} 
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedMatch) => {
            // Handle the updated match data if needed
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default MatchDetailsPopup;