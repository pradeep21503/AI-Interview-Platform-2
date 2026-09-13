import { useState, useRef, useCallback } from "react";
import {useNavigate} from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Users,
  Code,
  Brain,
  Sparkles,
  ChevronDown,
  Mic,
  Video,
  Clock,
  Globe,
  Play,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";

const INTERVIEW_TYPES = [
  {
    id: "hr",
    icon: Users,
        disabled:false,
    title: "HR Interview",
    description: "Behavioral and communication questions.",
  },
  {
    id: "dsa",
     disabled:false,
    icon: Brain,
    title: "DSA Interview",
    description: "Coding and problem solving.",
  }

];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const EXPERIENCE_LEVELS = ["Student", "Fresher", "1-3 Years", "3+ Years"];
const DURATIONS = [15, 30, 45, 60];
const AI_ANALYZES = [
  "Technical Skills",
  "Communication",
  "Confidence",
  "Problem Solving",
  "Resume Knowledge",
  "Coding Ability",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: "Resume Upload" },
    { num: 2, label: "Interview By AI" },
    { num: 3, label: "Feedback " },
  ];

  return (
    <div className="flex w-full items-center">
      {steps.map((step, idx) => {
        const isComplete = currentStep > step.num;
        const isActive = currentStep === step.num;
        return (
          <div key={step.num} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  backgroundColor: isComplete
                    ? "#10b981"
                    : isActive
                      ? "#10b981"
                      : "#f3f4f6",
                  borderColor: isComplete || isActive ? "#10b981" : "#e5e7eb",
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2"
              >
                {isComplete ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-400"}`}
                  >
                    {step.num}
                  </span>
                )}
              </motion.div>
              <span
                className={`hidden text-xs font-medium sm:block ${isActive || isComplete ? "text-gray-900" : "text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200 sm:mx-4">
                <motion.div
                  initial={false}
                  animate={{ width: currentStep > step.num ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ResumeUpload({file,setFile,setresumeid}) {

    const uploadResume = async () => {

        if (!file) return;

          setLoading(true);



        const formData = new FormData();



        formData.append("resume", file);

        const serverurl = "http://localhost:8000"

        try{

        const res = await fetch(serverurl+"/api/interview/upload-resume", {

            method: "POST",
            credentials:"include",
            body: formData,

        });

        const data = await res.json()

     if (!data.sucess) {

      throw new Error("Upload Failed");

    }



    setUploaded(true);
    setresumeid(data.resumeid)

    }

   catch (err) {
   
    alert(err.message);

  } finally {

    setLoading(false);

  }

};

  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFile = (e) => {

    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };
  const removeFile = () => {
    setFile(null);
  };

  return (

    <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">

      <h2 className="text-2xl font-bold text-gray-900">

        Upload Your Resume

      </h2>



      <p className="mt-2 text-gray-500">

        Upload your resume in PDF Format

      </p>



      {!file ? (

        <div className="mt-8 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-10 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">

            📄

          </div>



          <p className="text-lg font-semibold text-gray-800">

            Choose your resume

          </p>



          <p className="mt-1 text-sm text-gray-500">

            PDF (Max 5MB)

          </p>



          <input

            type="file"

            accept=".pdf"

            onChange={handleFile}

            className="mt-6 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white file:cursor-pointer hover:file:bg-emerald-700"

          />

        </div>

      ) : (

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="font-semibold text-gray-900">

                {file.name}

              </p>



              <p className="text-sm text-gray-500">

                {(file.size / 1024).toFixed(1)} KB

              </p>

            </div>



            <div className="text-3xl">✅</div>

          </div>



          <div className="mt-6 flex gap-3">

            {!uploaded && <button

              onClick={removeFile}

              className="rounded-xl bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"

            >

              Remove

            </button>
}

            <button

            onClick={uploadResume}

            disabled={loading || uploaded}

            className="rounded-xl bg-emerald-600 px-5 py-2 text-white"

            >

            {loading

                ? "Uploading..."

                : uploaded

                ? "Uploaded Successfully ✅"

                : "Continue"}

            </button>

          </div>

        </div>

      )}

    </div>

  );

}

function InterviewTypeSelector({ selected, setSelected }) {
  const navigate = useNavigate();
  return (
    <motion.div variants={fadeUp} custom={2}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          <Sparkles className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Choose Interview Type
          </h3>
          <p className="text-sm text-gray-400">Select one interview format</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {INTERVIEW_TYPES.map((type) => {
          const isSelected = selected === type.id;
          return (
            <motion.button
              key={type.id}
              type="button"
              whileHover={{ y: -4 }}
              disabled={type.disabled}
              whileTap={{ scale: 0.98 }}
             onClick={() => {
                setSelected(type.id);

                if (type.id === "dsa") {
                  navigate("/dsa/setup");
                }
              }}
              className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 ${
                isSelected
                  ? "border-emerald-400 bg-emerald-50/40 shadow-[0_0_30px_-6px_rgba(16,185,129,0.4)]"
                  : "border-gray-100 bg-white shadow-soft hover:border-emerald-200"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="selectedGlow"
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl"
                />
              )}
              <div className="relative flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gray-50 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                  }`}
                >
                  <type.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {type.title}
                    </h4>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
                      >
                        <Check className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {type.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function Dropdown({ label, icon: Icon, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-emerald-300"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-gray-400" />}
          {value}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white py-1.5 shadow-float"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-emerald-50 ${
                  value === opt
                    ? "font-semibold text-emerald-600"
                    : "text-gray-600"
                }`}
              >
                {opt}
                {value === opt && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toggle({ label, icon: Icon, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            enabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
          enabled ? "bg-emerald-500" : "bg-gray-200"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md ${
          enabled ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}

function InterviewSettings({
  difficulty,
  setDifficulty,
  experience,
  setExperience,
  duration,
  setDuration,
}) {
  return (
    <motion.div variants={fadeUp} custom={3}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          <Clock className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Interview Settings
          </h3>
          <p className="text-sm text-gray-400">Customize your session</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
        <div className="grid gap-5 sm:grid-cols-2">
          <Dropdown
            label="Difficulty"
            value={difficulty}
            options={DIFFICULTIES}
            onChange={setDifficulty}
          />
          <Dropdown
            label="Experience Level"
            value={experience}
            options={EXPERIENCE_LEVELS}
            onChange={setExperience}
          />
        </div>

     

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Estimated Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`rounded-2xl border py-3 text-sm font-semibold transition-all ${
                  duration === d
                    ? "border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_0_20px_-6px_rgba(16,185,129,0.4)]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200"
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Language
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900">
            <Globe className="h-4 w-4 text-emerald-500" />
            English
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SummarySidebar({
  file,
  interviewType,
  difficulty,
  duration,
  resumeid
}) {
  const typeLabel =
    INTERVIEW_TYPES.find((t) => t.id === interviewType)?.title || "—";

  const rows = [
    {
      label: "Resume",
      value: resumeid ? "Uploaded" : "Not uploaded",
      status: file ? "ok" : "pending",
    },
    { label: "Interview Type", value: typeLabel },
    { label: "Difficulty", value: difficulty },
    { label: "Estimated Time", value: `${duration} mins` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass sticky top-24 rounded-3xl border border-white/70 p-6 shadow-soft"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-md shadow-emerald-500/30">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Interview Summary</h3>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-sm text-gray-400">{row.label}</span>
            <span
              className={`flex items-center gap-1.5 text-sm font-semibold ${
                row.status === "ok"
                  ? "text-emerald-600"
                  : row.status === "pending"
                    ? "text-gray-400"
                    : "text-gray-900"
              }`}
            >
              {row.status === "ok" && <CheckCircle2 className="h-4 w-4" />}
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-gray-50/80 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          AI will analyze
        </p>
        <div className="grid grid-cols-1 gap-2">
          {AI_ANALYZES.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Interview({user,setuser}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [interviewType, setInterviewType] = useState("hr");
  const [difficulty, setDifficulty] = useState("Medium");
  const [experience, setExperience] = useState("Fresher");
  const [showmodal, setshowmodal] = useState(false);
  const [resumeid,setresumeid] = useState("");
  const [duration, setDuration] = useState(30);
  const navigate = useNavigate();
  const canStart = resumeid && interviewType;
 const startinterview = async () => {
    try {
        if(user.credits<50){
          alert("Less No of Credits");
          return ;
        }
        const serverurl = "http://localhost:8000";
       
        const res = await fetch(serverurl + "/api/hr/start", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                resumeid:resumeid,
                interviewtype: interviewType,
                difficulty,
                experience,
                duration,
            }),
        });

       const data = await res.json();
       setshowmodal(false);
       if(!data.sucess){
          alert(data.message)
          return ;
       }
    localStorage.setItem("sessionid", data.sessionid);


    navigate(`/interview/${data.sessionid}`);

    } catch (error) {

      alert(error.message);

    }
    };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white pt-24 pb-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-50/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Interview Setup
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Prepare for Your{" "}
            <span className="text-gradient-emerald">AI Interview</span>
          </h1>
          <p className="mt-4 text-base text-gray-500 sm:text-lg">
            Complete these steps before starting your interview.
          </p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-10 max-w-2xl rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-soft backdrop-blur"
        >
          <StepIndicator currentStep={currentStep} />
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: Steps */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Step 1 */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-soft backdrop-blur sm:p-8"
            >
              <ResumeUpload file={file} setFile={setFile} setresumeid={setresumeid}/>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-soft backdrop-blur sm:p-8"
            >
              <InterviewTypeSelector
                selected={interviewType}
                setSelected={setInterviewType}
              />
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-soft backdrop-blur sm:p-8"
            >
              <InterviewSettings
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                experience={experience}
                setExperience={setExperience}
           
  
                duration={duration}
                setDuration={setDuration}
              />
            </motion.div>

            {/* Bottom buttons */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={()=>navigate("/")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-soft transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: canStart ? 1.03 : 1 }}
                whileTap={{ scale: canStart ? 0.97 : 1 }}
                type="button"
                disabled={!canStart}
                    onClick={() => setshowmodal(true)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all sm:w-auto ${
                  canStart
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-emerald-500/30 hover:shadow-xl"
                    : "cursor-not-allowed bg-gray-200 text-gray-400 shadow-none"
                }`}
              >
                <Play className="h-4 w-4 fill-current" />
                Start AI Interview
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: Summary sidebar */}
          <div>
            <SummarySidebar
              file={file}
              interviewType={interviewType}
              difficulty={difficulty}
              duration={duration}
              resumeid ={resumeid}
            />
          </div>
          {showmodal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[420px] rounded-3xl bg-white p-8 shadow-2xl">

            <h2 className="text-2xl font-bold text-gray-900 text-center">
                Confirm Interview
            </h2>

            <p className="mt-4 text-center text-gray-600">
                Starting this interview will deduct
            </p>

            <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-emerald-600">
                    ⭐ 50 Credits
                </span>
            </div>

            <div className="mt-6 rounded-xl bg-gray-100 p-4">

                <div className="flex justify-between">
                    <span>Interview</span>
                    <span>{interviewType}</span>
                </div>

                <div className="mt-2 flex justify-between">
                    <span>Difficulty</span>
                    <span>{difficulty}</span>
                </div>

                <div className="mt-2 flex justify-between">
                    <span>Duration</span>
                    <span>{duration} mins</span>
                </div>

            </div>

            <p className="mt-5 text-center text-sm text-red-500">
                Credits will be deducted once the interview starts.
            </p>

            <div className="mt-8 flex gap-4">

                <button
                    onClick={() => setshowmodal(false)}
                    className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold"
                >
                    Cancel
                </button>

                <button
                    onClick={startinterview}
                    className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                    Confirm
                </button>

            </div>

        </div>
    </div>
          )}
        </div>
      </div>
    </div>
  );
}
