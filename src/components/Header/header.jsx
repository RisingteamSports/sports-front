import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileUpdateModal from "../Edit_profile";
import CreateMatchModal from "../models/createNewMatch";
import logo from "../../assets/images/logo512.png";
import Notifications from "../models/NotificationPop";

const Navbar = () => {
  const navigate = useNavigate();
  const [modalView, setModalView] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8LrGjiUDcvYjUMk7jUJJZo0kK4Y4NzKxmQ&s"
  );

  // Fetch user from localStorage
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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setProfile(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8LrGjiUDcvYjUMk7jUJJZo0kK4Y4NzKxmQ&s"
    );
    navigate("/login");
  };

  return (
    <>
      

      <nav className="navbar navbar-expand-lg navbar-light bg-transparent shadow-sm py-2">
        <div className="container d-flex justify-content-between">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="MatchDada" width="100" />
          </Link>

          {/* Navbar Toggle for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
  <ul className="navbar-nav ms-auto me-"> {/* Add me-5 here */}
    <li className="nav-item mx-2">
      <Link to="/" className="nav-link text-dark">Home</Link>
    </li>
    <li className="nav-item mx-2">
      <Link to="/all-teams" className="nav-link text-dark">All Teams</Link>
    </li>
    <li className="nav-item mx-2">
      <Link to="" className="nav-link text-dark" data-bs-toggle={user ? "modal" : ""} data-bs-target={user ? "#createMatchModal" : ""} onClick={(e) => { if (!user) {  e.preventDefault(); navigate("/login");   }
        }}>  Match </Link>
    </li>
    <li className="nav-item mx-2">
      <Link to="/contact-us" className="nav-link text-dark">Contact Us</Link>
    </li>
  </ul>
</div>


          {/* Profile & Notifications */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                {/* Notifications */}
                <div className="me-3">
                  <Notifications />
                </div>

                {/* Profile Dropdown */}
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
                    <li>
                      <button className="dropdown-item text-dark fw-bold" onClick={() => setModalView("profile")}>
                        Profile
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-dark fw-bold" onClick={() => setModalView("password")}>
                        Change Password
                      </button>
                    </li>
                    <li>
                      <Link to="/my-teams" className="dropdown-item text-dark fw-bold">My Team</Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-warning fw-bold px-3">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Update Modal */}
      {modalView && <ProfileUpdateModal view={modalView} onClose={() => setModalView(null)} />}

      {/* Create Match Modal */}
      <CreateMatchModal />
    </>
  );
};

export default Navbar;
