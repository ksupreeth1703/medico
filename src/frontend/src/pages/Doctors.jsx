import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaGraduationCap, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { API_DOCTORS_URL } from '../utils/contants';

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Filter states
  const [priceRange, setPriceRange] = useState(500);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedQualification, setSelectedQualification] = useState('');

  const speciality = searchParams.get('speciality');

  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_DOCTORS_URL}`);
      const data = await response.json();
      console.log(data);
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = doctors;

    // Speciality filter from URL params
    if (speciality) {
      filtered = filtered.filter(doctor =>
        doctor.speciality.toLowerCase() === speciality.toLowerCase()
      );
    }

    // Price filter
    filtered = filtered.filter(doctor => doctor.price <= priceRange);

    // Experience filter
    filtered = filtered.filter(doctor => parseInt(doctor.experience) >= minExperience);

    // Qualification filter
    if (selectedQualification) {
      filtered = filtered.filter(doctor =>
        doctor.qualification.includes(selectedQualification)
      );
    }

    setFilteredDoctors(filtered);
  }, [priceRange, minExperience, selectedQualification, doctors, speciality]);

  // Get unique qualifications
  const qualifications = [...new Set(doctors.flatMap(doc =>
    doc.qualification.split(',').map(q => q.trim())
  ))];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      {/* Filter Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Refine Your Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Price Range Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Price: <span className="text-blue-600 font-semibold">${priceRange}</span>
              </label>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Experience Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Experience: <span className="text-blue-600 font-semibold">{minExperience} years</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Qualification Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <select
                value={selectedQualification}
                onChange={(e) => setSelectedQualification(e.target.value)}
                className="w-full p-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">All Qualifications</option>
                {qualifications.map(qual => (
                  <option key={qual} value={qual}>{qual}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{doctor.name}</h3>
                  <p className="text-blue-200 font-medium">{doctor.speciality}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FaGraduationCap className="text-blue-600" />
                  </div>
                  <span className="font-medium">{doctor.qualification}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FaBriefcase className="text-blue-600" />
                  </div>
                  <span className="font-medium">{doctor.experience} years experience</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FaMoneyBillWave className="text-blue-600" />
                  </div>
                  <span className="font-medium">${doctor.price} per consultation</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>
                  <span className="font-medium">{doctor.address}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {doctor.description}
                </p>

                <button
                  onClick={() => navigate(`/doctor/${doctor.id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-medium"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;