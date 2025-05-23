import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/cookies';
import { API_BOOKING_URL } from '../utils/contants';
import { FaCalendarAlt, FaClock, FaUserMd, FaMoneyBillWave, FaTrash, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${API_BOOKING_URL}/myBookings`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            setError('Failed to load bookings. Please try again later.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${API_BOOKING_URL}/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) throw new Error('Failed to cancel booking');

            setBookings(bookings.filter(booking => booking.id !== bookingId));
            setShowCancelModal(false);
            setSelectedBooking(null);
        } catch (error) {
            setError('Failed to cancel booking. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const openCancelModal = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    // Cancel Modal Component
    const CancelModal = () => {
        if (!selectedBooking) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    {/* Background overlay */}
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={() => setShowCancelModal(false)}></div>

                    {/* Modal panel */}
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Cancel Appointment
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to cancel this appointment? This action cannot be undone.
                                        </p>
                                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                                            <p><span className="font-semibold">Date:</span> {selectedBooking.appointmentDate}</p>
                                            <p><span className="font-semibold">Time:</span> {selectedBooking.appointmentTime}</p>
                                            <p><span className="font-semibold">Type:</span> {selectedBooking.bookingClass}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                disabled={isDeleting}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${isDeleting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                                onClick={() => handleCancelBooking(selectedBooking.id)}
                            >
                                {isDeleting ? 'Cancelling...' : 'Cancel Appointment'}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Keep Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                    <p className="mt-2 text-gray-600">Manage your upcoming and past appointments</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
                        <p className="mt-1 text-gray-500">You haven't made any appointments yet.</p>
                        <button
                            onClick={() => navigate('/doctors')}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                        >
                            Book an Appointment
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className={`p-4 ${booking.bookingClass === 'EMERGENCY' ? 'bg-red-500' :
                                    booking.bookingClass === 'PREMIUM' ? 'bg-purple-500' :
                                        'bg-amber-500'
                                    } text-white`}>
                                    <h3 className="font-semibold">{booking.bookingClass} Appointment</h3>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <FaCalendarAlt className="text-gray-400" />
                                            <span>{booking.appointmentDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaClock className="text-gray-400" />
                                            <span>{booking.appointmentTime}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaMoneyBillWave className="text-gray-400" />
                                            <span>${booking.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaUserMd className="text-gray-400" />
                                            <span>Booking ID: {booking.id.slice(0, 8)}...</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={() => navigate(`/doctor/${booking.doctorId}`)}
                                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                        >
                                            <FaEye className="mr-2" /> View
                                        </button>
                                        <button
                                            onClick={() => openCancelModal(booking)}
                                            disabled={isDeleting}
                                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <FaTrash className="mr-2" /> Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Render the modal */}
            {showCancelModal && <CancelModal />}
        </div>
    );
};

export default MyBookings;