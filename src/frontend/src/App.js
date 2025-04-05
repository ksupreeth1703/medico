import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import MyBookings from './pages/MyBookings';
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctor/:doctorid" element={<DoctorDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
