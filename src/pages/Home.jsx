import React, { useState } from 'react';
import Navbar from '../components/Header/header';
import AllMatches from './Matches';
import '../style/main.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Yahan tum search ka logic add kar sakte ho, ya kisi state ko update kar sakte ho
    console.log('Search:', e.target.value);
  };

  const handleFilter = () => {
    // Yahan filter button ka logic likho ya modal open kara lo
    console.log('Filter button clicked');
  };

  return (
    <>
      <div className="container-fluid">
        <Navbar />
        <AllMatches home="home"/>
      </div>
    </>
  );
};

export default Home;