import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUser,
} from "react-icons/hi";
import { BsRobot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Auth({setuser}) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const[name,setname]  =useState("")
  const[email,setemail] = useState("")
  const [password,setpassword] = useState("")
  const [confirmpassword,setconfirmpassword]  = useState("")
  const navigate = useNavigate();
  const serverurl = "http://localhost:8000"
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLogin) {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(serverurl + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!data.sucess) {
        alert(data.message);
        return;
      }

      console.log(data);
      setuser(data.user)
      navigate("/")
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  } else {
    if (!name || !email || !password || !confirmpassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(serverurl + "/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!data.sucess) {
        alert(data.message);
        return;
      }

      console.log(data);
      alert("Registration successful!");
      setuser(data.user)
      navigate("/")
    
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl bg-white rounded-[36px] overflow-hidden shadow-2xl grid md:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden md:flex bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-white/10 p-3 rounded-xl">
                <BsRobot size={24} />
              </div>

              <h2 className="text-2xl font-bold">InterviewIQ.AI</h2>
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-8">
              Master Every
              <br />
              Technical
              <br />
              Interview
            </h1>

            <p className="text-gray-300 text-lg mb-10">
              Prepare smarter with AI-powered interviews and personalized
              feedback.
            </p>

            <div className="space-y-5 text-gray-300">
              <div>✔ AI Mock Interviews</div>
              <div>✔ Coding Challenges</div>
              <div>✔ Resume Analysis</div>
              <div>✔ Instant Feedback</div>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            "Practice today. Get hired tomorrow."
          </p>
        </div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-14"
        >
          <div className="flex items-center gap-3 justify-center mb-10">
            <div className="bg-black text-white p-3 rounded-xl">
              <BsRobot size={22} />
            </div>

            <h2 className="font-bold text-2xl">InterviewIQ.AI</h2>
          </div>

          <h1 className="text-4xl font-bold text-center">
            {isLogin ? "Welcome Back 👋" : "Create Account"}
          </h1>

          <p className="text-gray-500 text-center mt-3 mb-10">
            {isLogin
              ? "Sign in to continue your interview preparation."
              : "Create your account to start your AI interview journey."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <HiOutlineUser
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                  onChange={(e)=>setname(e.target.value)}
                  value= {name}

                />
              </div>
            )}

            <div className="relative">
              <HiOutlineMail
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                onChange={(e)=>setemail(e.target.value)}
                  value= {email}
              />
            </div>

            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                 onChange={(e)=>setpassword(e.target.value)}
                  value= {password}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <HiOutlineLockClosed
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                  onChange={(e)=>setconfirmpassword(e.target.value)}
                  value= {confirmpassword}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" />
                  Remember Me
                </label>

                <button
                  type="button"
                  className="text-emerald-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg transition"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <p className="text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-emerald-600 font-semibold hover:underline"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;