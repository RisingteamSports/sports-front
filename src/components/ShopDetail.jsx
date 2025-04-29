import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import product1 from "../assets/images/product-1.jpg";
import product2 from "../assets/images/product-2.jpg";
import product3 from "../assets/images/product-3.jpg";
import product4 from "../assets/images/product-4.jpg";
import Navbar from "./Header/header";

const ShopDetail = () => {
  const [activeTab, setActiveTab] = useState("tab-pane-1");
  const [quantity, setQuantity] = useState(1);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />
  };

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button 
        className="slick-arrow slick-prev" 
        onClick={onClick}
        style={{
          left: '10px',
          zIndex: 1,
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          color: '#000'
        }}
      >
        <i className="fa fa-angle-left"></i>
      </button>
    );
  }

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button 
        className="slick-arrow slick-next" 
        onClick={onClick}
        style={{
          right: '10px',
          zIndex: 1,
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          color: '#000'
        }}
      >
        <i className="fa fa-angle-right"></i>
      </button>
    );
  }

  return (
    <div className="container-fluid pb-5">
    <Navbar />
      <div className="row px-xl-5">
        <div className="col-lg-5 mb-30">
          <div className="bg-light" style={{ padding: '30px' }}>
            <Slider {...sliderSettings}>
              <div>
                <img src={product1} alt="Product" className="w-100" style={{ height: '400px', objectFit: 'contain' }} />
              </div>
              <div>
                <img src={product2} alt="Product" className="w-100" style={{ height: '400px', objectFit: 'contain' }} />
              </div>
              <div>
                <img src={product3} alt="Product" className="w-100" style={{ height: '400px', objectFit: 'contain' }} />
              </div>
              <div>
                <img src={product4} alt="Product" className="w-100" style={{ height: '400px', objectFit: 'contain' }} />
              </div>
            </Slider>
          </div>
        </div>

        {/* Rest of your existing product details code remains exactly the same */}
        <div className="col-lg-7 h-auto mb-30">
          <div className="h-100 bg-light p-30">
            <h3>Product Name Goes Here</h3>
            <div className="d-flex mb-3">
              <div className="text-primary mr-2">
                <small className="fas fa-star"></small>
                <small className="fas fa-star"></small>
                <small className="fas fa-star"></small>
                <small className="fas fa-star-half-alt"></small>
                <small className="far fa-star"></small>
              </div>
              <small className="pt-1">(99 Reviews)</small>
            </div>
            <h3 className="font-weight-semi-bold mb-4">$150.00</h3>
            <p className="mb-4">
              Volup erat ipsum diam elitr rebum et dolor. Est nonumy elitr erat diam stet sit clita ea. Sanc ipsum
              et, labore clita lorem magna duo dolor no sea Nonumy
            </p>
            <div className="d-flex mb-3">
              <strong className="text-dark mr-3">Sizes:</strong>
              <form>
                {["XS", "S", "M", "L", "XL"].map((size, index) => (
                  <div key={index} className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id={`size-${index + 1}`}
                      name="size"
                    />
                    <label className="custom-control-label" htmlFor={`size-${index + 1}`}>
                      {size}
                    </label>
                  </div>
                ))}
              </form>
            </div>

            <div className="d-flex mb-4">
              <strong className="text-dark mr-3">Colors:</strong>
              <form>
                {["Black", "White", "Red", "Blue", "Green"].map((color, index) => (
                  <div key={index} className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id={`color-${index + 1}`}
                      name="color"
                    />
                    <label className="custom-control-label" htmlFor={`color-${index + 1}`}>
                      {color}
                    </label>
                  </div>
                ))}
              </form>
            </div>

            <div className="d-flex align-items-center mb-4 pt-2">
              <div className="input-group quantity mr-3" style={{ width: "130px" }}>
                <div className="input-group-btn">
                  <button 
                    className="btn btn-primary btn-minus" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control bg-secondary border-0 text-center"
                  value={quantity}
                  readOnly
                />
                <div className="input-group-btn">
                  <button 
                    className="btn btn-primary btn-plus" 
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </div>
              <button className="btn btn-primary px-3">
                <i className="fa fa-shopping-cart mr-1"></i> Add To Cart
              </button>
            </div>

            <div className="d-flex pt-2">
              <strong className="text-dark mr-2">Share on:</strong>
              <div className="d-inline-flex">
                <a className="text-dark px-2" href="">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="text-dark px-2" href="">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="text-dark px-2" href="">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a className="text-dark px-2" href="">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs section - remains exactly the same as before */}
      <div className="row px-xl-5">
        <div className="col">
          <div className="bg-light p-30">
            <div className="nav nav-tabs mb-4">
              <a 
                className={`nav-item nav-link text-dark ${activeTab === "tab-pane-1" ? "active" : ""}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("tab-pane-1");
                }}
                href="#tab-pane-1"
              >
                Description
              </a>
              <a 
                className={`nav-item nav-link text-dark ${activeTab === "tab-pane-2" ? "active" : ""}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("tab-pane-2");
                }}
                href="#tab-pane-2"
              >
                Information
              </a>
              <a 
                className={`nav-item nav-link text-dark ${activeTab === "tab-pane-3" ? "active" : ""}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("tab-pane-3");
                }}
                href="#tab-pane-3"
              >
                Reviews (0)
              </a>
            </div>

            <div className="tab-content">
              <div className={`tab-pane fade ${activeTab === "tab-pane-1" ? "show active" : ""}`} id="tab-pane-1">
                <h4 className="mb-3">Product Description</h4>
                <p>Product detailed description goes here...</p>
                <p>Additional description paragraph...</p>
              </div>

              <div className={`tab-pane fade ${activeTab === "tab-pane-2" ? "show active" : ""}`} id="tab-pane-2">
                <h4 className="mb-3">Additional Information</h4>
                <p>Additional product info...</p>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0">Point 1</li>
                      <li className="list-group-item px-0">Point 2</li>
                      <li className="list-group-item px-0">Point 3</li>
                      <li className="list-group-item px-0">Point 4</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0">Point 5</li>
                      <li className="list-group-item px-0">Point 6</li>
                      <li className="list-group-item px-0">Point 7</li>
                      <li className="list-group-item px-0">Point 8</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`tab-pane fade ${activeTab === "tab-pane-3" ? "show active" : ""}`} id="tab-pane-3">
                <div className="row">
                  <div className="col-md-6">
                    <h4 className="mb-4">1 review for "Product Name"</h4>
                    <div className="media mb-4">
                      <img
                        src="./assets/images/product-1.jpg"
                        alt="User"
                        className="img-fluid mr-3 mt-1"
                        style={{ width: "45px" }}
                      />
                      <div className="media-body">
                        <h6>
                          John Doe <small> - <i>01 Jan 2045</i></small>
                        </h6>
                        <div className="text-primary mb-2">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star-half-alt"></i>
                          <i className="far fa-star"></i>
                        </div>
                        <p>Review content here...</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h4 className="mb-4">Leave a review</h4>
                    <small>Your email address will not be published. Required fields are marked *</small>
                    <div className="d-flex my-3">
                      <p className="mb-0 mr-2">Your Rating * :</p>
                      <div className="text-primary">
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                    </div>

                    <form>
                      <div className="form-group">
                        <label htmlFor="message">Your Review *</label>
                        <textarea id="message" cols="30" rows="5" className="form-control"></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="name">Your Name *</label>
                        <input type="text" className="form-control" id="name" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Your Email *</label>
                        <input type="email" className="form-control" id="email" />
                      </div>
                      <div className="form-group mb-0">
                        <input type="submit" value="Leave Your Review" className="btn btn-primary px-3" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;