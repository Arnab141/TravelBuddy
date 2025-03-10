import React, { useState } from 'react';
import { useAppContext } from '../component/AllContext/AllContext';
import forgetPassword_image from "../assets/client_image/forget_password.avif";

function ForgetPass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { url } = useAppContext();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${url}/api/users/forget-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      setStep(2);
    } else {
      alert('Email not found');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${url}/api/users/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    if (data.success) {
      setStep(3);
    } else {
      alert('Invalid OTP');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const response = await fetch(`${url}/api/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    const data = await response.json();
    if (data.success) {
      alert('Password changed successfully');
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Error changing password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 via-blue-200 to-purple-300 p-4">
      <div className="flex w-full max-w-4xl h-auto md:h-[550px] bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Left Side - Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">
            {step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Reset Password"}
          </h2>
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                className="w-full p-4 border rounded-lg focus:border-blue-500 focus:ring-blue-300"
              />
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
                Submit
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required 
                className="w-full p-4 border rounded-lg focus:border-blue-500 focus:ring-blue-300"
              />
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
                Verify OTP
              </button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
                className="w-full p-4 border rounded-lg focus:border-blue-500 focus:ring-blue-300"
              />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                className="w-full p-4 border rounded-lg focus:border-blue-500 focus:ring-blue-300"
              />
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
                Reset Password
              </button>
            </form>
          )}
        </div>
        
        {/* Right Side - Image Section */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 flex-col justify-center items-center p-8 text-center">
          <img src={forgetPassword_image} alt="Illustration" className="w-56 h-56 object-contain mb-6" />
          <p className="text-lg font-semibold text-blue-800">Don't worry, we'll help you.</p>
        </div>
      </div>
    </div>
  );
}

export default ForgetPass;
