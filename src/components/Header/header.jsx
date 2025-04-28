import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileUpdateModal from "../Edit_profile";
import CreateMatchModal from "../models/createNewMatch";
import Notifications from "../models/NotificationPop";
import AccountSummaryModal from "../models/showalanceDetails";

const Navbar = () => {
  const navigate = useNavigate();
  const [modalView, setModalView] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8LrGjiUDcvYjUMk7jUJJZo0kK4Y4NzKxmQ&s"
  );
  const [showAccountModal, setShowAccountModal] = useState(false);
  const accountStats = {
    matchesWon: 12,
    matchesLost: 5,
    currentBalance: 8500,
    transactionHistory: [
      { id: 1, date: '2024-04-10', type: 'Win', amount: 500 },
      { id: 2, date: '2024-04-08', type: 'Deposit', amount: 3000 },
      { id: 3, date: '2024-04-06', type: 'Loss', amount: -200 },
    ]
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.profile_picture) {
          setProfile(`https://matc.matchdada.com/storage/${parsedUser.profile_picture}`);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [modalView]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setProfile(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8LrGjiUDcvYjUMk7jUJJZo0kK4Y4NzKxmQ&s"
    );
    navigate("/login");
  };

  const handleAccountClick = (e) => {
    e.preventDefault();
    setShowAccountModal(true);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent shadow-sm">
        <div className="container d-flex justify-content-between p-0">
          <Link to="/" className="navbar-brand">
            <h3 className="Logo-text">Match Dada</h3>
          </Link>

          <button
            className="navbar-toggler border"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-2">
                <Link to="/" className="nav-link text-dark">Home</Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="/all-teams" className="nav-link text-dark">All Teams</Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="" className="nav-link text-dark">Shop</Link> {/* ✅ Corrected */}
              </li>
              <li className="nav-item mx-2">
                <Link to="" className="nav-link text-dark" data-bs-toggle={user ? "modal" : ""} data-bs-target={user ? "#createMatchModal" : ""} onClick={(e) => { if (!user) { e.preventDefault(); navigate("/login"); } }}>Match</Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="/contact-us" className="nav-link text-dark">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <div className="me-3 d-flex align-items-center">
                  <Notifications />
                  <button
                    className="border-0 text-center text-decoration-none text-white icon-link position-relative ms-3 mb-2"
                    onClick={() => navigate("/chat")}
                    title="Chat"
                  >
                    <i className="bi bi-chat-dots-fill fs-5"></i>
                  </button>
                </div>
                <div className="dropdown">
                  <button
                    className="text-dark fw-bold dropdown-toggle p-0 border-0 bg-transparent"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src={profile}
                      className="rounded-circle border border-secondary me-2"
                      alt="User Avatar"
                      width="35"
                      height="35"
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end bg-light border border-secondary">
                    <li><button className="dropdown-item text-dark fw-bold" onClick={() => setModalView("profile")}>Profile</button></li>
                    <li><button className="dropdown-item text-dark fw-bold" onClick={handleAccountClick}>My Account</button></li>
                    <li><button className="dropdown-item text-dark fw-bold" onClick={() => setModalView("password")}>Change Password</button></li>
                    <li><Link to="/my-teams" className="dropdown-item text-dark fw-bold">My Team</Link></li>
                    <li><button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>Log Out</button></li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-warning fw-bold px-3">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {modalView && <ProfileUpdateModal view={modalView} onClose={() => setModalView(null)} />}
      <CreateMatchModal />
      <AccountSummaryModal show={showAccountModal} onClose={() => setShowAccountModal(false)} accountStats={accountStats} />
    </>
  );
};

export default Navbar;
