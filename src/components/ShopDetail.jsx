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
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [rating, setRating] = useState(0);

  // Color definitions with names and hex values
  const colors = [
    { name: "Black", hex: "#2c3e50" },
    { name: "White", hex: "#ecf0f1" },
    { name: "Red", hex: "#e74c3c" },
    { name: "Blue", hex: "#3498db" },
    { name: "Green", hex: "#2ecc71" }
  ];

  // Reusable gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    border: 'none',
    color: 'white'
  };

  const gradientHoverStyle = {
    background: 'linear-gradient(135deg, #2980b9, #3498db)',
    boxShadow: '0 6px 12px rgba(52, 152, 219, 0.4)'
  };

  // Custom button component
  const PrimaryButton = ({ children, icon, onClick, fullWidth = false }) => (
    <button 
      className={`btn px-4 py-2 rounded-1 ${fullWidth ? 'w-100' : ''}`}
      style={{
        ...gradientStyle,
        fontWeight: '600',
        boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = gradientHoverStyle.background;
        e.target.style.boxShadow = gradientHoverStyle.boxShadow;
      }}
      onMouseLeave={(e) => {
        e.target.style.background = gradientStyle.background;
        e.target.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.3)';
      }}
      onClick={onClick}
    >
      {icon && <i className={`fas ${icon} me-2`}></i>}
      {children}
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button 
      className="slick-arrow slick-prev btn rounded-circle d-none d-lg-flex" 
      onClick={onClick}
      style={{
        ...gradientStyle,
        left: '-15px',
        zIndex: 1,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}
    >
      <i className="fas fa-chevron-left"></i>
    </button>
    );
  }

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button 
  className="slick-arrow slick-next btn rounded-circle d-none d-lg-flex align-items-center justify-content-center p-0"
  onClick={onClick}
  style={{
    ...gradientStyle,
    right: '-15px',
    zIndex: 1,
    width: '40px',
    height: '40px'
  }}
>
  <i className="fas fa-chevron-right"></i>
</button>
    );
  }

  return (
    <div className="container-fluid pb-5 bg-light">
      <Navbar />
      
      <div className="container py-3 py-md-5">

        <div className="row">
          {/* Product Images */}
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="border rounded-4 p-2 p-md-3 shadow-sm bg-white">
              <Slider {...sliderSettings}>
                {[product1, product2, product3, product4].map((img, index) => (
                  <div key={index}>
                    <img 
                      src={img} 
                      alt={`Product ${index + 1}`} 
                      className="img-fluid w-100 rounded-3" 
                      style={{ 
                        height: 'auto',
                        maxHeight: '500px',
                        objectFit: 'contain',
                        aspectRatio: '1/1'
                      }} 
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-lg-7">
            <div className="ps-lg-4 ps-xl-5">
              <div className="border-0 rounded-4 p-3 p-md-5 shadow-sm bg-white">
                <h2 className="fw-bold mb-2 mb-md-3">Premium Comfort Sneakers</h2>
                
                <div className="d-flex align-items-center mb-2 mb-md-3">
                  <div className="text-warning me-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas ${i < 4 ? 'fa-star' : 'fa-star-half-alt'}`}></i>
                    ))}
                  </div>
                  <small className="text-muted">
                    <span className="fw-semibold text-dark">4.7</span> (99 Reviews)
                  </small>
                </div>
                
                <div className="mb-3 mb-md-4 position-relative">
                  <h3 className="fw-bold mb-1 mb-md-2" style={{ color: '#3498db' }}>$150.00</h3>
                  <del className="text-muted small">$200.00</del>
                  <span className="badge bg-success ms-2 align-middle">25% OFF</span>
                </div>
                
                <p className="mb-3 mb-md-4 text-muted">
                  Experience ultimate comfort with our premium sneakers. Designed with breathable mesh and cushioned soles, 
                  these shoes provide all-day support for your active lifestyle. The perfect blend of style and functionality.
                </p>
                
                {/* Size Selection */}
                <div className="mb-3 mb-md-4">
                  <h6 className="fw-bold mb-2 mb-md-3">SELECT SIZE:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL"].map((size, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm rounded-1 ${selectedSize === size ? '' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          minWidth: '50px',
                          padding: '0.4rem 0',
                          fontWeight: '600',
                          ...(selectedSize === size ? gradientStyle : {}),
                          ...(selectedSize === size ? { boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)' } : {})
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-3 mb-md-4">
                  <h6 className="fw-bold mb-2 mb-md-3">SELECT COLOR:</h6>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    {colors.map((color, index) => (
                      <div 
                        key={index}
                        className="color-option position-relative"
                        onClick={() => setSelectedColor(color.name)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: color.hex,
                          border: selectedColor === color.name ? '3px solid #3498db' : '1px solid #ddd',
                          boxShadow: selectedColor === color.name ? '0 0 0 2px rgba(52, 152, 219, 0.3)' : 'none',
                          cursor: 'pointer'
                        }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <i className="fas fa-check text-white position-absolute top-50 start-50 translate-middle"></i>
                        )}
                      </div>
                    ))}
                    <span className="ms-2 small text-muted">
                      {selectedColor || "Select color"}
                    </span>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4 pt-2">
  <div className="d-flex p-2 quantity me-3 mb-2 mb-md-0" style={{ width: "140px" }}>
    <button 
      className="btn rounded-start border-0"
      onClick={() => setQuantity(q => Math.max(1, q - 1))}
      style={gradientStyle}
    >
      <i className="fas fa-minus"></i>
    </button>
    <input
      type="text"
      className="form-control text-center border-0"
      value={quantity}
      readOnly
      style={{
        fontWeight: '600',
        color: '#2c3e50',
        backgroundColor: '#f8f9fa',
        border: 'none !important'
      }}
    />
    <button 
      className="btn rounded-end border-0"
      onClick={() => setQuantity(q => q + 1)}
      style={gradientStyle}
    >
      <i className="fas fa-plus"></i>
    </button>
  </div>
  {/* Added gap-3 class to create space between buttons */}
  <div className="d-flex gap-3">
    <PrimaryButton icon="fa-shopping-cart" onClick={() => {}}>
      Add To Cart
    </PrimaryButton>
    <PrimaryButton onClick={() => {}}>
      Buy Now
    </PrimaryButton>
  </div>
</div>

                {/* Delivery Info */}
                <div className="alert alert-light border mb-3 mb-md-4" style={{ borderColor: '#3498db' }}>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-truck me-3" style={{ fontSize: '1.5rem', color: '#3498db' }}></i>
                    <div>
                      <h6 className="mb-1 fw-bold">Free Delivery</h6>
                      <p className="mb-0 small text-muted">Estimated delivery: 2-4 business days</p>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="d-flex align-items-center pt-3 border-top">
                  <strong className="text-dark me-3">Share:</strong>
                  <div className="d-flex">
                    {['facebook-f', 'twitter', 'instagram', 'pinterest'].map((social, i) => (
                      <a 
                        key={i} 
                        href="#" 
                        className="btn btn-sm rounded-circle me-2 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '36px', 
                          height: '36px',
                          ...gradientStyle
                        }}
                      >
                        <i className={`fab fa-${social}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="row mt-4 mt-md-5">
          <div className="col-12">
            <div className="border-0 rounded-4 shadow-sm bg-white overflow-hidden">
              <ul className="nav nav-tabs border-bottom" id="productTab" role="tablist">
                {[
                  { id: "tab-pane-1", label: "Description" },
                  { id: "tab-pane-2", label: "Additional Info" },
                  { id: "tab-pane-3", label: "Reviews (99)" }
                ].map((tab) => (
                  <li className="nav-item" role="presentation" key={tab.id}>
                    <button
                      className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        fontWeight: '600',
                        border: 'none',
                        color: activeTab === tab.id ? 'white' : '#7f8c8d',
                        backgroundColor: activeTab === tab.id ? '#3498db' : 'transparent',
                        background: activeTab === tab.id ? 'linear-gradient(135deg, #3498db, #2980b9)' : 'none'
                      }}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="tab-content p-3 p-md-4" id="productTabContent">
                {/* Description Tab */}
                <div className={`tab-pane fade ${activeTab === "tab-pane-1" ? "show active" : ""}`}>
                  <h4 className="mb-3 mb-md-4 fw-bold">Product Description</h4>
                  <p className="text-muted">
                    Our premium comfort sneakers are crafted with the highest quality materials to ensure durability and comfort. 
                    The breathable mesh upper keeps your feet cool while the cushioned insole provides exceptional support for all-day wear.
                  </p>
                  <ul className="list-unstyled text-muted">
                    {[
                      "Breathable mesh upper",
                      "Cushioned insole for all-day comfort",
                      "Flexible rubber outsole for traction",
                      "Lightweight design",
                      "Available in multiple colors"
                    ].map((item, i) => (
                      <li key={i} className="mb-2">
                        <i className="fas fa-check me-2" style={{ color: '#3498db' }}></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info Tab */}
                <div className={`tab-pane fade ${activeTab === "tab-pane-2" ? "show active" : ""}`}>
                  <h4 className="mb-3 mb-md-4 fw-bold">Additional Information</h4>
                  <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <table className="table table-bordered w-100">
                        <thead>
                          <tr style={gradientStyle}>
                            <th colSpan="2" className="text-white">Product Specifications</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Weight", "0.5 kg"],
                            ["Dimensions", "30 × 20 × 10 cm"],
                            ["Materials", "Mesh, Rubber, Foam"]
                          ].map(([label, value], i) => (
                            <tr key={i}>
                              <th className="w-50 bg-light">{label}</th>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-6">
                      <table className="table table-bordered w-100">
                        <thead>
                          <tr style={gradientStyle}>
                            <th colSpan="2" className="text-white">Product Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Color", "Black, White, Red, Blue, Green"],
                            ["Size", "XS, S, M, L, XL"],
                            ["SKU", "SNK-2023-001"]
                          ].map(([label, value], i) => (
                            <tr key={i}>
                              <th className="w-50 bg-light">{label}</th>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Reviews Tab */}
                <div className={`tab-pane fade ${activeTab === "tab-pane-3" ? "show active" : ""}`}>
                  <div className="row">
                    <div className="col-md-6 mb-4 mb-md-0">
                      <h4 className="mb-3 mb-md-4 fw-bold">Customer Reviews</h4>
                      
                      {[
                        {
                          img: product1,
                          name: "John Doe",
                          date: "January 15, 2023",
                          rating: 4,
                          review: "These shoes are incredibly comfortable! I've been wearing them daily for a month and they still look and feel great."
                        },
                        {
                          img: product2,
                          name: "Jane Smith",
                          date: "March 2, 2023",
                          rating: 5,
                          review: "Perfect fit and very stylish. I get compliments every time I wear them. Highly recommend!"
                        }
                      ].map((review, i) => (
                        <div key={i} className="mb-4 pb-4 border-bottom">
                          <div className="d-flex align-items-center mb-3">
                            <div className="me-3">
                              <img 
                                src={review.img} 
                                alt="User" 
                                className="rounded-circle" 
                                style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                              />
                            </div>
                            <div>
                              <h6 className="mb-0">{review.name}</h6>
                              <small className="text-muted">{review.date}</small>
                            </div>
                          </div>
                          <div className="text-warning mb-2">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas ${i < review.rating ? 'fa-star' : 'fa-star-half-alt'}`}></i>
                            ))}
                          </div>
                          <p className="text-muted">{review.review}</p>
                        </div>
                      ))}
                    </div>

                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm rounded-3 h-100">
                        <div className="card-body p-3 p-md-4">
                          <h4 className="fw-bold mb-3 mb-md-4">Leave a Review</h4>
                          <p className="text-muted small mb-3 mb-md-4">
                            Your email address will not be published. Required fields are marked *
                          </p>
                          
                          <form>
                            <div className="mb-3 mb-md-4">
                              <label className="form-label fw-semibold">Your Rating *</label>
                              <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <React.Fragment key={star}>
                                    <input 
                                      type="radio" 
                                      id={`star-${star}`} 
                                      name="rating" 
                                      value={star} 
                                      className="d-none"
                                      onChange={() => setRating(star)}
                                    />
                                    <label 
                                      htmlFor={`star-${star}`} 
                                      className="star-label"
                                      style={{ color: rating >= star ? '#3498db' : '#e4e5e9' }}
                                    >
                                      <i className="fas fa-star"></i>
                                    </label>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-3 mb-md-4">
                              <label htmlFor="review" className="form-label fw-semibold">Your Review *</label>
                              <textarea 
                                id="review" 
                                rows="5" 
                                className="form-control" 
                                placeholder="Share your experience with this product..."
                                style={{ borderColor: '#3498db' }}
                              ></textarea>
                            </div>
                            
                            <div className="row g-3 mb-3 mb-md-4">
                              <div className="col-md-6">
                                <label htmlFor="name" className="form-label fw-semibold">Name *</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  id="name" 
                                  required 
                                  style={{ borderColor: '#3498db' }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="email" className="form-label fw-semibold">Email *</label>
                                <input 
                                  type="email" 
                                  className="form-control" 
                                  id="email" 
                                  required 
                                  style={{ borderColor: '#3498db' }}
                                />
                              </div>
                            </div>
                            
                            <PrimaryButton fullWidth onClick={() => {}}>
                              Submit Review
                            </PrimaryButton>
                          </form>
                        </div>
                      </div>
                    </div>
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