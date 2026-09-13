import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  GraduationCap,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  X,
  Loader2,
  Check,
  Cpu,
  Brain,
  Shield
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
const LANGUAGES = [
  { id: 'cpp', name: 'C++', desc: 'Modern C++17 compiler', color: 'from-blue-500 to-indigo-500', textClass: 'text-blue-400', bgClass: 'bg-blue-400/10 border-blue-400/20' },
  { id: 'java', name: 'Java', desc: 'Java 17 OpenJDK runtime', color: 'from-orange-500 to-red-500', textClass: 'text-orange-400', bgClass: 'bg-orange-400/10 border-orange-400/20' },
  { id: 'python', name: 'Python', desc: 'Python 3.11 optimized interpreter', color: 'from-yellow-400 to-amber-500', textClass: 'text-amber-400', bgClass: 'bg-amber-400/10 border-amber-400/20' },
  { id: 'javascript', name: 'JavaScript', desc: 'Node.js 20 modern runtime', color: 'from-yellow-400 to-emerald-400', textClass: 'text-yellow-300', bgClass: 'bg-yellow-300/10 border-yellow-300/20' }
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const EXPERIENCE_LEVELS = ['0–1 Years', '2–4 Years', '5+ Years'];
const DURATIONS = [
  { value: 30, label: '30 Minutes', questions: 1, tag: 'Quick Session' },
  { value: 45, label: '45 Minutes', questions: 2, tag: 'Standard Session' },
  { value: 60, label: '60 Minutes', questions: 3, tag: 'Deep Dive' }
];

const LOADING_STEPS = [
  'Analyzing your configuration...',
  'Configuring the LLM evaluation agent...',
  'Generating customized coding problems...',
  'Spinning up secure compiler sandbox...',
  'Readying final testing harness...'
];

export default function DsaSetupPage() {
  // Page states
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
};
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[2]); // Default Python
  const [difficulty, setDifficulty] = useState('Medium');
  const [experience, setExperience] = useState('2–4 Years');
  const [duration, setDuration] = useState(DURATIONS[1]); // Default 45m
  
  // UI states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cycling loading steps simulation
  useEffect(() => {
    let interval;
    if (isPreparing) {
      interval = setInterval(() => {
        setLoadingStepIndex((prevIndex) => {
          if (prevIndex < LOADING_STEPS.length - 1) {
            return prevIndex + 1;
          }
          return prevIndex; // Hold on last step
        });
      }, 1500);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isPreparing]);

  const handleStartRequest = () => {
    setIsModalOpen(true);
  };

const handleConfirm = async () => {
    try {
        setIsPreparing(true);

        const response = await fetch(
            "http://localhost:8000/api/dsa/start",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    language: selectedLanguage.id,
                    difficulty,
                    experience,
                    duration: duration.value,
                }),
            }
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        navigate(`/dsa/interview/${data.sessionId}`);
    } catch (err) {
        console.error(err);

        alert(err.message);

        setIsPreparing(false);
    }
};

  const handleCancel = () => {
    // Reset state & close modal
    setIsModalOpen(false);
    setTimeout(() => {
      setIsPreparing(false);
      setLoadingStepIndex(0);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[1200px] z-10 flex flex-col gap-6"
      >
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT SIDE: Configuration Card */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl shadow-black/40">
              
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <Brain className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                      DSA Interview Setup
                    </h1>
                    <p className="text-sm text-slate-400">
                      Configure your AI-powered coding interview.
                    </p>
                  </div>
                </div>

                {/* Form Elements Container */}
                <div className="space-y-6">
                  
                  {/* Programming Language Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" />
                      Programming Language
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-slate-900/60 hover:bg-slate-900/80 border border-white/[0.06] hover:border-white/[0.12] rounded-xl text-left transition-all duration-200 cursor-pointer shadow-inner focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedLanguage.color} shadow-sm`} />
                          <div>
                            <span className="text-sm font-medium text-white">{selectedLanguage.name}</span>
                            <span className="text-xs text-slate-500 ml-2 hidden sm:inline">— {selectedLanguage.desc}</span>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Options overlay */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 w-full mt-2 bg-slate-900/95 border border-white/[0.08] rounded-xl shadow-2xl p-1.5 backdrop-blur-xl"
                          >
                            {LANGUAGES.map((lang) => (
                              <button
                                key={lang.id}
                                onClick={() => {
                                  setSelectedLanguage(lang);
                                  setIsDropdownOpen(false);
                                }}
                                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/[0.04] transition-all cursor-pointer group"
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${lang.color}`} />
                                  <div>
                                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{lang.name}</p>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{lang.desc}</p>
                                  </div>
                                </div>
                                {selectedLanguage.id === lang.id && (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Difficulty Segmented Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-slate-400" />
                      Difficulty
                    </label>
                    <div className="relative flex p-1 bg-slate-900/40 border border-white/[0.05] rounded-xl backdrop-blur-sm">
                      {DIFFICULTIES.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className="flex-1 py-2.5 text-sm font-medium rounded-lg relative transition-colors duration-200 cursor-pointer focus:outline-none"
                        >
                          {difficulty === diff && (
                            <motion.div
                              layoutId="difficulty-pill"
                              className="absolute inset-0 bg-white/[0.06] border border-white/[0.08] shadow-sm rounded-lg"
                              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            />
                          )}
                          <span className={`relative z-10 transition-colors duration-200 ${difficulty === diff ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
                            {diff}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience Segmented Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      Experience Level
                    </label>
                    <div className="relative flex p-1 bg-slate-900/40 border border-white/[0.05] rounded-xl backdrop-blur-sm">
                      {EXPERIENCE_LEVELS.map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setExperience(exp)}
                          className="flex-1 py-2.5 text-sm font-medium rounded-lg relative transition-colors duration-200 cursor-pointer focus:outline-none"
                        >
                          {experience === exp && (
                            <motion.div
                              layoutId="experience-pill"
                              className="absolute inset-0 bg-white/[0.06] border border-white/[0.08] shadow-sm rounded-lg"
                              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            />
                          )}
                          <span className={`relative z-10 transition-colors duration-200 ${experience === exp ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
                            {exp}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Custom Cards */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Interview Duration
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {DURATIONS.map((dur) => {
                        const isSelected = duration.value === dur.value;
                        return (
                          <button
                            key={dur.value}
                            onClick={() => setDuration(dur)}
                            className={`relative p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer group focus:outline-none flex flex-col items-center justify-center ${
                              isSelected
                                ? 'border-emerald-500/50 bg-emerald-500/[0.03] shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                                : 'border-white/[0.05] bg-slate-900/10 hover:border-white/[0.12] hover:bg-white/[0.02]'
                            }`}
                          >
                            <span className="text-xs text-slate-500 font-medium group-hover:text-slate-400 transition-colors mb-1">
                              {dur.tag}
                            </span>
                            <span className={`text-xl font-bold transition-colors ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {dur.value}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                              Mins
                            </span>
                            {isSelected && (
                              <motion.div
                                layoutId="duration-border-glow"
                                className="absolute inset-0 border border-emerald-500 rounded-xl pointer-events-none"
                                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Summary Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full shadow-2xl shadow-black/40 relative overflow-hidden">
              {/* Subtle top decoration */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-indigo-500/20" />
              
              <div>
                {/* Heading */}
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400">Live Configuration Summary</span>
                </div>

                <div className="space-y-1">
                  
                  {/* Lang row */}
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Code2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Programming Language</span>
                    </div>
                    <div className="overflow-hidden h-6 relative flex items-center justify-end min-w-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedLanguage.id}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -15, opacity: 0 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="flex items-center gap-2"
                        >
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedLanguage.bgClass} ${selectedLanguage.textClass}`}>
                            {selectedLanguage.name}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Difficulty row */}
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Cpu className="w-4 h-4" />
                      <span className="text-sm font-medium">Difficulty Level</span>
                    </div>
                    <div className="overflow-hidden h-6 relative flex items-center justify-end min-w-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={difficulty}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -15, opacity: 0 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className={`text-sm font-semibold ${
                            difficulty === 'Easy' ? 'text-emerald-400' :
                            difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
                          }`}
                        >
                          {difficulty}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Experience row */}
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-sm font-medium">Target Experience</span>
                    </div>
                    <div className="overflow-hidden h-6 relative flex items-center justify-end min-w-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={experience}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -15, opacity: 0 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="text-sm font-semibold text-slate-200"
                        >
                          {experience}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Duration row */}
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Session Duration</span>
                    </div>
                    <div className="overflow-hidden h-6 relative flex items-center justify-end min-w-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={duration.value}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -15, opacity: 0 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="text-sm font-semibold text-slate-200"
                        >
                          {duration.value} Minutes
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Estimated Questions row */}
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Code2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Estimated Questions</span>
                    </div>
                    <div className="overflow-hidden h-6 relative flex items-center justify-end min-w-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={duration.questions}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -15, opacity: 0 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="text-sm font-semibold text-emerald-400"
                        >
                          {duration.questions} {duration.questions === 1 ? 'Problem' : 'Problems'}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Interview Type row */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Interview Type</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      AI Powered
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom informational badge */}
              <div className="mt-8 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-start gap-3">
                <Brain className="w-5 h-5 text-emerald-400/80 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-slate-400">
                  The AI evaluation system analyzes key metrics including correctness, time/space complexity, syntax efficiency, and runtime optimization.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM ACTIONS BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 p-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl backdrop-blur-xl">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-slate-300">Ready to begin?</h3>
            <p className="text-xs text-slate-500">You can cancel or configure a different session at any point.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.04] text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartRequest}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-[0_8px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_35px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              Start Interview
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </motion.button>
          </div>
        </div>

      </motion.div>

      {/* CONFIRMATION MODAL & LOADING OVERLAY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={!isPreparing ? handleCancel : undefined}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className="bg-slate-900/90 border border-white/[0.08] shadow-2xl rounded-2xl max-w-md w-full p-6 relative overflow-hidden backdrop-blur-xl z-10"
            >
              
              {/* Border shine effect */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

              <AnimatePresence mode="wait">
                {!isPreparing ? (
                  /* MODAL CONTENTS: CONFIGURATION CONFIRMATION */
                  <motion.div
                    key="confirm-content"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-lg font-bold text-white">Start Interview?</h2>
                      </div>
                      <button 
                        onClick={handleCancel}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-slate-400 mb-6">
                      You are about to launch a customized AI coding session. Please confirm your configurations:
                    </p>

                    {/* Summary list */}
                    <div className="space-y-3 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Language</span>
                        <span className="font-semibold text-slate-200">{selectedLanguage.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Difficulty</span>
                        <span className="font-semibold text-emerald-400">{difficulty}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Experience Target</span>
                        <span className="font-semibold text-slate-200">{experience}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Duration Limit</span>
                        <span className="font-semibold text-slate-200">{duration.value} Minutes</span>
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancel}
                        className="flex-1 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold rounded-xl shadow-[0_5px_15px_rgba(16,185,129,0.2)] hover:from-emerald-400 hover:to-teal-400 transition-colors cursor-pointer"
                      >
                        Confirm
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  /* MODAL CONTENTS: LOADING LOADER STATE */
                  <motion.div
                    key="loading-content"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    {/* Ring Loader */}
                    <div className="relative mb-6 flex items-center justify-center">
                      {/* Pulse Circle */}
                      <div className="absolute inset-0 w-16 h-16 bg-emerald-500/10 rounded-full animate-ping pointer-events-none" />
                      {/* Rotating ring */}
                      <Loader2 className="w-16 h-16 text-emerald-400 animate-spin stroke-[1.5]" />
                      {/* Internal Icon */}
                      <Brain className="absolute w-6 h-6 text-emerald-400/80" />
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">
                      Preparing your AI Interview...
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                      Please wait...
                    </p>

                    {/* Step indicator tracker */}
                    <div className="w-full max-w-[280px]">
                      <div className="h-1 bg-white/[0.04] border border-white/[0.02] rounded-full overflow-hidden mb-3">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          initial={{ width: '0%' }}
                          animate={{ width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <div className="h-4 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={loadingStepIndex}
                            initial={{ y: 8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400/90"
                          >
                            {LOADING_STEPS[loadingStepIndex]}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
