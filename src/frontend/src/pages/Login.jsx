import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthToken } from '../utils/cookies';
import { useAuth } from '../context/AuthContext';
import { API_LOGIN_URL, APP_NAME } from '../utils/contants';
import Logo from "../assets/doctorlogo.webp"

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post(API_LOGIN_URL, formData);

            if (response.data.token) {
                setAuthToken(response.data.token);
                setUser({ name: formData.username, username: formData.username });
                navigate('/');
            } else if (response.data.message === "Bad credentials") {
                setErrors({
                    submit: 'Invalid username or password. Please try again.'
                });
            } else {
                setErrors({
                    submit: 'Login failed. Please try again.'
                });
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        setErrors({
                            submit: 'Your account has been locked. Please contact support.'
                        });
                        break;
                    case 404:
                        setErrors({
                            submit: 'Service not available. Please try again later.'
                        });
                        break;
                    default:
                        setErrors({
                            submit: 'An error occurred during login. Please try again later.'
                        });
                }
            } else if (error.request) {
                setErrors({
                    submit: 'Unable to connect to the server. Please check your internet connection.'
                });
            } else {
                setErrors({
                    submit: 'An unexpected error occurred. Please try again.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070"
                        alt="Pattern"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative">
                    <div className="flex items-center text-white">
                        <img src={"/doctorlogo.webp"} alt="Logo" className="h-12 w-12" />
                        <span className="ml-3 text-2xl font-bold">{APP_NAME}</span>
                    </div>
                </div>

                <div className="relative space-y-8">
                    <h1 className="text-5xl font-bold text-white leading-tight">
                        Welcome back! <br />Let's get started
                    </h1>
                    <p className="text-xl text-indigo-200">Access your account and continue your journey.</p>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-indigo-500/30 p-6 rounded-lg">
                            <div className="text-white text-4xl font-bold">100+</div>
                            <div className="text-indigo-200 mt-2">Active Users</div>
                        </div>
                        <div className="bg-indigo-500/30 p-6 rounded-lg">
                            <div className="text-white text-4xl font-bold">50+</div>
                            <div className="text-indigo-200 mt-2">Partners</div>
                        </div>
                        <div className="bg-indigo-500/30 p-6 rounded-lg">
                            <div className="text-white text-4xl font-bold">99%</div>
                            <div className="text-indigo-200 mt-2">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Sign in to your account</h2>
                        <p className="text-lg text-gray-600">Welcome back! Please enter your details</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="rounded-md bg-red-50 p-4 animate-fade-in">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{errors.submit}</p>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                    Register here
                                </a>
                            </p>
                        </div>
                    </form>

                    <div className="mt-8 border-t border-gray-200 pt-8">
                        <p className="text-center text-sm text-gray-500">Sign in with</p>
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                            </button>
                            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <img className="h-5 w-5" src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
                            </button>
                            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <img className="h-5 w-5" src="https://www.svgrepo.com/show/475669/linkedin-color.svg" alt="LinkedIn" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
