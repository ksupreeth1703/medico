import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_REGISTER_URL, APP_NAME } from '../utils/contants';
import Logo from "../assets/doctorlogo.webp"
const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Name validations
        if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        // Confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(API_REGISTER_URL, {
                firstname: formData.firstname,
                lastname: formData.lastname,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.data) {
                navigate('/login', {
                    state: { message: 'Registration successful! Please login to continue.' }
                });
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=1000"
                        alt="Pattern"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative">
                    <div className="flex items-center text-white">
                        <img
                            src={"/doctorlogo.webp"}
                            alt="Logo"
                            className="h-12 w-12"
                        />
                        <span className="ml-3 text-2xl font-bold">{APP_NAME}</span>
                    </div>
                </div>

                <div className="relative space-y-8">
                    <h1 className="text-5xl font-bold text-white leading-tight">
                        Start your journey <br />with us today
                    </h1>
                    <p className="text-xl text-indigo-200">Join thousands of satisfied users who trust our platform.</p>
                    <div className="flex space-x-8">
                        <div className="flex flex-col items-center space-y-2">
                            <svg className="h-12 w-12 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-indigo-200">Trusted</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <svg className="h-12 w-12 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-indigo-200">Secure</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <svg className="h-12 w-12 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 4.414 7.707 6.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 2zm0 2a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-indigo-200">Premium</span>
                        </div>
                    </div>
                </div>

                <div className="relative space-y-6">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-3">
                            <svg className="h-6 w-6 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-lg text-indigo-200">24/7 Premium Support</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <svg className="h-6 w-6 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-lg text-indigo-200">Enterprise Security</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <svg className="h-6 w-6 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-lg text-indigo-200">Regular Updates</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Create your account</h2>
                        <p className="text-lg text-gray-600">Join our community and start your journey today</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="John"
                                    value={formData.firstname}
                                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                />
                                {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Doe"
                                    value={formData.lastname}
                                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                />
                                {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating your account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </form>

                    <div className="mt-8 border-t border-gray-200 pt-8">
                        <p className="text-center text-sm text-gray-500">Trusted by leading companies worldwide</p>
                        <div className="mt-6 flex justify-center space-x-8">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                                alt="Microsoft"
                                className="h-8 opacity-50 hover:opacity-75 transition-opacity"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                                alt="Google"
                                className="h-8 opacity-50 hover:opacity-75 transition-opacity"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                                alt="Apple"
                                className="h-8 opacity-50 hover:opacity-75 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
