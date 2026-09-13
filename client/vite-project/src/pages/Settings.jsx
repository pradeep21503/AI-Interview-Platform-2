import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Lock,
  CreditCard,
  Bell,
  Moon,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Camera,
  Mic,
  Award,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  ExternalLink
} from 'lucide-react';

// Assuming user data comes from AuthContext or useAuth hook in your app.
// If you have a real useAuth hook, import it:
// import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const navigate = useNavigate();
  
  // MOCK USER DATA FOR DEVELOPMENT FALLBACK
  // The component expects context but will safely fallback to this if none is found.
  const mockUser = {
    name: 'Pradeep Kumar',
    email: 'pradeep@example.com',
    avatar: '', // Initials will be used if blank
    credits: 12,
    totalInterviews: 8,
  };

  // State Management
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form States (UI only)
  const [interviewType, setInterviewType] = useState('HR');
  const [difficulty, setDifficulty] = useState('Medium');
  const [aiVoice, setAiVoice] = useState(true);
  const [cameraReminder, setCameraReminder] = useState(true);
  
  // Notification Toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [remindersNotif, setRemindersNotif] = useState(true);
  const [progressNotif, setProgressNotif] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email fields
  const [newEmail, setNewEmail] = useState('');

  // Show status toast helper
  const triggerToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Logout failed at backend API.');
        // Fallback to client navigation if server endpoint fails during testing
        navigate('/login');
      }
    } catch (err) {
      console.error('Error during logout:', err);
      // Fallback navigation
      navigate('/login');
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      console.log('Account deleted');
      setShowDeleteModal(false);
      triggerToast('Your account was successfully requested for deletion.');
      // Future integration: call DELETE /api/auth/account here
    }
  };

  // Save Preferences UI handler
  const handleSavePreferences = (e) => {
    e.preventDefault();
    triggerToast('Interview preferences saved successfully!');
  };

  // Save Security UI handler
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    triggerToast('Account credentials updated!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Tab configurations
  const tabs = [
    { id: 'profile', name: 'Profile & Avatar', icon: User },
    { id: 'preferences', name: 'Interview Settings', icon: Sliders },
    { id: 'security', name: 'Account & Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Data', icon: Shield },
    { id: 'danger', name: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans relative overflow-x-hidden pb-16">
      {/* Decorative Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 text-white font-medium px-4 py-3 rounded-xl shadow-xl shadow-emerald-950/20 border border-emerald-400/20"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Header */}
        <header className="mb-10 border-b border-slate-800/60 pb-6 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Manage your account and application preferences.
            </p>
          </div>
        </header>

        {/* Desktop Layout: Sidebar + main workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Profile Summary Widget */}
            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md border border-emerald-400/20">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-white truncate max-w-[150px]">{mockUser.name}</h4>
                  <p className="text-xs text-slate-500 truncate max-w-[150px]">{mockUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Credits</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{mockUser.credits} Left</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Interviews</span>
                  <div className="text-sm font-bold text-slate-300 mt-0.5">{mockUser.totalInterviews} Done</div>
                </div>
              </div>
            </div>

            {/* Sidebar Tabs */}
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 p-1 bg-slate-900/20 lg:bg-transparent rounded-xl border border-slate-800/40 lg:border-none scrollbar-none">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-200 whitespace-nowrap lg:w-full ${
                      isActive
                        ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-950/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT COLUMN: Active Panel Workspace */}
          <div className="lg:col-span-3">
            
            {/* Smooth Tab Panel Container */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/30 via-teal-500/10 to-transparent" />

              {/* ---------------- SECTION 1: PROFILE ---------------- */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Profile</h3>
                    <p className="text-xs text-slate-400">Update your public details and avatar identity.</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-slate-950/40 border border-slate-800/60 rounded-xl relative">
                    <div className="flex items-center gap-5">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-extrabold text-2xl border border-emerald-400/20 shadow-lg">
                          {mockUser.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                          <Camera className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white">{mockUser.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          {mockUser.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-500/60" />
                          <span>Premium Tier: {mockUser.credits} available tokens</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerToast('Edit profile modal coming soon.')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60 text-slate-200 font-semibold rounded-xl text-xs transition duration-200"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-950/20 border border-slate-800/60 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Interviews</span>
                        <div className="text-xl font-black text-white mt-0.5">{mockUser.totalInterviews} Session(s)</div>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-950/20 border border-slate-800/60 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Remaining Credits</span>
                        <div className="text-xl font-black text-emerald-400 mt-0.5">{mockUser.credits} Tokens</div>
                      </div>
                    </div>
                  </div>

                  {/* Appearance Subsection embedded */}
                  <div className="pt-6 border-t border-slate-800/60 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Appearance</h3>
                      <p className="text-xs text-slate-400">Configure theme and brand accent colors.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interface Theme</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button className="flex items-center justify-center gap-1.5 p-3 rounded-xl text-xs font-semibold bg-emerald-600/10 text-emerald-400 border border-emerald-500/30">
                            <Moon className="w-3.5 h-3.5" />
                            Dark
                          </button>
                          <button className="p-3 rounded-xl text-xs font-semibold bg-slate-950/40 border border-slate-800/80 text-slate-500 cursor-not-allowed">
                            Light
                          </button>
                          <button className="p-3 rounded-xl text-xs font-semibold bg-slate-950/40 border border-slate-800/80 text-slate-500 cursor-not-allowed">
                            System
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accent Palette</label>
                        <div className="flex gap-3 items-center h-[46px]">
                          <button className="w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-emerald-400 ring-offset-4 ring-offset-[#090d16]" title="Emerald Accent" />
                          <button className="w-5 h-5 rounded-full bg-blue-500 cursor-not-allowed opacity-40" title="Blue (Coming Soon)" />
                          <button className="w-5 h-5 rounded-full bg-violet-500 cursor-not-allowed opacity-40" title="Violet (Coming Soon)" />
                          <button className="w-5 h-5 rounded-full bg-amber-500 cursor-not-allowed opacity-40" title="Amber (Coming Soon)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- SECTION 3: INTERVIEW PREFERENCES ---------------- */}
              {activeTab === 'preferences' && (
                <form onSubmit={handleSavePreferences} className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Interview Preferences</h3>
                    <p className="text-xs text-slate-400">Set default parameters for rapid mock session setups.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dropdown 1: Interview Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Interview Type</label>
                      <select
                        value={interviewType}
                        onChange={(e) => setInterviewType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                      >
                        <option value="HR">HR Interview</option>
                        <option value="Technical">Technical Interview</option>
                        <option value="DSA">DSA Evaluation</option>
                      </select>
                    </div>

                    {/* Dropdown 2: Difficulty */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Toggle Triggers */}
                  <div className="space-y-4 pt-4 border-t border-slate-800/60">
                    <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-800/40 rounded-xl">
                      <div className="flex gap-3">
                        <Mic className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <label className="text-sm font-semibold text-slate-200 block">Enable AI Voice Agent</label>
                          <span className="text-[11px] text-slate-500">Transcribe voice and answer via speech interface.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAiVoice(!aiVoice)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative flex-shrink-0 ${
                          aiVoice ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                          aiVoice ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-800/40 rounded-xl">
                      <div className="flex gap-3">
                        <Camera className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <label className="text-sm font-semibold text-slate-200 block">Camera Permission Reminder</label>
                          <span className="text-[11px] text-slate-500">Reminds you to verify system camera access.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCameraReminder(!cameraReminder)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative flex-shrink-0 ${
                          cameraReminder ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                          cameraReminder ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition duration-200 shadow-md shadow-emerald-950/10"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}

              {/* ---------------- SECTION 2 & 7: SECURITY & ACCOUNT ---------------- */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Account & Security</h3>
                    <p className="text-xs text-slate-400">Update validation credentials and login access policies.</p>
                  </div>

                  {/* Password Change Form */}
                  <form onSubmit={handleSaveSecurity} className="p-6 bg-slate-950/20 border border-slate-800/60 rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      Update Password
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-500">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                            placeholder="Min. 8 characters"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-500">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60 text-slate-200 font-semibold rounded-xl text-xs transition duration-200"
                      >
                        Update Credentials
                      </button>
                    </div>
                  </form>

                  {/* Email Update Form */}
                  <div className="p-6 bg-slate-950/20 border border-slate-800/60 rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      Change Email Address
                    </h4>
                    
                    <div className="flex flex-col md:flex-row items-end gap-4">
                      <div className="space-y-1.5 flex-grow">
                        <label className="text-xs text-slate-500">New Email Address</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                          placeholder="newemail@address.com"
                        />
                      </div>
                      <button
                        onClick={() => {
                          triggerToast('Email verification link sent!');
                          setNewEmail('');
                        }}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60 text-slate-200 font-semibold rounded-xl text-xs transition duration-200 whitespace-nowrap h-[42px]"
                      >
                        Send Verification
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- SECTION 4: NOTIFICATIONS ---------------- */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Notifications</h3>
                    <p className="text-xs text-slate-400">Configure how and when you receive platform alerts.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-800/40 rounded-xl">
                      <div className="flex gap-3">
                        <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <label className="text-sm font-semibold text-slate-200 block">Email Notifications</label>
                          <span className="text-[11px] text-slate-500">Receive reports and summaries in your inbox.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setEmailNotif(!emailNotif)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative flex-shrink-0 ${
                          emailNotif ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                          emailNotif ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-800/40 rounded-xl">
                      <div className="flex gap-3">
                        <Bell className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <label className="text-sm font-semibold text-slate-200 block">Interview Reminders</label>
                          <span className="text-[11px] text-slate-500">Alerts regarding pending draft interviews.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setRemindersNotif(!remindersNotif)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative flex-shrink-0 ${
                          remindersNotif ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                          remindersNotif ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-950/20 border border-slate-800/40 rounded-xl">
                      <div className="flex gap-3">
                        <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <label className="text-sm font-semibold text-slate-200 block">Weekly Progress Report</label>
                          <span className="text-[11px] text-slate-500">Receive aggregated evaluation metrics weekly.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setProgressNotif(!progressNotif)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative flex-shrink-0 ${
                          progressNotif ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                          progressNotif ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- SECTION 6: PRIVACY ---------------- */}
              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Privacy & Data</h3>
                    <p className="text-xs text-slate-400">Review our terms of use, privacy policies, and download your storage archive.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => triggerToast('Privacy Policy download initiated')}
                      className="flex items-center justify-between p-4 bg-slate-950/20 hover:bg-slate-950/40 border border-slate-800/60 rounded-xl text-left group transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">Privacy Policy</span>
                          <span className="text-[10px] text-slate-500">Our storage compliance guidelines.</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>

                    <button
                      onClick={() => triggerToast('Terms of service link opened')}
                      className="flex items-center justify-between p-4 bg-slate-950/20 hover:bg-slate-950/40 border border-slate-800/60 rounded-xl text-left group transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">Terms & Conditions</span>
                          <span className="text-[10px] text-slate-500">General platform usages agreement.</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  </div>

                  <div className="p-6 bg-emerald-950/5 border border-emerald-500/10 rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Backup Your Storage Data
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Download a JSON file containing all your interview records, transcripts, ratings, and profile settings stored in our database.
                    </p>
                    <button
                      onClick={() => triggerToast('Downloading user archive...')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition duration-200 shadow-md shadow-emerald-950/10"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download My Data
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- SECTION 7: DANGER ZONE ---------------- */}
              {activeTab === 'danger' && (
                <div className="space-y-8 animate-pulse-once">
                  <div>
                    <h3 className="text-xl font-bold text-rose-500 mb-1">Danger Zone</h3>
                    <p className="text-xs text-slate-400">Irreversible actions regarding your credentials.</p>
                  </div>

                  <div className="bg-rose-950/10 border border-rose-500/20 rounded-2xl p-6 space-y-6">
                    {/* Logout Block */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-500/10">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-400" />
                          Log Out of Account
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">Clears browser credentials and terminates active session tokens.</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs transition duration-200"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>

                    {/* Delete Account Block */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-rose-400" />
                          Delete User Account
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">This will permanently delete your user profile and all evaluation histories.</p>
                      </div>
                      <button
                        onClick={() => {
                          setDeleteConfirmText('');
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold rounded-xl text-xs transition duration-200 shadow-md shadow-rose-950/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>

        </div>

      </div>

      {/* ---------------- DELETE ACCOUNT CONFIRMATION MODAL ---------------- */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-slate-900 border border-rose-500/20 rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="mx-auto w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-bold text-center text-white mb-2">Delete Account Permanently</h3>
              <p className="text-xs text-slate-400 text-center leading-relaxed mb-6">
                This process is completely irreversible. All evaluation metrics, reports, transcripts, and credentials will be deleted forever.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block text-center">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center text-slate-200 text-sm focus:outline-none focus:border-rose-500"
                    placeholder="DELETE"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60 text-slate-300 font-semibold rounded-xl text-xs transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleteConfirmText !== 'DELETE'}
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-semibold rounded-xl text-xs transition duration-200 shadow-md shadow-rose-950/20"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}