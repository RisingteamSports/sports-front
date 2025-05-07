import React, { useState } from 'react';
import Navbar from '../components/Header/header'; // Ensure the path is correct
import AllMatches from './Matches'; // Ensure the path is correct
import '../style/main.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (query) => {
    setSearchTerm(query); // Update the search term when search query changes
  };

  return (
    <>
      <div className="container-fluid">
        {/* Pass the handleSearchChange function as onSearch to Navbar */}
        <Navbar onSearch={handleSearchChange} />
        {/* Pass the searchTerm to AllMatches component to filter the matches */}
        <AllMatches searchTerm={searchTerm} />
      </div>
    </>
  );
};

export default Home;
