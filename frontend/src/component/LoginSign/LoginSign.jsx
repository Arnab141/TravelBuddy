import React, { useState } from 'react';
import { useAppContext } from '../AllContext/AllContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'lucide-react';
import './LoginSign.css';
import login_img from "../../assets/client_image/login_img.png"
import signup_img from "../../assets/client_image/signup_img.png"

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = stateLogin === 'Login' ? '/api/users/login' : '/api/users/register';
    const fullUrl = `${url}${endpoint}`;

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
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
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
    <div className="login-overlay">
      <div className="login-container">
        {/* Close Button */}
        <button className="close-btn" onClick={() => setShowLoginPopup(false)}>
          <X size={24} />
        </button>

        {/* Left Side - Form */}
        <div className="form-container">
          <h2 className="form-title">{stateLogin === 'Login' ? 'Sign In' : 'Sign Up'}</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            {stateLogin === 'Signup' && (
              <input type="text" name="name" placeholder="Username" required onChange={handleChange} className="input-field" />
            )}
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="input-field" />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="input-field" />
            {stateLogin === 'Signup' && (
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} className="input-field" />
            )}

            {/* ✅ Forgot Password should only appear in Login Form */}
            {stateLogin === 'Login' && (
              <div className="forgot-password">
                <Link to="/forget-password" onClick={() => setShowLoginPopup(false)}>Forgot Password?</Link>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {stateLogin === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <p className="switch-text">
            {stateLogin === 'Login' ? "Not registered yet? " : "Already have an account? "}
            <span onClick={() => setStateLogin(stateLogin === 'Login' ? 'Signup' : 'Login')}>
              {stateLogin === 'Login' ? "Create an account" : "Sign In"}
            </span>
          </p>
        </div>

        {/* Right Side - Image Section */}
        <div className="image-container">
          <img
            src={stateLogin === 'Login' ? login_img : signup_img}
            alt="Illustration"
            className="login-image"
          />
          <h2 className="login-title">
            {stateLogin === 'Login' ? "Everything you are. In one simple link." : "Welcome to TravelBuddy"}
          </h2>
        </div>


      </div>
    </div>
  );
}

export default LoginSign;
