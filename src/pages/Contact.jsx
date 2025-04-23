import React, { useState } from "react";
import "../style/contactUs.css"; // Import the CSS file
import axios from "axios";
import Navbar from "../components/Header/header";
const API_URL = "https://matc.matchdada.com/public/api";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleContact = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/contact`,
        formData, // Sending form data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data)
      
      // Clear form fields after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-fluid">
  <Navbar />
  <section className="contact_us py-5">
    <div className="container-fluid px-md-5"> {/* wider container */}
      <div className="row justify-content-center">
        <div className="col-md-10"> {/* changed from col-md-10 */}
          <div className="contact_inner">
            <div className="row">

              {/* Contact Form */}
              <div className="col-md-6">
                <div className="contact_form_inner h-100">
                  <div className="contact_field">
                    <h3>Contact Us</h3>
                    <p>Feel free to contact us any time. We will get back to you as soon as we can!</p>

                    <input
                      type="text"
                      name="name"
                      className="form-control form-group"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    <input
                      type="email"
                      name="email"
                      className="form-control form-group"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-group"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                    <textarea
                      name="message"
                      className="form-control form-group"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>

                    <button className="btn mt-2 h-button" onClick={handleContact}>Send</button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="col-md-6">
                <div className="contact_info_sec p-3 bg-dark rounded shadow h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h4>Contact Info</h4>
                    <div className="d-flex info_single align-items-center fs-5 mb-3">
                      <i className="fas fa-headset me-2"></i>
                      <span >+91 8009 054294</span>
                    </div>
                    <div className="d-flex info_single align-items-center fs-5 mb-3">
                      <i className="fas fa-envelope-open-text me-2"></i>
                      <span>info@flightmantra.com</span>
                    </div>
                    <div className="d-flex info_single align-items-start fs-5 mb-3">
                      <i className="fas fa-map-marked-alt me-2"></i>
                      <span>1000+ Travel partners and 65+ Service city across India, USA, Canada & UAE</span>
                    </div>
                  </div>

                  {/* Social Icons */}
                  {/* <div className="d-flex gap-3 fs-4 mt-4">
                    <a href="#"><i className="fab fa-facebook-square"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div> */}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

  );
};

export default ContactUs;
