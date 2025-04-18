import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import ReportCard from '../components/shared/ReportCard';

const HomePage: React.FC = () => {
  const { reports } = useApp();
  
  // Get latest 3 reports
  const latestReports = [...reports]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg" 
            alt="People helping each other" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Connecting Compassion with Those in Need
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl mb-8 text-blue-100"
            >
              Help someone find shelter and safety today. Your report can change a life.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                to="/report" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Report Someone in Need
              </Link>
              <Link 
                to="/about" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Learn How It Works
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How ShelterConnect Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, effective way to connect those experiencing homelessness with resources they need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="bg-blue-100 rounded-full p-5 mb-6">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Spot & Report</h3>
              <p className="text-gray-600">
                See someone in need? Report their location and situation through our simple form or mobile app.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="bg-blue-100 rounded-full p-5 mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Shelter Connection</h3>
              <p className="text-gray-600">
                Our system immediately notifies nearby shelters and support services with capacity.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="bg-blue-100 rounded-full p-5 mb-6">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Rewarded</h3>
              <p className="text-gray-600">
                Receive recognition and rewards from our sponsors for your compassion and social impact.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Impact Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <p className="text-4xl font-bold text-blue-600 mb-2">500+</p>
                <p className="text-gray-700">People Connected to Shelter</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <p className="text-4xl font-bold text-teal-600 mb-2">50+</p>
                <p className="text-gray-700">Partner Shelters Nationwide</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <p className="text-4xl font-bold text-orange-600 mb-2">1,200+</p>
                <p className="text-gray-700">Compassionate Reports Made</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Reports */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Recent Reports</h2>
            <Link 
              to="/report" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Make a Report
              <svg className="h-5 w-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              to="/reports" 
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              View All Reports
              <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Stories of Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from those who have used ShelterConnect to make a difference
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Michael Thompson</h4>
                    <p className="text-gray-600 text-sm">Volunteer, Los Angeles</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "I spotted an elderly man with a small dog near the park. Both looked hungry and tired. I submitted a report through ShelterConnect, and within hours a local shelter had reached out and provided assistance. Now they're both safe and cared for!"
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-teal-200 flex items-center justify-center text-teal-600 font-bold text-xl mr-4">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Sarah Williams</h4>
                    <p className="text-gray-600 text-sm">Shelter Coordinator, New York</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "As a shelter coordinator, ShelterConnect has revolutionized how we find people in need. Instead of only helping those who walk through our doors, we can now proactively reach those who might not know about our services. It's made our outreach efforts 10x more effective."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Be the Connection That Changes a Life Today
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Your simple report can help someone find shelter, safety, and a path forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/report" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Report Someone in Need
              </Link>
              <Link 
                to="/shelters" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium text-center transition-colors"
              >
                View Nearby Shelters
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;