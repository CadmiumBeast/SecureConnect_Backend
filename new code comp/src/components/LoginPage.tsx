import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2, LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { RetroGrid } from './ui/retro-grid';

interface ValidationErrors {
  name?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!name) {
      newErrors.name = 'Username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name, 
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // ✅ Store token & user data in local storage
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login successful!");

        // ✅ Ensure navigation works
        setTimeout(() => {
            navigate("/dashboard");
        }, 500);

    } catch (error: any) {
        toast.error(error.message || "An error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
};



  return (
    <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center p-4 relative">
      <RetroGrid />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="card-border"></div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  className={clsx(
                    "w-full px-4 py-2 bg-[#1A1A1F] border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-white",
                    errors.name ? "border-red-500" : "border-gray-700"
                  )}
                  placeholder="Enter Username"
                  disabled={isLoading}
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  className={clsx(
                    "w-full px-4 py-2 bg-[#1A1A1F] border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-white",
                    errors.password ? "border-red-500" : "border-gray-700"
                  )}
                  placeholder="Enter password"
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ rotate: showPassword ? 180 : 0 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={clsx(
                "w-full gradient-button",
                isLoading && "opacity-75 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-sm text-gray-400"
          >
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign up
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;