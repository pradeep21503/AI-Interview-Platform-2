import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  Terminal,
  Sparkles,
  Brain,
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react";

export default function DsaInterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const messagesEndRef = useRef(null);

  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/dsa/session/${sessionId}`,
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setSession(data.session);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const messages = session?.conversation || [];
  const selectedLanguage = session?.language || "javascript";

  useEffect(() => {
    if (session && session.code !== undefined) {
      setCode(session.code || "");
    }
  }, [session?.code]);

  useEffect(() => {
    if (!session?.createdAt || !session?.duration) return;

    const calculateTimeLeft = () => {
      const start = new Date(session.createdAt).getTime();
      const durationMs = session.duration * 60 * 1000;
      const now = new Date().getTime();
      const difference = start + durationMs - now;

      if (difference <= 0) {
        return "00:00";
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      return `${formattedMinutes}:${formattedSeconds}`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.createdAt, session?.duration]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/dsa/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-session-id": sessionId
          },
          credentials: "include",
          body: JSON.stringify({
            message: inputText,
            code: code
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      setSession(data.session);
      setInputText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none overflow-hidden antialiased">
      {/* ========================================================================= */}
      {/* HEADER SECTION (72px)                                                     */}
      {/* ========================================================================= */}
      <header className="h-[72px] min-h-[72px] border-b border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md px-6 flex items-center justify-between relative z-30">
        {/* Left Side: Brand Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              AI DSA Interview
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              ID: {session?._id || sessionId}
            </span>
          </div>
        </div>

        {/* Center: Info Placeholders */}
        <div className="hidden md:flex items-center gap-4 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-850/80">
            <span className="text-zinc-500">Progress:</span>
            <span className="text-zinc-200">
              {session?.stage === "INTRODUCTION"
                ? "Introduction"
                : session?.stage === "TECHNICAL"
                ? `Question ${session?.completedTopics?.length + 1 || 1}`
                : "Feedback"}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-850/80">
            <span className="text-zinc-500">Language:</span>
            <span className="text-zinc-200">{session?.language || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-850/80">
            <span className="text-zinc-500">Timer:</span>
            <span className="text-indigo-400 font-semibold animate-pulse">
              {timeLeft || "00:00"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* End Button */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to end this interview session? Your progress will be saved."
                )
              ) {
                navigate("/");
              }
            }}
            className="px-3.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 text-red-400 hover:text-red-300 text-xs font-medium rounded-lg transition-all"
          >
            End Interview
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER LAYOUT (Split 40% Left / 60% Right)                        */}
      {/* ========================================================================= */}
      <main className="flex-1 flex overflow-hidden w-full relative z-20">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT PANEL: Conversation Section                                        */}
        {/* ----------------------------------------------------------------------- */}
        <section className="w-[40%] min-w-[320px] max-w-[550px] border-r border-zinc-800/80 bg-zinc-950/50 flex flex-col h-full relative">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none my-auto">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight mb-2">
                  Waiting for Interview
                </h3>
                <p className="text-xs text-zinc-400 max-w-[280px] leading-relaxed mb-1">
                  The AI interviewer will start the conversation shortly.
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Once the backend is connected this will disappear automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-5 flex-1">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => {
                    const isAi =
                      msg.role === "ai" ||
                      msg.role === "assistant" ||
                      msg.role === "system";
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`flex items-start gap-3.5 ${
                          isAi ? "" : "flex-row-reverse"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 select-none ${
                            isAi
                              ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-md border border-indigo-400/20"
                              : "bg-zinc-850 text-zinc-300 border border-zinc-700/50"
                          }`}
                        >
                          {isAi ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <span className="font-semibold font-mono">ME</span>
                          )}
                        </div>

                        {/* Chat Bubble Wrapper */}
                        <div
                          className={`flex flex-col max-w-[80%] ${
                            isAi ? "items-start" : "items-end"
                          }`}
                        >
                          {/* Bubble Card */}
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              isAi
                                ? "bg-zinc-900/60 border border-zinc-850/80 text-zinc-200 rounded-tl-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                                : "bg-zinc-800/70 border border-zinc-700/30 text-zinc-100 rounded-tr-sm shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                            }`}
                          >
                            <p className="whitespace-pre-line">
                              {msg.message}
                            </p>
                          </div>

                          {/* Timestamp */}
                          <span className="text-[10px] text-zinc-500 mt-1.5 font-mono px-1">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString()
                              : ""}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Composer */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-900 relative">
            {/* Focus shadow animation ring wrapped dynamically */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sending}
                rows={2}
                className="w-full bg-transparent border-0 outline-none text-zinc-100 text-sm placeholder-zinc-500 resize-none py-1 focus:ring-0 focus:outline-none"
              />

              {/* Composer Action Toolbar Row */}
              <div className="flex items-center justify-end border-t border-zinc-800/60 pt-2.5 mt-2.5">
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !inputText.trim()}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    inputText.trim() && !sending
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {sending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT PANEL: Code Studio Section (60% width)                            */}
        {/* ----------------------------------------------------------------------- */}
        <section className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden relative">
          {/* ===================================================================== */}
          {/* PROBLEM CARD PLACEHOLDER or ACTIVE QUESTION                           */}
          {/* ===================================================================== */}
          {session?.stage === "TECHNICAL" && session?.currentQuestion ? (
            <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md flex flex-col gap-4 animate-fadeIn overflow-y-auto max-h-[300px]">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white tracking-tight">
                    {session.currentQuestion.title}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium font-mono border ${
                    session.currentQuestion.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    session.currentQuestion.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {session.currentQuestion.difficulty}
                  </span>
                </div>
              <div
    className="prose prose-invert prose-sm max-w-none text-zinc-300 mt-2"
    dangerouslySetInnerHTML={{
        __html: session.currentQuestion.problemStatement,
    }}
/>
              </div>

              {session.currentQuestion.examples?.map((ex, index) => (
  <div
    key={index}
    className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-xs font-mono space-y-2"
  >
    <div>
      <span className="text-zinc-500">Input:</span>
      <pre>{ex.input}</pre>
    </div>

    <div>
      <span className="text-zinc-500">Output:</span>
      <pre>{ex.output}</pre>
    </div>

    {ex.explanation && (
      <div>
        <span className="text-zinc-500">Explanation:</span>
        <pre>{ex.explanation}</pre>
      </div>
    )}
  </div>
))}

              {session.currentQuestion.constraints && (
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-white font-mono">Constraints:</h3>
                  {Array.isArray(session.currentQuestion.constraints) ? (
                    <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1">
                      {session.currentQuestion.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
                      {session.currentQuestion.constraints}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md flex flex-col gap-4 animate-fadeIn">
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">
                  Waiting for Interview
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Your AI interviewer is preparing your interview.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-400 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>The interview will begin with a short introduction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Explain your thought process clearly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>
                    Coding will unlock automatically when the interview reaches the
                    coding stage.
                  </span>
                </li>
              </ul>

              <div className="flex items-center justify-between border-t border-zinc-800/40 pt-3 mt-1">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                  Interview Status
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-medium font-mono animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Preparing...
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* MONACO CODE EDITOR COMPONENT                                          */}
          {/* ===================================================================== */}
          <div className="flex-1 w-full relative bg-zinc-950 border-b border-zinc-900 overflow-hidden">
            {/* Monaco Editor Frame */}
            <div className="w-full h-full pt-1.5">
              <Editor
                height="100%"
                theme="vs-dark"
                language={selectedLanguage}
                value={code}
                onChange={handleEditorChange}
                options={{
                  readOnly: session?.topicStatus !== "CODING"
                }}
                loading={
                  <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    <span className="text-xs text-zinc-400 font-mono">
                      Preparing Coding Workspace...
                    </span>
                  </div>
                }
              />
            </div>
          </div>

          {/* ===================================================================== */}
          {/* CONSOLE DRAWER (Collapsible)                                          */}
          {/* ===================================================================== */}
          <div
            className={`border-t border-zinc-900 bg-zinc-950 flex flex-col transition-all duration-300 relative z-25 ${
              consoleOpen ? "h-[220px]" : "h-[36px]"
            }`}
          >
            {/* Console Title Bar Toggle */}
            <div
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="h-[36px] bg-zinc-900/30 flex items-center justify-between px-4 hover:bg-zinc-900/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-zinc-300 tracking-wide font-mono">
                  Console Output
                </span>
              </div>

              <div className="text-zinc-500 hover:text-zinc-300">
                {consoleOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Console Panel Content Body */}
            {consoleOpen && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-xs text-zinc-500 font-mono bg-zinc-950 select-none">
                <Terminal className="w-5 h-5 text-zinc-650" />
                <span>No executions yet.</span>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* EDITOR TOOLBAR SECTION                                                */}
          {/* ===================================================================== */}
          <div className="h-[52px] bg-zinc-900/30 border-t border-zinc-800/80 px-4 flex items-center justify-between shrink-0 relative z-30">
            {/* Left: Language Dropdown Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium font-sans">
                Language:
              </span>
              <select
                value={selectedLanguage}
                disabled
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:text-zinc-200 transition-colors font-mono cursor-not-allowed opacity-60"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC 17)</option>
                <option value="java">Java (OpenJDK 17)</option>
              </select>
            </div>

            {/* Right: Code actions buttons */}
            <div className="flex items-center gap-2">
              {/* Run Code */}
              <button
                disabled={session?.topicStatus !== "CODING"}
                className={`flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-medium rounded-lg transition-all ${
                  session?.topicStatus === "CODING"
                    ? "text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer"
                    : "text-zinc-500 opacity-50 cursor-not-allowed"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Run
              </button>

              {/* Submit Code */}
              <button
                disabled={session?.topicStatus !== "CODING"}
                className={`px-3.5 py-1.5 bg-indigo-600 text-xs font-medium rounded-lg transition-all ${
                  session?.topicStatus === "CODING"
                    ? "text-white hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-500/20"
                    : "text-white/50 opacity-50 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}