import React, { useState } from 'react';
import { useAppContext } from '../AllContext/AllContext';
import './LoginSign.css';

function LoginSign({ stateLogin, setStateLogin }) {
  const { setShowLoginPopup, setToken, setUser, url } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = stateLogin === 'Login' ? '/api/users/login' : '/api/users/register';
    const fullUrl = `${url}${endpoint}`;
    console.log("Request URL:", fullUrl);
    console.log("Form Data:", formData);
  
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
  
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        body: stateLogin === 'Login' 
          ? JSON.stringify({ email: formData.email, password: formData.password })  // Login uses JSON
          : data, // Signup uses FormData
        headers: stateLogin === 'Login' 
          ? { "Content-Type": "application/json" }  // Only for Login, FormData sets its own headers
          : {},
      });
  
      const result = await response.json();
      console.log("Response:", result);
  
      if (response.ok) {
        setToken(result.token);
        localStorage.setItem('token', result.token);
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        setShowLoginPopup(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-sign-overlay">
      <div className="login-sign-container">
        {stateLogin === 'Login' ? (
          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <button type="submit" className="submit-button">Login</button>
            </form>
            <p>
              Don't have an account?{' '}
              <span onClick={() => setStateLogin('Signup')}>Sign Up</span>
            </p>
          </div>
        ) : (
          <div className="signup-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <input type="file" name="profileImage" accept="image/*" onChange={handleChange} />
              <button type="submit" className="submit-button">Sign Up</button>
            </form>
            <p>
              Already have an account?{' '}
              <span onClick={() => setStateLogin('Login')}>Login</span>
            </p>
          </div>
        )}
        <button className="close-button" onClick={() => setShowLoginPopup(false)}>X</button>
      </div>
    </div>
  );
}

export default LoginSign;
