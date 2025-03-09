import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, Mail, AlertCircle, Loader2, LockKeyhole, SquareUserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { RetroGrid } from './ui/retro-grid';

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[!@#$%^&*]/.test(pass)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setPasswordStrength(validatePassword(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to register");
        }

        toast.success("Account created successfully!");

        setTimeout(() => {
            navigate("/login");
        }, 2000);
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
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Sign up to get started</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A1A1F] border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-white"
                  placeholder="Enter name"
                  disabled={isLoading}
                />
                <SquareUserRound className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  className={clsx(
                    "w-full px-4 py-2 bg-[#1A1A1F] border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-white",
                    errors.email ? "border-red-500" : "border-gray-700"
                  )}
                  placeholder="Enter email"
                  disabled={isLoading}
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
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
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2"
              >
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={clsx(
                        "h-2 flex-1 rounded-full",
                        i < passwordStrength ? "bg-purple-500" : "bg-gray-700"
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Password strength: {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="mt-1 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  className={clsx(
                    "w-full px-4 py-2 bg-[#1A1A1F] border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-white",
                    errors.confirmPassword ? "border-red-500" : "border-gray-700"
                  )}
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ rotate: showConfirmPassword ? 180 : 0 }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword}
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
                "Create Account"
              )}
            </motion.button>
          </form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center text-sm text-gray-400"
          >
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;