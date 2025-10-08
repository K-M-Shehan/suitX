import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/AuthService";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const msg = await signup(username, email, password);
      setMessage(msg);
      // Redirect to Launchpad after successful signup
      // Check for successful signup messages
      if (msg.includes('registered') || msg.includes('success') || msg.includes('created') || (!msg.includes('error') && !msg.includes('failed'))) {
        setTimeout(() => {
          navigate("/launchpad");
        }, 1000);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLanding={true} />
      
      <div className="flex-1 flex">
        {/* Left side - Decorative pattern */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-100 to-cyan-200 relative overflow-hidden">
          {/* Circular pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Large circles */}
              <div className="absolute top-20 left-16 w-24 h-24 bg-cyan-400 rounded-full opacity-80"></div>
              <div className="absolute top-32 right-20 w-32 h-32 bg-cyan-500 rounded-full opacity-70"></div>
              <div className="absolute bottom-32 left-12 w-28 h-28 bg-cyan-400 rounded-full opacity-75"></div>
              <div className="absolute bottom-20 right-24 w-20 h-20 bg-cyan-500 rounded-full opacity-80"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-cyan-500 rounded-full opacity-60"></div>
              
              {/* Medium circles */}
              <div className="absolute top-16 left-1/2 w-16 h-16 bg-cyan-400 rounded-full opacity-70"></div>
              <div className="absolute bottom-16 left-1/3 w-12 h-12 bg-cyan-500 rounded-full opacity-80"></div>
              <div className="absolute top-3/4 right-12 w-14 h-14 bg-cyan-400 rounded-full opacity-75"></div>
              
              {/* Small circles */}
              <div className="absolute top-24 right-1/3 w-8 h-8 bg-cyan-500 rounded-full opacity-60"></div>
              <div className="absolute bottom-1/3 right-1/2 w-10 h-10 bg-cyan-400 rounded-full opacity-70"></div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Re-type Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Create Account
              </button>
            </form>
            
            {message && (
              <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
