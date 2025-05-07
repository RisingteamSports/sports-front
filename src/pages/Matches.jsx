import { useState, useEffect } from "react";
import Navbar from "../components/Header/header";
import axios from "axios";
import "../style/matches.css";
import MatchDetailsPopup from "../components/models/showMatchDetails";

const AllMatches = ({ searchTerm }) => {
  const [matches, setMatches] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    status: "",
    venue: "",
    date: "",
  });
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
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setSearchFilters({
      category: "",
      status: "",
      venue: "",
      date: "",
    });
  };

  const filteredMatches = matches.filter((match) => {
    if (
      searchTerm &&
      !match.user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !match.venue.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !match.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (
      searchFilters.category &&
      !match.category.toLowerCase().includes(searchFilters.category.toLowerCase())
    ) {
      return false;
    }

    if (searchFilters.status && match.match_status !== searchFilters.status) {
      return false;
    }

    if (
      searchFilters.venue &&
      !match.venue.toLowerCase().includes(searchFilters.venue.toLowerCase())
    ) {
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

  const categories = [...new Set(matches.map((match) => match.category))];
  const statuses = [...new Set(matches.map((match) => match.match_status))];

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <div className="container py-3">
        {/* Matches List */}
        <div className="row g-2">
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div className="text-center">
                <div
                  className="spinner-border text-primary"
                  style={{ width: "2rem", height: "2rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading matches...</p>
              </div>
            </div>
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <div
                key={match.id}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
              >
                <div className="card border-0 shadow-sm h-100 hover-shadow transition-all">
                  {/* Card Header */}
                  <div className="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      {match.team_logo ? (
                        <img
                          src={match.team_logo}
                          alt="Team Logo"
                          className="rounded-circle me-2"
                          style={{
                            width: "28px",
                            height: "28px",
                            objectFit: "cover",
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            border: "1px solid #eee",
                          }}
                        >
                          <i className="fas fa-user text-muted small"></i>
                        </div>
                      )}
                      <h4 className="mb-0 fw-bold text-truncate">
                        {match.team_name}
                      </h4>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <h5 className="fw-medium">{match.category}</h5>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body pt-2 pb-1">
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Venue:</span>
                      <span
                        className="fw-medium text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {match.venue}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Bid:</span>
                      <span className="fw-medium">
                        {match.match_bid === "yes"
                          ? `₹${match.custom_bid ?? "0"}`
                          : "None"}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Security:</span>
                      <span className="fw-medium">
                        {match.security == 1
                          ? `₹${match.security_amount ?? "0"}`
                          : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer bg-white d-flex justify-content-between border-0 pt-0">
                    <MatchDetailsPopup
                      match={match}
                      currentUser={currentUser}
                      onRequestClick={() =>
                        handleClick(true, match.id, match.user_id)
                      }
                    >
                      <button className="btn btn-sm btn-outline-primary w-100">
                        {match.match_status === "available" && "Request"}
                        {match.match_status === "pending" &&
                          (match.user_id === currentUser?.id
                            ? "Cancel"
                            : "Pending")}
                        {match.match_status === "booked" && "Details"}
                        {match.match_status === "live" && "Score"}
                      </button>
                    </MatchDetailsPopup>
                    <span
                      className={`badge badge-sm ${
                        match.match_status === "available"
                          ? "bg-success"
                          : match.match_status === "booked"
                          ? "bg-danger"
                          : match.match_status === "live"
                          ? "bg-primary"
                          : "bg-warning"
                      }`}
                    >
                      {match.match_status.charAt(0).toUpperCase() +
                        match.match_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i className="bi bi-exclamation-circle text-muted fs-1"></i>
                <h5 className="mt-2">No matches found</h5>
                <p className="text-muted small">
                  Try adjusting your search or filters
                </p>
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={resetFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`toast show position-fixed bottom-0 end-0 m-3 ${
              toast.type === "error" ? "bg-danger" : "bg-success"
            }`}
            style={{ zIndex: 1100 }}
          >
            <div className="d-flex align-items-center">
              <div className="toast-body text-white">
                <i
                  className={`bi ${
                    toast.type === "error"
                      ? "bi-exclamation-triangle"
                      : "bi-check-circle"
                  } me-2`}
                ></i>
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2"
                onClick={() => setToast({ ...toast, show: false })}
                aria-label="Close"
              ></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllMatches;
