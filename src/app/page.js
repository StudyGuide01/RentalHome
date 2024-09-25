'use client';
import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const email = localStorage.getItem('email');
 
      alert(email);
    
  }, []); // Empty dependency array ensures this runs only once after the component mounts.

  return (
    <>
      <h1>Home Page</h1>
    </>
  );
}

export default Home;
