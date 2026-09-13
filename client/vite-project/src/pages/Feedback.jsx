
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,

  AlertTriangle,
  Lightbulb,
  Target,
  CheckCircle,
  TrendingUp,
  Loader2,
  RefreshCw,
  Home,
  History
} from 'lucide-react';

export default function Feedback() {
  const { sessionid } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/hr/feedback/${sessionid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feedback (Status: ${response.status})`);
      }

      const data = await response.json();
      
      // Handle both API response formats just in case ("sucess" with single 'c' or "success")
      if (data.sucess || data.success) {
        setFeedback(data.feedback);
      } else {
        throw new Error(data.message || 'API returned an unsuccessful response status.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while loading your feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionid) {
      fetchFeedback();
    } else {
      setError('Invalid Session ID. Please check your link.');
      setLoading(false);
    }
  }, [sessionid]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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

  // Helper function to dynamically theme scores
  const getScoreStyle = (score) => {
    if (score >= 90) {
      return {
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        stroke: '#4ade80',
        label: 'Excellent',
        accent: 'green',
        progressBg: 'bg-green-500'
      };
    } else if (score >= 70) {
      return {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        stroke: '#10b981',
        label: 'Good',
        accent: 'emerald',
        progressBg: 'bg-emerald-500'
      };
    } else if (score >= 50) {
      return {
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        stroke: '#f97316',
        label: 'Average',
        accent: 'orange',
        progressBg: 'bg-orange-500'
      };
    } else {
      return {
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        stroke: '#f43f5e',
        label: 'Needs Improvement',
        accent: 'rose',
        progressBg: 'bg-rose-500'
      };
    }
  };

  // 1. Loading State Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative Glow Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center space-y-6 z-10">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin stroke-[1.5]" />
            <div className="absolute w-20 h-20 border-2 border-emerald-500/20 rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold tracking-wide text-emerald-400 animate-pulse">Analyzing Performance</h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
           Generating your interview feedback and performance analysis...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Beautiful Error State Card
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-8 text-center shadow-2xl relative z-10">
          <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Evaluation Failed</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">{error}</p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchFeedback}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-emerald-950/20"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-300 font-semibold rounded-xl transition duration-200"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  const overall = getScoreStyle(feedback.overallscore);
  const strokeDashoffset = 440 - (440 * feedback.overallscore) / 100;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans relative overflow-x-hidden pb-16">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[15%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Layout Wrap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800/60 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm tracking-wider uppercase mb-1">
              <Award className="w-4 h-4" />
              Evaluation Completed
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              🎉 Interview Completed
            </h1>
            <p className="text-slate-400 mt-2 text-base font-normal max-w-xl">
              Your AI interview has been successfully evaluated.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 py-2.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium rounded-xl transition duration-200 text-sm shadow-md"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition duration-200 text-sm shadow-lg shadow-emerald-950/20"
            >
              <History className="w-4 h-4" />
              Interview History
            </Link>
          </div>
        </header>

        {/* Dashboard 2-Column Responsive Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* COLUMN 1: Scores and Metrics */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Large Overall Score Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              
              <div className="w-full flex items-center justify-between text-slate-400 text-xs font-semibold tracking-wider uppercase mb-6">
                <span>Overall Performance</span>
                <TrendingUp className={`w-4 h-4 ${overall.color}`} />
              </div>

              {/* Big Circular Score Display */}
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Base Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#1e293b"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Dynamic Color Ring */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={overall.stroke}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="440"
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Score numbers */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {feedback.overallscore}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
                    / 100
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase ${overall.bg} ${overall.color} border ${overall.border}`}>
                  {overall.label}
                </span>
                <p className="text-xs text-slate-500 font-medium px-4">
                  Aggregated index based on your interview answers and presentation skills.
                </p>
              </div>
            </motion.div>

            {/* Performance Cards */}
            <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-slate-500 tracking-wider uppercase pl-1">
          Performance Summary
       </h3>
                    
              <div className="grid grid-cols-1 gap-4">
                
    

          

            

                {/* Overall Score Metric Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${overall.bg} border ${overall.border} ${overall.color} rounded-xl`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-200 text-sm">Overall</h4>
                        <p className="text-[11px] text-slate-500">Aggregated Metric</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${overall.color}`}>{feedback.overallscore}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${feedback.overallscore}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                      className={`h-full ${overall.progressBg}`}
                    />
                  </div>
                </motion.div>

              </div>
            </div>

          </div>

          {/* COLUMN 2 & 3: Details & Analysis */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Strengths & Weaknesses Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths Section */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-400 text-lg">Key Strengths</h3>
                    <p className="text-[11px] text-emerald-500/80">Identified positive factors</p>
                  </div>
                </div>
                
                <ul className="space-y-3.5 flex-grow">
                  {feedback.strengths && feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 mt-1 flex items-center justify-center w-5 h-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-300 text-sm leading-relaxed font-normal">
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Weaknesses Section */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-orange-950/10 border border-orange-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-400 text-lg">Weaknesses</h3>
                    <p className="text-[11px] text-orange-500/80">Growth and improvement points</p>
                  </div>
                </div>
                
                <ul className="space-y-3.5 flex-grow">
                  {feedback.weaknesses && feedback.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 mt-1 flex items-center justify-center w-5 h-5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-300 text-sm leading-relaxed font-normal">
                        {weakness}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>

            {/* Suggestions Section */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-blue-950/15 border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-400 text-lg">Actionable Suggestions</h3>
                  <p className="text-[11px] text-blue-500/80">Tailored practical recommendations</p>
                </div>
              </div>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.suggestions && feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/40 hover:border-blue-500/10 transition-colors group">
                    <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg group-hover:rotate-12 transition-transform">
                      <Lightbulb className="w-4 h-4" />
                    </span>
                    <span className="text-slate-300 text-sm leading-relaxed font-normal">
                      {suggestion}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Future Roadmap Section */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 text-emerald-400 border border-emerald-500/25 rounded-xl">
                  <TrendingUp className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">Future Roadmap</h3>
                  <p className="text-xs text-slate-400">Path to mastery & next milestones</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/40 via-blue-500/20 to-transparent ml-1 pointer-events-none" />
                <p className="text-slate-300 text-base leading-relaxed pl-6 font-normal whitespace-pre-line">
                  {feedback.roadmap}
                </p>
              </div>
            </motion.div>

          </div>

        </motion.div>

      </div>
    </div>
  );
}
