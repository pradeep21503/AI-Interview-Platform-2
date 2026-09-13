import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Clock,
  Send,
  CheckCircle2,
  Lightbulb,
  Users,
  BarChart3,
  Globe,
} from "lucide-react";
const QUICK_TIPS = [
  "Speak confidently",
  "Give structured answers",
  "Use examples",
  "Stay concise",
];
export default function InterviewPage() {
  const [answer, setAnswer] = useState("");
  const { sessionid } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [thinking, setThinking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Default to 15:42
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const maxChars = 1000;
 const handleInterviewTimeout = async () => {

}
  const loadSession = async () => {
    try {
      console.log("in")
      const serverurl = "http://localhost:8000";
      setLoading(true);
      const res = await fetch(`${serverurl}/api/hr/session/${sessionid}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.sucess) {
        throw new Error(data.message);
      }
      console.log(data);
      setSession(data.session);
      console.log(session)
      const startTime = new Date(data.session.createdAt).getTime();
      const duration = data.session.duration * 60;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeLeft(Math.max(0, duration - elapsed));
      setError("")
    } catch (error) {
      setError(error.message || "Something Went Wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const submitAnswer = async () => {
    if (!answer.trim() || thinking) return;
    try {
      setThinking(true);
      const serverurl = "http://localhost:8000";
      const res = await fetch(`${serverurl}/api/hr/answer`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionid,
          answer,
        }),
      });
      const data = await res.json();
      if (data.sucess) {
        if (data.completed) {
          navigate(`/feedback/${sessionid}`);
          return;
        }
        await loadSession();
        setAnswer("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setThinking(false);
    }
  };
  useEffect(() => {
    loadSession();
  }, []);
  // Set the timer based on the session duration
useEffect(() => {
    if (!session) return;

    const startTime = new Date(session.createdAt).getTime();
    const totalSeconds = session.duration * 60;

    const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        const remaining = Math.max(0, totalSeconds - elapsed);

        setTimeLeft(remaining);

        if (remaining === 0) {
            clearInterval(interval);
           handleInterviewTimeout();
        }
    }, 1000);

    return () => clearInterval(interval);

}, [session]);
  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // Auto-scroll to the bottom of conversation
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [session?.conversation, thinking]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };
  const INTERVIEW_DETAILS = [
    {
      label: "Interview Type",
      value: session?.interviewtype,
      icon: Users,
    },
    {
      label: "Difficulty",
      value: session?.difficulty,
      icon: BarChart3,
    },
    {
      label: "Duration",
      value: `${session?.duration} mins`,
      icon: Clock,
    },
    {
      label: "Experience",
      value: session?.experience,
      icon: Globe,
    },
  ];
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <style>{`
          @keyframes loadingProgress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
          .animate-loading-progress {
            animation: loadingProgress 2s infinite ease-in-out;
          }
        `}</style>
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-gray-200/50 transition-all duration-300 hover:shadow-2xl">
          {/* Animated AI Icon */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30 animate-pulse">
            <Bot className="h-10 w-10 text-white" />
            <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 animate-ping opacity-25" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 tracking-tight">
            Preparing Your Interview
          </h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed px-4">
            Our AI is reviewing your resume and preparing personalized interview questions.
          </p>
          {/* Progress Bar */}
          <div className="mt-8 relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 animate-loading-progress" />
          </div>
          <p className="mt-4 text-xs font-semibold text-emerald-600 tracking-wider uppercase animate-pulse">
            Setting up workspace...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 tracking-tight">
            Something Went Wrong
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {error}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition duration-200 hover:bg-gray-100 active:scale-95"
            >
              Go Back
            </button>
            <button
              onClick={loadSession}
              className="w-full sm:w-auto rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white transition duration-200 shadow-md shadow-emerald-500/10 hover:bg-emerald-600 active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50/50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bounceDot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-dot {
          animation: bounceDot 0.8s infinite ease-in-out;
        }
      `}</style>
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <h1 className="text-base font-bold text-gray-900 sm:text-lg">
            AI Interview
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live Interview
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Info Row */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700">
              AI HR Interview
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-bold text-gray-955">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-gray-400 font-medium">remaining</span>
          </div>
        </div>
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* LEFT: Conversation Card (75%) */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/30 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/40">
              
              {/* SECTION 1: Fixed Conversation Header */}
              <div className="shrink-0 border-b border-gray-100 p-6 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-md shadow-emerald-500/20">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-950">
                      AI HR Interviewer
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      Conducting your interview
                    </p>
                  </div>
                </div>
              </div>
              {/* SECTION 2: Conversation Area (approximately 70vh) */}
              <div 
                className="overflow-y-auto p-6 space-y-6 flex flex-col bg-gray-50/10" 
                style={{ height: "60vh" }}
              >
                {session?.conversation?.map((item, idx) => (
                  <div key={idx} className="flex flex-col space-y-6">
                    {/* AI Message */}
                    {item.question && (
                      <div className="flex gap-3.5 items-start max-w-[85%] self-start animate-fade-in">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
                          <Bot className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="rounded-3xl rounded-tl-sm bg-emerald-50/60 text-emerald-955 border border-emerald-100/40 px-5 py-4 text-sm font-medium leading-relaxed shadow-sm">
                          <p className="whitespace-pre-wrap">{item.question}</p>
                        </div>
                      </div>
                    )}
                    {/* User Message */}
                    {item.answer && (
                      <div className="flex gap-3.5 items-start max-w-[80%] self-end justify-end animate-fade-in">
                        <div className="rounded-3xl rounded-tr-sm bg-blue-600 text-white px-5 py-4 text-sm font-medium leading-relaxed shadow-md shadow-blue-500/10">
                          <p className="whitespace-pre-wrap">{item.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* AI Thinking/Typing State */}
                {thinking && (
                  <div className="flex gap-3.5 items-start max-w-[85%] self-start animate-fade-in">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
                      <Bot className="h-4.5 w-4.5 text-emerald-600" />
                    </div>
                    <div className="rounded-3xl rounded-tl-sm bg-emerald-50/60 border border-emerald-100/40 px-6 py-4 shadow-sm flex items-center gap-1.5 h-12">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce-dot" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce-dot" style={{ animationDelay: "200ms" }} />
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce-dot" style={{ animationDelay: "400ms" }} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              {/* SECTION 3: Sticky Bottom Answer Area */}
              <div className="shrink-0 border-t border-gray-100 p-6 bg-white">
                <div className="relative">
                  <textarea
                    value={answer}
                    disabled={thinking}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={maxChars}
                    placeholder="Type your answer here..."
                    className="w-full min-h-[90px] max-h-[160px] resize-none rounded-2xl border border-gray-200 bg-gray-50/30 p-4 pb-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all duration-200 disabled:opacity-60"
                  />
                  <div className="absolute bottom-3 right-4">
                    <span
                      className={`text-xs font-semibold select-none ${
                        answer.length > maxChars * 0.9
                          ? "text-amber-500"
                          : "text-gray-400"
                      }`}
                    >
                      {answer.length} / {maxChars}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={submitAnswer}
                    disabled={thinking || !answer.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span>Submit Answer</span>
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT: Sidebar (25%) */}
          <div className="flex flex-col gap-6">
            
            {/* Sidebar Card 1: Interview Details */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <h3 className="mb-4 text-sm font-bold text-gray-955 tracking-tight">
                Interview Details
              </h3>
              <div className="flex flex-col gap-3.5">
                {INTERVIEW_DETAILS.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-gray-500 font-medium">
                      <detail.icon className="h-4.5 w-4.5 text-gray-400" />
                      {detail.label}
                    </span>
                    <span className="text-sm font-bold text-gray-955">
                      {detail.value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Sidebar Card 2: Quick Tips */}
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                  <Lightbulb className="h-4.5 w-4.5 text-white" />
                </div>
                <h3 className="text-sm font-bold tracking-tight">Quick Tips</h3>
              </div>
              <div className="flex flex-col gap-3">
                {QUICK_TIPS.map((tip) => (
                  <div
                    key={tip}
                    className="flex items-center gap-2.5 text-sm font-medium text-emerald-50"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-white opacity-90" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
