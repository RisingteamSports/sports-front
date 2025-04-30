import React from 'react';
import { Link } from 'react-router-dom';
import product1 from '../assets/images/product-1.jpg';
import product2 from '../assets/images/product-2.jpg';
import product3 from '../assets/images/product-3.jpg';
import product4 from '../assets/images/product-4.jpg';
import product5 from '../assets/images/product-5.jpg';
import product6 from '../assets/images/product-6.jpg';
import product7 from '../assets/images/product-7.jpg';
import product8 from '../assets/images/product-8.jpg';
import product9 from '../assets/images/product-9.jpg';
import Navbar from '../components/Header/header';
import "../style/shop.css";

const Shop = () => {
  const productImages = [product1, product2, product3, product4, product5, product6, product7, product8, product9];
  
  // Sample product data
  const products = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => ({
    id: item,
    name: `Product ${item}`,
    price: 99 + (item * 10),
    rating: 4,
    reviews: 123,
    image: productImages[item - 1]
  }));

  return (
    <div className="container-fluid shop-container">
      <Navbar />
      
      {/* Search Bar */}
<div className="row justify-content-center mb-4 py-3" style={{ backgroundColor: '#f8f9fa' }}>
  <div className="col-md-8 col-10">
    <div className="d-flex align-items-center">
      <div className="input-group border flex-grow-1">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search products..." 
          aria-label="Search products"
          style={{ borderRight: 'none', borderRadius: '0.25rem 0 0 0.25rem' }}
        />
        <button 
          className="btn btn-primary" 
          type="button"
          style={{
            background: 'linear-gradient(135deg, #3498db, #2980b9)',
            border: 'none',
            borderRadius: '0 0.25rem 0.25rem 0'
          }}
        >
          <i className="fas fa-search"></i> Search
        </button>
      </div>
      
      {/* Icons Box */}
      <div className="ms-2 pb-3 d-flex" style={{ height: 'calc(1.5em + 0.75rem + 40px)' }}>
        <div className="h-100 d-flex align-items-center" style={{ 
          backgroundColor: '#f8f9fa', 
          borderRadius: '0.25rem',
          padding: '0 0.5rem',
          border: '1px solid #ced4da'
        }}>
          <button className=" p-0 border-0 " title="Wishlist">
            <i className="far fa-heart fs-2 text-primary"></i>
          </button>
          <button className=" p-0 border-0  ms-2" title="Add to Cart">
            <i className="fas fa-shopping-cart fs-2 text-primary"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="row px-xl-5 px-2">
        {/* Mobile Filter Toggle */}
        <div className="col-12 d-lg-none mb-3">
          <button 
            className="btn btn-primary w-100 d-flex align-items-center justify-content-between"
            data-bs-toggle="collapse" 
            data-bs-target="#shopFilters"
            style={{
              background: 'linear-gradient(135deg, #3498db, #2980b9)',
              border: 'none',
              fontWeight: '600'
            }}
          >
            <span>Filters</span>
            <i className="fas fa-filter"></i>
          </button>
        </div>

        {/* Shop Sidebar - Collapsible on mobile */}
        <div className="col-lg-3 col-md-4 collapse d-lg-block" id="shopFilters">
          {/* Price Filter */}
          <div className="card rounded-3 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold">Filter by price</h5>
            </div>
            <div className="card-body p-3">
              <div className="form-check d-flex justify-content-between align-items-center mb-2">
                <input className="form-check-input" type="checkbox" id="price-all" checked />
                <label className="form-check-label flex-grow-1 ms-2" htmlFor="price-all">All Price</label>
                <span className="badge bg-light text-dark">1000</span>
              </div>
              {[
                { id: 'price-1', range: '$0 - $100', count: 150 },
                { id: 'price-2', range: '$100 - $200', count: 295 },
                { id: 'price-3', range: '$200 - $300', count: 246 },
                { id: 'price-4', range: '$300 - $400', count: 145 },
                { id: 'price-5', range: '$400 - $500', count: 168 }
              ].map(filter => (
                <div className="form-check d-flex justify-content-between align-items-center mb-2" key={filter.id}>
                  <input className="form-check-input" type="checkbox" id={filter.id} />
                  <label className="form-check-label flex-grow-1 ms-2" htmlFor={filter.id}>{filter.range}</label>
                  <span className="badge bg-light text-dark">{filter.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="card rounded-3 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold">Filter by color</h5>
            </div>
            <div className="card-body p-3">
              <div className="form-check d-flex justify-content-between align-items-center mb-2">
                <input className="form-check-input" type="checkbox" id="color-all" checked />
                <label className="form-check-label flex-grow-1 ms-2" htmlFor="color-all">All Colors</label>
                <span className="badge bg-light text-dark">1000</span>
              </div>
              {[
                { id: 'color-1', color: 'Black', count: 150 },
                { id: 'color-2', color: 'White', count: 295 },
                { id: 'color-3', color: 'Red', count: 246 },
                { id: 'color-4', color: 'Blue', count: 145 },
                { id: 'color-5', color: 'Green', count: 168 }
              ].map(filter => (
                <div className="form-check d-flex justify-content-between align-items-center mb-2" key={filter.id}>
                  <input className="form-check-input" type="checkbox" id={filter.id} />
                  <label className="form-check-label flex-grow-1 ms-2" htmlFor={filter.id}>{filter.color}</label>
                  <span className="badge bg-light text-dark">{filter.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="card rounded-3 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold">Filter by size</h5>
            </div>
            <div className="card-body p-3">
              <div className="form-check d-flex justify-content-between align-items-center mb-2">
                <input className="form-check-input" type="checkbox" id="size-all" checked />
                <label className="form-check-label flex-grow-1 ms-2" htmlFor="size-all">All Sizes</label>
                <span className="badge bg-light text-dark">1000</span>
              </div>
              {[
                { id: 'size-1', size: 'XS', count: 150 },
                { id: 'size-2', size: 'S', count: 295 },
                { id: 'size-3', size: 'M', count: 246 },
                { id: 'size-4', size: 'L', count: 145 },
                { id: 'size-5', size: 'XL', count: 168 }
              ].map(filter => (
                <div className="form-check d-flex justify-content-between align-items-center mb-2" key={filter.id}>
                  <input className="form-check-input" type="checkbox" id={filter.id} />
                  <label className="form-check-label flex-grow-1 ms-2" htmlFor={filter.id}>{filter.size}</label>
                  <span className="badge bg-light text-dark">{filter.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop Products */}
        <div className="col-lg-9 col-md-8">
          <div className="row g-3">
            {/* Sorting Options - Mobile */}
            <div className="col-12 d-lg-none">
              <div className="d-flex justify-content-between align-items-center">
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary dropdown-toggle" 
                    type="button" 
                    id="sortDropdown" 
                    data-bs-toggle="dropdown"
                  >
                    Sort By
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                    <li><a className="dropdown-item" href="#">Price: Low to High</a></li>
                    <li><a className="dropdown-item" href="#">Price: High to Low</a></li>
                    <li><a className="dropdown-item" href="#">Most Popular</a></li>
                    <li><a className="dropdown-item" href="#">Newest First</a></li>
                  </ul>
                </div>
                <div>
                  <span className="text-muted">{products.length} products</span>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {products.map(product => (
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6 mb-4" key={product.id}>
                <div className="card product-card h-100 border-0 shadow-sm">
                  <Link to={`/shop-detail/${product.id}`} className="text-decoration-none">
                    <img 
                      src={product.image} 
                      className="card-img-top p-3" 
                      alt={product.name}
                      style={{ 
                        height: '200px', 
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </Link>
                  <div className="card-body pt-0 pb-3 px-3">
                    <div className="d-flex justify-content-between align-items-start mb-1 pt-4">
                      <Link to={`/shop-detail/${product.id}`} className="text-decoration-none">
                        <h6 className="card-title mb-0 text-dark">{product.name}</h6>
                      </Link>
                        <i className="far fa-heart text-muted"></i>
                     
                    </div>
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < product.rating ? 'text-warning' : 'text-muted'}`}
                          style={{ fontSize: '0.8rem' }}
                        ></i>
                      ))}
                      <span className="small text-muted ms-1">({product.reviews})</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-primary fw-bold">${product.price}</span>
                        {product.price > 100 && (
                          <del className="small text-muted ms-1">${product.price + 50}</del>
                        )}
                      </div>
                      <button 
                        className="btn btn-sm btn-primary rounded-1 px-3"
                        style={{
                          background: 'linear-gradient(135deg, #3498db, #2980b9)',
                          border: 'none',
                          fontWeight: '600'
                        }}
                      >
                        <i className="fas fa-shopping-cart me-1"></i> Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="col-12 mt-4">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;