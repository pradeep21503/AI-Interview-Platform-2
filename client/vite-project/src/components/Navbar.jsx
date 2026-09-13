import { useEffect, useRef, useState } from "react"
import { BsRobot, BsCoin } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi"
import { FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiZap,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi"
import AuthModal from "./AuthModal.jsx";
function Navbar({user,setuser,showAuthModal, setShowAuthModal}) {
  const [openMenu, setOpenMenu] = useState(null)
  const serverurl = "http://localhost:8000";
 const navigate = useNavigate();


const handleProtectedClick = (path) => {
  if (!user) {
    setShowAuthModal(true);
    return;
  }
   navigate(path);

 
};

  const toggle = (menu) =>{
    if (!user) {
    setShowAuthModal(true);
    return;
  }

    setOpenMenu((prev) => (prev === menu ? null : menu))

  }
  const logout = async ()=>{
      const res = await fetch(serverurl+"/api/auth/logout",{
        method:"POST",
        credentials:'include',
      })
      const data = await res.json();
      if(data.sucess){
        setuser(null);
        setOpenMenu(null);
        return ;
      }


  }

  return (
    <header className="sticky top-5 z-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div
        
          className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-3xl px-7 py-4 flex items-center justify-between"
        >
          {/* Logo */}
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg">
              <BsRobot size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">InterviewIQ</h1>
              <p className="text-xs text-gray-500">AI Interview Assistant</p>
            </div>
          </div>

          {/* Center */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-2 py-2">
            <button
              className="px-5 py-2 rounded-full bg-white shadow text-sm font-medium"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              className="px-5 py-2 rounded-full text-gray-500 hover:text-black transition"
              onClick={() => handleProtectedClick("/interview")}
            >
              Interviews
            </button>

            <button
              className="px-5 py-2 rounded-full text-gray-500 hover:text-black transition"
              onClick={() => handleProtectedClick("/history")}
            >
              History
            </button>

            {/* Pricing dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle("pricing")}
                aria-haspopup="menu"
                aria-expanded={openMenu === "pricing"}
                className={`flex items-center gap-1 px-5 py-2 rounded-full transition ${
                  openMenu === "pricing"
                    ? "bg-white shadow text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Pricing
                <FiChevronDown
                  size={15}
                  className={`transition-transform ${
                    openMenu === "pricing" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openMenu === "pricing" && (
                <div
                  role="menu"
                  className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.12)] p-2"
                >
                  <button
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50 transition text-left"
                  >
                    <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <BsCoin size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">Buy More Credits</span>
                      <span className="block text-xs text-gray-500">Top up your balance</span>
                    </span>
                  </button>
                  <button
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition text-left"
                  >
                    <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <FiTrendingUp size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">Upgrade Plan</span>
                      <span className="block text-xs text-gray-500">Unlock Pro features</span>
                    </span>
                  </button>
                  <button
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition text-left"
                  >
                    <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <FiCreditCard size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">Billing &amp; Plans</span>
                      <span className="block text-xs text-gray-500">Manage subscription</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
         

            <button className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-2xl hover:bg-slate-200 transition">
              <BsCoin className="text-yellow-500" />
              <span className="font-semibold">{user?.credits}</span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle("profile")}
                aria-haspopup="menu"
                aria-expanded={openMenu === "profile"}
                className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:scale-105 transition"
                >
                  {user ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <FaUserCircle size={22} />
                  )}
              </button>

              {openMenu === "profile" && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-60 bg-white rounded-2xl border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.12)] p-2"
                >
                  {/* User header */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-1">
                    <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <FaUserCircle size={20} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">  {user?.name || "Guest"}</span>
                      <span className="block text-xs text-gray-500">  {user?.email || "Not Logged In"}</span>
                    </span>
                  </div>
                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    role="menuitem"
                    onClick={()=>navigate("/settings")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition text-left text-sm font-medium"
                  >
                    <FiSettings size={17} className="text-slate-600" />
                    Settings
                  </button>
                
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    role="menuitem"
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition text-left text-sm font-medium"
                  >
                    <FiLogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AuthModal showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal}/>

    </header>
  )
}

export default Navbar
