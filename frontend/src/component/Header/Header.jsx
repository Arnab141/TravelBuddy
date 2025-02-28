import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header bg-cover bg-center text-white p-8 flex items-center justify-center">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to TravelBuddy</h1>
        <p className="text-lg mb-6">Find travel partners & share your journey effortlessly</p>
      </div>
    </header>
  );
}

export default Header;
