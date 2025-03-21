import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./component/Navbar/Navbar.jsx";
import Footer from "./component/Footer/Footer.jsx";
import { useAppContext } from "./component/AllContext/AllContext";
import FindTrip from "./pages/FindTrip.jsx";
import PostTrip from "./pages/PostTrip.jsx";
import RequestTrip from "./pages/RequestTrip.jsx";
import Profile from "./component/Profile/Profile.jsx";
import ForgetPass from "./pages/ForgetPass.jsx";
import MyTrip from "./pages/MyTrip.jsx";
import { ToastContainer } from "react-toastify";
import Message from "./pages/Message.jsx";

function App() {
  const { token, user, getUserInformation } = useAppContext();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (token) {
      getUserInformation();
    }
  }, [token]);

 

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-trip" element={token ? <FindTrip /> : <Navigate to="/" />} />
        <Route path="/post-trip" element={<PostTrip />} />
        <Route path="/my-trips" element={<MyTrip />} />
        <Route path="/request-trip" element={<RequestTrip />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
        <Route path="/forget-password" element={<ForgetPass />} />
        <Route path="/message" element={<Message />} />


        {/* admin route */}
        {
          (user?.admin)?
          <>
          <Route path="/admin/" element={<Home />} />
          <Route path="/admin/profile" element={<Profile />} />
          </>
          :
          <>
          </>
          
        }
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
