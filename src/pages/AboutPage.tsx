import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, MapPin, Building, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Our Mission
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl leading-relaxed mb-8"
            >
              ShelterConnect was founded with a simple but powerful mission: to ensure that no person goes without shelter, food, and basic necessities when help is just a connection away.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block p-3 bg-white rounded-full"
            >
              <Heart className="h-12 w-12 text-blue-600" />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">How ShelterConnect Works</h2>
              <p className="text-xl text-gray-600">
                Our platform brings together compassionate individuals, shelters, and those in need
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                  <MapPin className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Community Reporting</h3>
                <p className="text-gray-600">
                  Users like you spot someone in need and submit a detailed report with location information through our platform.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                  <Building className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Shelter Notification</h3>
                <p className="text-gray-600">
                  Our system automatically identifies nearby shelters with capacity and sends them detailed notifications about the person in need.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Connection & Support</h3>
                <p className="text-gray-600">
                  Shelter staff connect with the person, providing immediate assistance while reporters receive updates and rewards for their compassion.
                </p>
              </motion.div>
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                to="/report" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Make Your First Report
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg" 
                  alt="Volunteers helping the homeless" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  ShelterConnect was born from a simple observation: every day, countless compassionate people notice those in need but don't know how to help effectively.
                </p>
                <p className="text-gray-700 mb-4">
                  Our founder experienced this firsthand on a cold winter night in 2023, when she encountered an elderly man struggling to find shelter. Despite her desire to help, she didn't know which facilities were open or had capacity.
                </p>
                <p className="text-gray-700 mb-6">
                  This gap between people's compassion and their ability to act effectively inspired the creation of ShelterConnect – a platform that transforms moments of concern into tangible assistance.
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
                    alt="Founder" 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Sarah Johnson</p>
                    <p className="text-gray-600">Founder & CEO</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Impact Stats */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
                Our Impact So Far
              </motion.h2>
              <p className="text-xl text-blue-100">
                Every connection made through our platform represents a life touched
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-5xl font-bold mb-2">500+</p>
                <p className="text-xl text-blue-100">People Sheltered</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-5xl font-bold mb-2">50+</p>
                <p className="text-xl text-blue-100">Partner Shelters</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-5xl font-bold mb-2">1,200+</p>
                <p className="text-xl text-blue-100">Community Reports</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-5xl font-bold mb-2">15</p>
                <p className="text-xl text-blue-100">Cities Covered</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partner Shelters */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Shelter Partners</h2>
              <p className="text-xl text-gray-600">
                We work with a growing network of trusted shelters and support centers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-lg p-6 text-center"
              >
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Hope Community Shelter</h3>
                <p className="text-gray-600 mb-4">Los Angeles, CA</p>
                <p className="text-sm text-gray-500">Providing shelter and meals since 1998</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-lg p-6 text-center"
              >
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">New Beginning Center</h3>
                <p className="text-gray-600 mb-4">San Francisco, CA</p>
                <p className="text-sm text-gray-500">Specialized in family support services</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-lg p-6 text-center"
              >
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Harmony House</h3>
                <p className="text-gray-600 mb-4">Seattle, WA</p>
                <p className="text-sm text-gray-500">Mental health and housing services</p>
              </motion.div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-6">
                Interested in becoming a shelter partner? We're always looking to expand our network.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Become a Partner
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sponsors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Sponsors</h2>
              <p className="text-xl text-gray-600">
                These organizations help make our reward system possible
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Coffee className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-800 font-medium">LocalCafe</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <svg className="h-12 w-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-800 font-medium">Urban Goods</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <svg className="h-12 w-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-gray-800 font-medium">BookWorld</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <svg className="h-12 w-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                <p className="text-gray-800 font-medium">Sweet Bakery</p>
              </motion.div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-6">
                Interested in becoming a sponsor? Contact us to learn about our partnership opportunities.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Become a Sponsor
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Community of Compassion
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Together, we can ensure no one is left without shelter and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/report" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Make a Report
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;