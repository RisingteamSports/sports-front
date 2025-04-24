import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MatchDetailsPopup = ({ match }) => {
    const [showModal, setShowModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
const [showFullHistory, setShowFullHistory] = useState(false);


    // Enhanced dummy data structure
    const dummyData = {
        team_members: [
            { name: "Ali Khan", role: "Batsman", isCaptain: true },
            { name: "Babar Azam", role: "Batsman" },
            { name: "Shaheen Afridi", role: "Bowler" },
            { name: "Shadab Khan", role: "All-rounder" },
        ],
        facilities: {
            parking: "Available on-site",
            dressing: "Changing rooms available",
            equipment: "Bats, balls provided"
        },
        rules: [
            "Standard T20 rules apply",
            "Helmets mandatory for batsmen",
            "No saliva on ball"
        ],
        organizer: {
            name: "Karachi Sports Club",
            contact: "+92 300 1234567",
            email: "contact@karachisports.com"
        },
        weather: {
            temp: "28°C",
            condition: "Sunny",
            humidity: "65%"
        },
        requirements: {
            dress: "White sports attire",
            equipment: "Bring own gloves"
        },
        match_history: {
            teamA: match.team_name || "Team A",
            teamB: match.opponent_team || "Team B",
            bid: match.match_bid || "0",
            security: match.security_amount || "0",
            overs: match.overs || "20",
            venue: match.venue || "Not set",
            scoreA: "145/6",
            scoreB: "142/8",
            winner: "Team A"
        }
    };

    const handleOpen = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    return (
        <>
            <a 
                href="#"
                onClick={handleOpen} 
                className="border-0 text-decoration-none small"
            >
                Match Details
            </a>

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Match Details</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleClose}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    {/* Team Section */}
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <h5 className="mb-3">Team Squad</h5>
                                            <div className="row g-3">
                                                {dummyData.team_members.map((member, index) => (
                                                    <div className="col-md-6" key={index}>
                                                        <div className="d-flex align-items-center p-2 bg-light rounded">
                                                            <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                                                {member.name.split(' ').map(n => n[0]).join('')}
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

                                    {/* Match Info Grid */}
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
                                                        <dd className="col-6">{new Date(match.match_datetime).toLocaleDateString()}</dd>
                                                        
                                                        <dt className="col-6">Time:</dt>
                                                        <dd className="col-6">{new Date(match.match_datetime).toLocaleTimeString()}</dd>
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
                                                        <dd className="col-6">Leather</dd>
                                                        
                                                        <dt className="col-6">Security:</dt>
                                                        <dd className="col-6">Rs. {match.security_amount || "None"}</dd>
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
                                                        {dummyData.rules.map((rule, index) => (
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
                                                            {dummyData.requirements.dress}
                                                        </li>
                                                        <li className="d-flex mb-2">
                                                            <i className="fas fa-baseball-ball text-primary me-2 mt-1"></i>
                                                            {dummyData.requirements.equipment}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                   {/* Match History Section */}
{showFullHistory && (
    <div className="row g-4 mb-4 mt-2">
        <div className="col-12">
            <div className="card">
                <div className="card-header bg-light">
                    <i className="fas fa-history me-2"></i>
                    Match History
                </div>
                <div className="card-body">
                    <dl className="row mb-0">
                        <dt className="col-sm-4">Teams:</dt>
                        <dd className="col-sm-8">
                            {dummyData.match_history.teamA} <b>vs</b> {dummyData.match_history.teamB}
                        </dd>
                        <dt className="col-sm-4">Scores:</dt>
                        <dd className="col-sm-8">
                            {dummyData.match_history.teamA}: {dummyData.match_history.scoreA}, {dummyData.match_history.teamB}: {dummyData.match_history.scoreB}
                        </dd>
                        <dt className="col-sm-4">Bid:</dt>
                        <dd className="col-sm-8">Rs. {dummyData.match_history.bid}</dd>
                        <dt className="col-sm-4">Security:</dt>
                        <dd className="col-sm-8">Rs. {dummyData.match_history.security}</dd>
                        <dt className="col-sm-4">Overs:</dt>
                        <dd className="col-sm-8">{dummyData.match_history.overs}</dd>
                        <dt className="col-sm-4">Venue:</dt>
                        <dd className="col-sm-8">{dummyData.match_history.venue}</dd>
                        <dt className="col-sm-4">Winner:</dt>
                        <dd className="col-sm-8">
                            <span className="badge bg-success">{dummyData.match_history.winner}</span>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
)}

{/* Mini History Cards */}
{showHistory && !showFullHistory && (
    <div className="row g-3 mt-4">
        {[1, 2, 3].map((_, idx) => (
            <div className="col-12" key={idx}>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <div>
                                <h6 className="mb-1">{dummyData.match_history.teamA} <b>vs</b> {dummyData.match_history.teamB}</h6>
                                <small className="text-muted">
                                    Date: {new Date().toLocaleDateString()}
                                </small>
                            </div>
                            <div className="text-end">
                                <span className={`badge ${idx % 2 === 0 ? 'bg-success' : 'bg-danger'}`}>
                                    {idx % 2 === 0 ? "Win" : "Loss"}
                                </span>
                            </div>
                        </div>
                        <div className="text-end mt-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowFullHistory(true)}>
                                Show More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)}

                                  {/* Action Buttons */}
<div className="d-flex justify-content-center gap-3 mt-4">
    <button className="btn btn-primary px-4">
        <i className="fas fa-calendar-check me-2"></i>Request Match
    </button>
    <button className="btn btn-outline-secondary px-4">
        Edit
    </button>
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
        </>
    );
};

export default MatchDetailsPopup;