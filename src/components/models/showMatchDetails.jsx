import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MatchDetailsPopup = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpen = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    return (
        <>
            {/* Trigger Button */}
            <a href="#" onClick={handleOpen}>
                Match Details
            </a>

            {/* Modal */}
            {showModal && (
                <div className="custom-modal-overlay" onClick={handleClose}>
                    <div
                        className="card modal-dialog modal-md"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Match Details</h5>
                                <button
                                    type="button"
                                    className="btn-close text-danger"
                                    aria-label="Close"
                                    onClick={handleClose}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Match Card */}
                                <div className="container match-card">
                                    {/* Team Squad */}
                                    <div className="mb-4">
                                        <h4 className="mb-3">Team Squad</h4>
                                        <div className="row g-3">
                                            {[
                                                { initials: "AK", name: "Ali Khan", role: "Batsman", captain: true },
                                                { initials: "MR", name: "Mohammad Rizwan", role: "Wicket Keeper" },
                                                { initials: "BA", name: "Babar Azam", role: "Batsman" },
                                                { initials: "SA", name: "Shaheen Afridi", role: "Bowler" },
                                                { initials: "SK", name: "Shadab Khan", role: "All Rounder" },
                                            ].map((player, index) => (
                                                <div className="col-md-4 d-flex align-items-center" key={index}>
                                                    <div className="player-avatar me-3">{player.initials}</div>
                                                    <div>
                                                        <div className="fw-bold">
                                                            {player.name}
                                                            {player.captain && (
                                                                <span className="captain-badge">Captain</span>
                                                            )}
                                                        </div>
                                                        <small className="text-muted">{player.role}</small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <hr className="hr-divider" />

                                    {/* Match Details */}
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h4 className="mb-3">
                                                Thunder Strikers{" "}
                                                <span className="match-status">AVAILABLE</span>
                                            </h4>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">
                                                    <strong>Category:</strong> Cricket
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Date & Time:</strong> June 15, 2023 at 2:00 PM
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Venue:</strong> National Stadium, Karachi
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Overs:</strong> 20
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul className="list-group list-group-flush mt-4 mt-md-0">
                                                <li className="list-group-item">
                                                    <strong>Ball Type:</strong> Tape Ball
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Security:</strong> Rs. 2000
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Match Bid:</strong> Rs. 500
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Join Code:</strong> THUNDER2023
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-primary">Join Match</button>
                                        <button className="btn btn-outline-secondary">Contact Organizer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles */}
            <style>{`
                .custom-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 15%;
                    margin:auto;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1040;
                }
                .custom-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1050;
                    width: 100%;
                    max-width: 900px;
                }
                .modal-header {
                    background-color: #f8f9fa; /* Light gray background */
                    border-bottom: 1px solid #dee2e6;
                    border-top-left-radius: 0.3rem;
                    border-top-right-radius: 0.3rem;
                }
                .modal-content {
                    border-radius: 0.5rem;
                    overflow: hidden;
                }
                .match-card {
                    background: white;
                    border-radius: 10px;
                    padding: 25px;
                }
                .player-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .captain-badge {
                    background: #f39c12;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 12px;
                    margin-left: 5px;
                }
                .hr-divider {
                    border-top: 2px solid #dee2e6;
                    margin: 30px 0;
                }
                .match-status {
                    background: #2ecc71;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: bold;
                }
            `}</style>
        </>
    );
};

export default MatchDetailsPopup;
