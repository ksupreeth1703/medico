import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_MASTER_DATA_URL } from "../utils/contants";
import { FaUserMd, FaCalendarCheck, FaHospital, FaSearch } from 'react-icons/fa';

const Home = () => {
  const [masterData, setMasterData] = useState(null);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const response = await fetch(API_MASTER_DATA_URL);
      const data = await response.json();
      setMasterData(data);
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedSpeciality) params.append('speciality', selectedSpeciality);
    if (selectedClass) params.append('class', selectedClass);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGw9IiMyMDIwMjAiIG9wYWNpdHk9Ii4xIiBjeD0iNzIwIiBjeT0iNjAiIHI9IjYwIi8+PGNpcmNsZSBmaWxsPSIjMjAyMDIwIiBvcGFjaXR5PSIuMSIgY3g9IjcyMCIgY3k9IjEyMCIgcj0iNjAiLz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-6xl font-bold mb-6 leading-tight">Your Medico, <br/>Our Priority</h1>
          <p className="text-xl mb-12 text-blue-100 max-w-2xl">Book appointments with top specialists in just a few clicks. Experience healthcare that puts you first.</p>

          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-4xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <select
                className="p-4 border-0 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                value={selectedSpeciality}
                onChange={(e) => setSelectedSpeciality(e.target.value)}
              >
                <option value="">Select Speciality</option>
                {masterData?.speciality?.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <select
                className="p-4 border-0 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Booking Class</option>
                {masterData?.bookingClass?.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>

              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FaSearch className="text-lg" /> Find Doctors
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
              <FaUserMd className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Expert Doctors</h3>
            <p className="text-gray-600 leading-relaxed">Access to {masterData?.speciality?.length} specialities with world-class expertise</p>
          </div>

          <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
              <FaCalendarCheck className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Easy Booking</h3>
            <p className="text-gray-600 leading-relaxed">Seamless appointment booking across various classes including emergency care</p>
          </div>

          <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
              <FaHospital className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Quality Care</h3>
            <p className="text-gray-600 leading-relaxed">Premium healthcare services delivered with compassion and excellence</p>
          </div>
        </div>
      </div>

      {/* Specialities Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Our Specialities</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {masterData?.speciality?.map((spec) => (
              <div
                key={spec}
                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => {
                  setSelectedSpeciality(spec);
                  handleSearch();
                }}
              >
                <p className="text-gray-700 text-center font-medium group-hover:text-blue-600 transition-colors duration-300">{spec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;