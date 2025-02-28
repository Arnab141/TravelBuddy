import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer bg-gray-900 text-white py-10" id='contact'>
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                    {/* Brand Info */}
                    <div>
                        <h3 className="text-3xl font-bold mb-3">TravelBuddy</h3>
                        <p className="text-gray-400">Find travel partners & share trips effortlessly.</p>
                        <p className="text-gray-400">Plan your journey and reduce travel costs together.</p>
                        <p className="text-gray-400">Join a trip or create one to match your schedule.</p>
                        <p className="text-gray-400">Secure and easy communication with fellow travelers.</p>
                        <p className="text-gray-400">Perfect for carpooling, road trips, and city-to-city travel.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-blue-400">Home</a></li>
                            <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
                            <li><a href="/services" className="hover:text-blue-400">Services</a></li>
                            <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Signup */}
                    <div>
                        <h4 className="text-xl font-semibold mb-3">Stay Updated</h4>
                        <p className="text-gray-400 mb-4">Subscribe to get the latest travel updates.</p>
                        <form className="flex flex-col items-center md:items-start">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="p-2 w-full md:w-64 text-black rounded-md mb-3"
                            />
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Social Media */}
                <div className="text-center mt-10">
                    <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
                    <div className="flex justify-center space-x-6">
                        <a href="https://facebook.com" className="hover:text-blue-500"><i className="fab fa-facebook-f text-xl"></i></a>
                        <a href="https://twitter.com" className="hover:text-blue-400"><i className="fab fa-twitter text-xl"></i></a>
                        <a href="https://instagram.com" className="hover:text-pink-500"><i className="fab fa-instagram text-xl"></i></a>
                        <a href="https://linkedin.com" className="hover:text-blue-700"><i className="fab fa-linkedin-in text-xl"></i></a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-6 text-gray-500 text-sm">
                    <p>&copy; 2025 TravelBuddy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
