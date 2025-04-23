import { useState, useEffect } from "react";
import VerticleNav from "../components/verticleNav";
import Navbar from "../components/Header/header";
import axios from "axios";
import "../style/matches.css";
import MatchDetailsPopup from '../components/models/showMatchDetails';

const AllMatches = () => {
  const [matches, setMatches] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    status: "",
    venue: "",
    date: "",
  });
console.log(currentUser);
  const API_URL = "https://matc.matchdada.com/public/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${API_URL}/matches`);
        
        if (response.data.success) {
          setMatches(response.data.data);
        } else {
          throw new Error("Failed to fetch matches");
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        setToast({
          show: true,
          message: "Failed to load matches. Please try again later.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMatches();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setSearchFilters({
      category: "",
      status: "",
      venue: "",
      date: "",
    });
    setSearchTerm("");
  };

  const filteredMatches = matches.filter(match => {
    if (searchTerm && 
        !match.user.username.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !match.venue.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !match.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (searchFilters.category && 
        !match.category.toLowerCase().includes(searchFilters.category.toLowerCase())) {
      return false;
    }
    
    if (searchFilters.status && match.match_status !== searchFilters.status) {
      return false;
    }
    
    if (searchFilters.venue && 
        !match.venue.toLowerCase().includes(searchFilters.venue.toLowerCase())) {
      return false;
    }
    
    if (searchFilters.date && !match.match_datetime.includes(searchFilters.date)) {
      return false;
    }
    
    return true;
  });

  const handleClick = (status, matchId, userId) => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      console.error("Authentication data missing");
      setToast({
        show: true,
        message: "Please log in to perform this action.",
        type: "error",
      });
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const senderId = parsedUser.id;

    const notificationData = {
      user_id: userId,
      match_id: matchId,
      notification: status,
      sender_id: senderId,
    };

    axios
      .post(`${API_URL}/push-notification`, notificationData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setToast({
          show: true,
          message: "Notification updated successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error updating notification:", error);
        setToast({
          show: true,
          message: "Failed to update notification. Try again.",
          type: "error",
        });
      });
  };

  const categories = [...new Set(matches.map(match => match.category))];
  const statuses = [...new Set(matches.map(match => match.match_status))];

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <div className="container">
        <div className="row">
          <div className="col-12 m-0">
            {/* Search and Filter Section */}
            <div className="p-0">
              <div className="row px-2">
                <div className="col-md-12">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search matches by any field..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline-danger"
                      onClick={resetFilters}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Matches List */}
            <div className="container m-auto">
              <div className="row">
                <div className="col-12">
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                      <div className="text-center">
                        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 fs-5">Loading matches...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="row p-2 cards-container">
                      {filteredMatches.length > 0 ? (
                        filteredMatches.map((match) => (
                          <div key={match.id} className="col-lg-4 col-md-6 col-12 mb-3 p-1">
                            <div className="card bg-white text-black p-2 text-center shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-1">
  <div className="d-flex align-items-center">
    {match.team_logo ? (
      <img 
        src={match.team_logo} 
        alt="Team Logo" 
        className="rounded-circle me-2" 
        style={{ width: "35px", height: "35px", objectFit: "cover", border: "1px solid #ccc" }}
      />
    ) : (
      <div 
        className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
        style={{ width: "35px", height: "35px", border: "1px solid #ccc" }}
      >
        <i className="fas fa-user text-secondary"></i>
      </div>
    )}
    <h5 className="mb-0 fw-bold">{match.team_name}</h5>
  </div>
  <p className="text-muted small mb-0">{match.category}</p>
</div>


                              <div className="row align-items-center">
                                <div className="col-4 text-center">
                                  <p className="mb-0 text-danger fw-bold">
                                    <span className="text-muted small">
                                      <MatchDetailsPopup match={match} />
                                    </span>
                                  </p>
                                </div>
                                <div className="col-4 text-right">
                                  <span className={`badge small ${
                                    match.match_status === "available" ? "bg-success text-white" :
                                      match.match_status === "booked" ? "bg-danger text-white" :
                                        match.match_status === "live" ? "bg-danger text-white" :
                                          "bg-warning text-white"}`}>
                                    {match.match_status === "available" ? "Available" :
                                      match.match_status === "booked" ? "Booked" :
                                        match.match_status === "live" ? "Live" :
                                          "Pending"}
                                  </span>
                                </div>
                                <div className="col-4 text-center d-flex flex-column align-items-center justify-content-center mt-3">
                                  <p className="mb-0 text-danger fw-bold d-flex align-items-center ">
                                    Bid <br />
                                    <span className="text-muted small mx-1">{match.match_bid}</span>
                                  </p>
                                  <p className="mb-0 text-danger fw-bold d-flex align-items-center">
                                    Security <br />
                                    <span className="text-muted small mx-1">{match.security === "1" ? `${match.security_amount ?? "0"}` : "No"}</span>
                                  </p>
                                </div>

                                <div className="col-12 text-center">
                                  <p className="mb-0 text-danger fw-bold d-flex justify-content-center">
                                    Venue:
                                    <span className="text-muted mx-1 small">{match.venue}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="card-footer bg-light mt-1">
                                {match.match_status === "available" && (
                                  <a
                                    href="#"
                                    className="btn btn-request w-100  text-decoration-none"
                                    onClick={() => handleClick(true, match.id, match.user_id)}
                                  >
                                    Request
                                  </a>
                                )}

                                {match.match_status === "pending" &&
                                  (match.user_id === currentUser?.id ? (
                                    <span
                                      className="btn btn-danger w-100 text-decoration-none"
                                      onClick={() => handleClick(false, match.id, match.user_id)}
                                    >
                                      Cancel
                                    </span>
                                  ) : (
                                    <a
                                      href="#"
                                      className="btn btn-warning w-100 text-decoration-none"
                                      onClick={() => handleClick(false, match.id, match.user_id)}
                                    >
                                      Cancel
                                    </a>
                                  ))}

                                {match.match_status === "booked" && (
                                  <a href="#" className="btn btn-danger w-100 text-decoration-none">
                                    Details
                                  </a>
                                )}

                                {match.match_status === "live" && (
                                  <a href="/scoreboard" className="btn btn-score w-100 text-decoration-none">
                                    Score
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h4>No matches found matching your criteria</h4>
                          <button 
                            className="btn btn-primary mt-3"
                            onClick={resetFilters}
                          >
                            Clear Filters
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast show position-fixed top-0 end-0 m-3 ${toast.type === "error" ? "bg-danger" : "bg-success"}`} style={{ zIndex: 1100 }}>
          <div className="toast-body text-white d-flex justify-content-between align-items-center">
            {toast.message}
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => setToast({...toast, show: false})}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default AllMatches;