import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileUpdateModal from "../Edit_profile";
import CreateMatchModal from "../models/createNewMatch";
import AccountSummaryModal from "../models/showalanceDetails";

const Navbar = () => {
  const navigate = useNavigate();
  const [modalView, setModalView] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8LrGjiUDcvYjUMk7jUJJZo0kK4Y4NzKxmQ&s"
  );
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid px-3">
          <Link to="/" className="navbar-brand">
            <h3 className="Logo-text m-0">Match Dada</h3>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse " id="navbarNav">
            <ul className="navbar-nav mx-auto " style={{ maxWidth: "600px", width: "100%" }}>
              <li className="nav-item px-2">
                <Link to="/" className="nav-link text-dark">Home</Link>
              </li>
              <li className="nav-item px-2">
                <Link to="/all-teams" className="nav-link text-dark">All Teams</Link>
              </li>
              <li className="nav-item px-2">
                <Link to="/shop" className="nav-link text-dark">Shop</Link>
              </li>
              <li className="nav-item px-2">
                <Link to="" className="nav-link text-dark" data-bs-toggle={user ? "modal" : ""} data-bs-target={user ? "#createMatchModal" : ""} onClick={(e) => { if (!user) { e.preventDefault(); navigate("/login"); } }}>Match</Link>
              </li>
              <li className="nav-item px-2">
                <Link to="/contact-us" className="nav-link text-dark">Contact Us</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center ms-lg-3">
              {user ? (
                <>
                  <div className="d-flex align-items-center">
                    {/* Search Box - Appears below navbar when toggled */}
<div className="container-fluid">
  <form 
    className="d-flex" 
    onSubmit={handleSearchSubmit}
    style={{
      border: '1px solid #ced4da', // Outer border
    }}
  >
    <input
      type="text"
      className="form-control border-0 py-2"
      placeholder="Search matches, teams..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      autoFocus
      style={{
        boxShadow: 'none', // Remove any shadow
      }}
    />
    <button 
      className="btn border-0 rounded-0" 
      type="submit"
      style={{
        backgroundColor: 'black',
        borderLeft: '1px solid #ced4da', // Divider line
        width: '40px', // Fixed width
      }}
    >
      <i className="bi bi-search"></i>
    </button>
  </form>
</div>
                    
                    <span
        className="text-center text-decoration-none text-white icon-link position-relative"
        onClick={() => navigate("/notifications")}
      >
        <i className="fa fa-bell fs-4 mt-1"></i>
      </span>
                    
                    <span
                      className=" btn-link text-dark p-1 ms-1 "
                      onClick={() => navigate("/chat")}
                      title="Chat"
                    >
                      <i className="bi bi-chat-dots-fill fs-5"></i>
                    </span>
                  </div>
                  
                  <div className="dropdown ms-2">
                    <span
                      className=" btn-link text-dark dropdown-toggle p-0 d-flex align-items-center"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                    >
                      <img
                        src={profile}
                        className="rounded-circle border border-secondary me-2"
                        alt="User Avatar"
                        width="36"
                        height="36"
                        style={{ objectFit: "cover" }}
                      />
                    </span>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><button className="dropdown-item" onClick={() => setModalView("profile")}>Profile</button></li>
                      <li><button className="dropdown-item" onClick={handleAccountClick}>My Account</button></li>
                      <li><button className="dropdown-item" onClick={() => setModalView("password")}>Change Password</button></li>
                      <li><Link to="/my-teams" className="dropdown-item">My Team</Link></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Log Out</button></li>
                    </ul>
                  </div>
                </>
              ) : (
                <Link to="/login" className="btn btn-warning fw-bold px-3">Login</Link>
              )}
            </div>
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