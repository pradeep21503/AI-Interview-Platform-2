import { motion } from "framer-motion";
import {Sparkles,Play,LayoutDashboard,
  FileText,
  Mic,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Waveform() {
  const bars = [0.4, 0.7, 1, 0.6, 0.85, 0.45, 0.9, 0.55, 0.75, 0.35, 0.8, 0.5];
  return (
    <div className="flex h-10 items-center gap-1">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-emerald-400 animate-wave"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

function ProgressRing({ value = 87 }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{value}</span>
        <span className="text-[10px] font-medium text-gray-400">score</span>
      </div>
    </div>
  );
}

function FloatingCard({
  className = "",
  children,
  delay = 0,
  floatClass = "animate-float-slow",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass shadow-float rounded-2xl ${floatClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero({user, showAuthModal, setShowAuthModal }) {
    const handleProtectedNavigation = (path) => {
    if (user) {
        navigate(path);
    } else {
        setShowAuthModal(true);
    }
};
 const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden px-5 pt-28 pb-20 sm:px-8 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <motion.div  initial="hidden" animate="visible" className="flex flex-col gap-7">
          <motion.div
          
            className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-soft backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Interview Coach
          </motion.div>

          <motion.h1
         
            className="text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Ace Every Interview with{" "}
            <span className="relative inline-flex">
              <span className="text-gradient-emerald">AI</span>
              <span className="absolute -inset-1 -z-10 rounded-full bg-emerald-400/30 blur-lg" />
            </span>
          </motion.h1>

          <motion.p className="max-w-xl text-lg text-gray-500">
            Practice HR, Technical, DSA, and Resume-based interviews with realistic AI conversations
            and get instant, actionable feedback on your answers, confidence, and communication.
          </motion.p>

         <motion.div className="flex flex-wrap items-center gap-4">
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleProtectedNavigation("/interview")}
            className="group inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition-colors hover:bg-gray-800"
        >
            <Play className="h-4 w-4 fill-emerald-400 text-emerald-400" />
            Start Interview
        </motion.button>

        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleProtectedNavigation("/dashboard")}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-gray-700 shadow-soft backdrop-blur transition-colors hover:border-emerald-200 hover:text-emerald-700"
        >
            <LayoutDashboard className="h-4 w-4" />
            View Dashboard
        </motion.button>
        </motion.div>

          <motion.div  className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {["bg-emerald-400", "bg-teal-400", "bg-cyan-400", "bg-green-400"].map((c, i) => (
                <span key={i} className={`h-8 w-8 rounded-full border-2 border-white ${c}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">100K+</span> interviews practiced
            </p>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto h-[520px] w-full max-w-lg lg:h-[560px]">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-400/20 via-transparent to-emerald-200/10 blur-2xl" />

          <FloatingCard className="absolute left-0 top-4 w-64 p-5" delay={0.2}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Resume Upload</p>
                  <p className="text-[10px] text-gray-400">resume.pdf</p>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
            </div>
            <p className="mt-1.5 text-[10px] text-gray-400">Parsing 85% complete</p>
          </FloatingCard>

          <FloatingCard
            className="absolute right-0 top-0 w-56 p-5"
            delay={0.35}
            floatClass="animate-float-slower"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              AI Interview Score
            </p>
            <div className="mt-2 flex items-center gap-3">
              <ProgressRing value={87} />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-gray-900">87</span>
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> +12%
                </span>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard
            className="absolute left-4 top-44 w-72 p-5"
            delay={0.5}
            floatClass="animate-float-slower"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <Mic className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-900">Voice Response</p>
              <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-red-400" />
            </div>
            <div className="mt-3">
              <Waveform />
            </div>
          </FloatingCard>

          <FloatingCard className="absolute right-2 top-56 w-60 p-5" delay={0.65}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-900">AI Feedback</p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
              Strong structure. Add a concrete metric to your STAR answer for more impact.
            </p>
          </FloatingCard>

          <FloatingCard
            className="absolute bottom-0 left-1/2 w-72 -translate-x-1/2 p-5"
            delay={0.8}
            floatClass="animate-float-slow"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-900">Weekly Analytics</p>
              <span className="text-[10px] text-emerald-600">+18%</span>
            </div>
            <div className="mt-3 flex h-20 items-end gap-1.5">
              {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-200 to-emerald-500"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-gray-400">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}
