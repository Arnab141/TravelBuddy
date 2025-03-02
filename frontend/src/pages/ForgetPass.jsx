import React, { useState } from 'react';
import { useAppContext } from '../component/AllContext/AllContext';

function ForgetPass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {url} = useAppContext();

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Verify OTP</button>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgetPass;
