import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Navbar from './component/Navbar/Navbar.jsx';
import Footer from './component/Footer/Footer.jsx';
import { AppProvider } from './component/AllContext/AllContext';
import FindTrip from './pages/FindTrip.jsx';
import PostTrip from './pages/PostTrip.jsx';
import RequestTrip from './pages/RequestTrip.jsx';
import Profile from './component/Profile/Profile.jsx';
import ForgetPass from './pages/ForgetPass.jsx';
import MyTrip from './pages/MyTrip.jsx';


function App() {
  return (
    <AppProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-trip" element={<FindTrip/>} />
        <Route path="/post-trip" element={<PostTrip/>} />
        <Route path="/my-trips" element={<MyTrip/>} />
        <Route path="/request-trip" element={<RequestTrip/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path='forget-password' element={<ForgetPass/>}/>
        
        
      </Routes>
      <Footer />
    </AppProvider>
  );
}

export default App;


//hello i am arnab