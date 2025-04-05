import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../utils/cookies';
import { API_DOCTORS_URL, API_BOOKING_URL } from '../utils/contants';
import {
    FaUserMd, FaGraduationCap, FaBriefcase, FaMoneyBillWave,
    FaMapMarkerAlt, FaClock, FaCalendarAlt
} from 'react-icons/fa';

const DoctorDetails = () => {
    const { doctorid } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [selectedClass, setSelectedClass] = useState("GENERAL (15 Minutes)");
    const [adjustedPrice, setAdjustedPrice] = useState(0);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const bookingClasses = [
        "GENERAL (15 Minutes)",
        "PREMIUM (30 Minutes)",
        "EMERGENCY"
    ];

    // Get today's date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split('T')[0];

    // Generate available time slots (9 AM to 5 PM)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
            const time24 = `${hour.toString().padStart(2, '0')}:00`;
            const time12 = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
            slots.push({ value: time24, label: time12 });
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        fetchDoctorDetails(); // eslint-disable-next-line
    }, [doctorid]);

    useEffect(() => {
        if (doctor) {
            let multiplier = 1;
            switch (selectedClass) {
                case "PREMIUM (30 Minutes)":
                    multiplier = 1.5;
                    break;
                case "EMERGENCY":
                    multiplier = 2;
                    break;
                default:
                    multiplier = 1;
            }
            setAdjustedPrice(doctor.price * multiplier);
        }
    }, [selectedClass, doctor]);

    const fetchDoctorDetails = async () => {
        try {
            const response = await fetch(`${API_DOCTORS_URL}/${doctorid}`);
            const data = await response.json();
            setDoctor(data);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsBooking(true);
        setBookingError('');

        // Format date to DD-MM-YYYY
        const formattedDate = new Date(appointmentDate)
            .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
            .split('/')
            .join('-');

        // Format time to include AM/PM
        const timeSlot = timeSlots.find(slot => slot.value === appointmentTime);
        const formattedTime = timeSlot.label.replace(' ', '');

        // Extract the actual booking class (remove duration)
        const bookingClass = selectedClass.split(' ')[0];

        try {
            const response = await fetch(API_BOOKING_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    doctorId: doctorid,
                    price: adjustedPrice,
                    bookingClass: bookingClass,
                    appointmentDate: formattedDate,
                    appointmentTime: formattedTime,
                    bookedBy: user.username
                })
            });

            if (!response.ok) {
                throw new Error('Booking failed');
            }

            // Redirect to bookings page on success
            navigate('/my-bookings');
        } catch (error) {
            setBookingError('Failed to book appointment. Please try again.');
            console.error('Booking error:', error);
        } finally {
            setIsBooking(false);
        }
    };

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-amber-600 to-indigo-700 text-white py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
                            <p className="text-xl mb-4">{doctor.speciality}</p>
                            <div className="flex flex-wrap gap-4">
                                <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                    <FaGraduationCap /> {doctor.qualification}
                                </span>
                                <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                    <FaBriefcase /> {doctor.experience} years experience
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        {/* About Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-4">About Doctor</h2>
                            <p className="text-gray-600 leading-relaxed">{doctor.description}</p>
                        </div>

                        {/* Expertise Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-4">Expertise</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <FaUserMd className="text-amber-600 text-xl" />
                                    <span>{doctor.speciality} Specialist</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <FaGraduationCap className="text-amber-600 text-xl" />
                                    <span>{doctor.qualification}</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4">Location</h2>
                            <div className="flex items-start gap-3 text-gray-600">
                                <FaMapMarkerAlt className="text-xl mt-1" />
                                <span>{doctor.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

                            {/* Price Section */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-lg text-gray-800 mb-2">
                                    <FaMoneyBillWave />
                                    <span>Consultation Fee</span>
                                </div>
                                <p className="text-2xl font-bold text-amber-600">
                                    ${adjustedPrice.toFixed(2)}
                                    {selectedClass && selectedClass !== "GENERAL (15 Minutes)" && (
                                        <span className="text-sm text-gray-500 ml-2">
                                            (Base: ${doctor.price})
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Appointment Type */}
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Select Appointment Type</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="">Select Type</option>
                                    {bookingClasses.map((cls) => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            {/* Time Selection */}
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Select Time</label>
                                <select
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="">Select Time</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Book Button */}
                            <div>
                                {bookingError && (
                                    <p className="text-red-600 mb-4 text-sm">{bookingError}</p>
                                )}
                                <button
                                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors
                                        ${(!selectedClass || !appointmentDate || !appointmentTime || isBooking)
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                                    disabled={!selectedClass || !appointmentDate || !appointmentTime || isBooking}
                                    onClick={handleBooking}
                                >
                                    <FaCalendarAlt />
                                    {isBooking ? 'Scheduling...' : 'Schedule Appointment'}
                                </button>
                            </div>

                            {/* Available Times Info */}
                            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                                <div className="flex items-center gap-2 text-amber-600 mb-2">
                                    <FaClock />
                                    <span className="font-semibold">Available Times</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                                    Saturday: 9:00 AM - 1:00 PM<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;