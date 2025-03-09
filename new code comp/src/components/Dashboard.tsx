import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken'); // Get stored API token
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }

                const data = await response.json();
                setUser({ username: data.name });
            } catch (error) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("authToken"); // Remove invalid token
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove token on logout
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#0F0F13] flex flex-col">
            <nav className="bg-[#1A1A1F] shadow-lg border-b border-[#2A2A35]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-xl font-semibold text-white"
                        >
                            Dashboard
                        </motion.h1>
                        <motion.button
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none transition-all"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </motion.button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-[32rem]"
                >
                    <div className="card p-8">
                        <div className="card-border"></div>
                        <div className="text-center">
                            <motion.h2
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-3xl font-bold text-white mb-4"
                            >
                                Welcome, {user ? user.username : "Loading..."}!
                            </motion.h2>
                            <motion.p
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-gray-300 mb-8"
                            >
                                Your premium dashboard is ready. Enjoy all the exclusive features!
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
