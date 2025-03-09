import React, { useState } from 'react';
import { useAppContext } from '../AllContext/AllContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginSign.css';

function LoginSign({ stateLogin, setStateLogin }) {
  const { setShowLoginPopup, setToken, setUser, url } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = stateLogin === 'Login' ? '/api/users/login' : '/api/users/register';
    const fullUrl = `${url}${endpoint}`;

    // Check if passwords match before submitting (only for signup)
    if (stateLogin === 'Signup' && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (response.ok) {
        setToken(result.token);
        localStorage.setItem('token', result.token);
        setUser(result.user);
        setShowLoginPopup(false);
        
        // Reset form after successful login/signup
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        toast.success(stateLogin === 'Login' ? 'Login Successful!' : 'Signup Successful!');
      } else {
        toast.error(result.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
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
              <Link to="/forget-password" className="forget-password-link" onClick={() => setShowLoginPopup(false)}>Forgot password?</Link>
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
              <input type="password" name="confirmPassword" placeholder="Re-enter Password" required onChange={handleChange} />
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
