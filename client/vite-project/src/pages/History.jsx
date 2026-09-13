import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Clock,
  BarChart3,
  Calendar,
  Users,
  ChevronRight,
  ClipboardList,
  ArrowLeft,
  Plus,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/interview/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch history (Status: ${response.status})`);
      }

      const data = await response.json();
      
      // Supporting both spellings ("sucess" from API specification and standard "success")
      if (data.sucess || data.success) {
        setHistory(data.history || []);
      } else {
        throw new Error(data.message || 'API returned an unsuccessful status.');
      }
    } catch (err) {
      setError(err.message || 'Could not load your interview history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Format date helper to output e.g. "10 Jul 2026"
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper for status badge styling
  const getStatusBadgeStyle = (status) => {
    const normStatus = (status || '').toLowerCase();
    if (normStatus === 'completed') {
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    } else if (normStatus === 'active' || normStatus === 'in_progress') {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    } else {
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Helper for score badge styling
  const getScoreStyle = (score) => {
    if (score === undefined || score === null) {
      return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
    }
    if (score >= 90) {
      return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    } else if (score >= 70) {
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    } else if (score >= 50) {
      return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    } else {
      return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    }
  };

  // Framer Motion Animation Configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Loading UI Component
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex flex-col items-center space-y-4 z-10">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin stroke-[1.5]" />
          <p className="text-slate-400 text-sm tracking-wide">Retrieving interview records...</p>
        </div>
      </div>
    );
  }

  // Error State Component
  if (error) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-8 text-center shadow-2xl relative z-10">
          <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">History Load Error</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">{error}</p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchHistory}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-emerald-950/20"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-300 font-semibold rounded-xl transition duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans relative overflow-x-hidden pb-16">
      {/* Background Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Dashboard Section */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-800/60 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Interview History
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm font-normal">
              Review all your previous AI interviews.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium rounded-xl transition duration-200 text-sm shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => navigate('/interview/new')}
              className="flex items-center gap-2 py-2.5 px-4.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl transition duration-200 text-sm shadow-lg shadow-emerald-950/20"
            >
              <Plus className="w-4 h-4" />
              New Interview
            </button>
          </div>
        </header>

        {/* Empty State vs Cards Grid Rendering */}
        {history.length === 0 ? (
          /* Empty State UI */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto mt-16 text-center bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-10 shadow-2xl relative"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="mx-auto w-16 h-16 bg-slate-800/50 border border-slate-700/50 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <ClipboardList className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">No interviews yet.</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              You haven't conducted any mock interviews on this account. Take your first AI interview to evaluate your strengths.
            </p>
            
            <button
              onClick={() => navigate('/interview/new')}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-emerald-950/20"
            >
              Start Interview
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          /* Responsive Layout Grid of History Cards */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {history.map((session) => {
              const score = session.feedback?.overallscore;
              const scoreBadge = getScoreStyle(score);
              const statusBadge = getStatusBadgeStyle(session.status);

              return (
                <motion.div
                  key={session._id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group transition-all duration-200"
                >
                  {/* Top Color Gradient Border Accent */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-500/50 via-emerald-400/20 to-transparent group-hover:from-emerald-400 group-hover:via-emerald-500/40 transition-all duration-300" />
                  
                  <div>
                    {/* Top Row: Type and Status */}
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <div>
                        <h4 className="font-extrabold text-white text-base tracking-tight group-hover:text-emerald-300 transition-colors">
                          {session.interviewtype || 'HR Interview'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-500 font-medium">Difficulty:</span>
                          <span className="text-[11px] text-emerald-400/90 font-semibold uppercase tracking-wider bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                            {session.difficulty || 'Medium'}
                          </span>
                        </div>
                      </div>
                      
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${statusBadge}`}>
                        {session.status || 'Completed'}
                      </span>
                    </div>

                    {/* Mid Details Row (Mins, Date, Experience) */}
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 my-5 text-slate-400 border-t border-b border-slate-800/60 py-4">
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs truncate">{session.experience || 'Fresher'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs truncate">{session.duration ? `${session.duration} mins` : '30 mins'}</span>
                      </div>

                      <div className="flex items-center gap-2.5 col-span-2">
                        <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs">{formatDate(session.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Area: Score & View Button */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Score</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        {score !== undefined && score !== null ? (
                          <>
                            <span className={`text-xl font-bold tracking-tight ${scoreBadge.text}`}>
                              {score}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">/ 100</span>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 tracking-wider">Pending</span>
                        )}
                      </div>
                    </div>

                  {session.status === "completed" ? (
  <button
    onClick={() => navigate(`/feedback/${session._id}`)}
    className="flex items-center gap-1.5 py-2 px-4 bg-slate-800/80 hover:bg-emerald-600 hover:text-white border border-slate-700/60 hover:border-emerald-500 text-slate-200 text-xs font-bold rounded-xl transition duration-200"
  >
    View Report
    <ChevronRight className="w-3.5 h-3.5" />
  </button>
) : (
  <button
    onClick={() => navigate(`/interview/${session._id}`)}
    className="flex items-center gap-1.5 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition duration-200"
  >
    Continue Interview
    <ChevronRight className="w-3.5 h-3.5" />
  </button>
)}
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </div>
  );
}